'use strict';

const Devebot = require('devebot');
const Promise = Devebot.require('bluebird');
const lodash = Devebot.require('lodash');
const moment = require('moment-timezone');
const slugify = require('slugify');
const Joi = require('joi');

const constants = require('../utils/constants');
const { slugifyString } = require('../utils/string-util');
const { defaultSchema } = require('../utils/joi-util');
const logHelper = new (require('../utils/log-helper'))();

function Service(params = {}) {
  const {
    loggingFactory,
    dataManipulator,
    errorBuilder
  } = params;

  const L = loggingFactory.getLogger();
  const T = loggingFactory.getTracer();
  logHelper.add(L, T);

  this.createStudent = async function (args, opts = {}) {
    const { requestId } = opts;
    try {
      let schema = lodash.cloneDeep(defaultSchema);
      schema = schema.append({
        firstName: Joi.string()
          .required(),
        lastName: Joi.string()
          .required(),
        email: Joi.string()
          .required()
          .external(validateEmailIsUnique(args)),
        phoneNumber: Joi.string()
          .required(),
          // .external(),
        rank: Joi.string()
          .required(),
      });

      // load validated data
      const validatedData = await schema.validateAsync(args, {
        stripUnknown: true
      });

      const ctx = loadContext(validatedData);
      let resData = await upsertStudent(validatedData, ctx);

      // convert response data
      if (!lodash.isNil(resData)) {
        resData = resData.toJSON();
        resData.id = resData._id.toString();
        delete resData._id;
      }

      return resData;
    } catch (err) {
      logHelper.log(
        { requestId, err: err.message },
        'Req[${requestId}], function createStudent has failed with error[${err}]',
        'error'
      );
      return Promise.reject(err);
    } 
  };

  this.getStudents = async function (args, opts = {}) {
    let {q, type} = args.params;

    q = slugify(q, {
      replacement: '-',
      lower: true,
      trim: true
    })

    return dataManipulator.find({ type: 'StudentModel', query: {
      deleted: false,
      ranked: type,
      $or: [
        {slug: {$regex: q}}, 
        {phoneNumber: {$regex: q}}, 
        {email: {$regex: q}}
      ]  
    }});
  };

  this.getStudentById = async function (args, opts = {}) {
    return dataManipulator.findOne({type: 'StudentModel', query: {
      _id: args.id, 
      deleted: false
    }});
  };

  this.updateStudentById = async function (args, opts = {}) {
    try {
      const id = args.id;
      lodash.unset(args, 'id');
      await this.validateStudent(args, id);

      const slugName = slugifyName(args.firstName, args.lastName)
      lodash.set(args, "slug", slugName);
      // Update data
      return dataManipulator.update({ type: 'StudentModel', data: args, _id: id});
      
    } catch (error) {
      throw errorBuilder.newError('GeneralError', {
          payload: { 
            message: error.message,
            args 
          },
      });      
    } 
  };

  this.deleteStudentById = async function(args, opts = {}) {
    const id = args.id;
    lodash.unset(args, 'id');
    lodash.set(args, 'deleted', true);
    // const student = {...args, deleted: true}
    return dataManipulator.update({ type: 'StudentModel', data: args, _id: id});
  }

  this.validateStudent = async (args, id=null) => {
    const studentSchema = Joi.object({
      firstName: Joi.string()
        .required(),
      lastName: Joi.string()
        .required(),
      email: Joi.string()
        .email()
        .required()
        .external( async (email) => {
          const duplicatedEmail = await dataManipulator.findOne({
            type: 'StudentModel', 
            query: {
              _id: { $not: { $in: [id] } },
              email: email,
              deleted: false
            }  
          });
          if(duplicatedEmail){
              throw new Error('Duplicated email!');
          }
        }),
      phoneNumber: Joi.string()
        .required()
        .pattern(/(\+84|84|0)[0-9]{9}\b/)
        .external( async (phoneNumber) => {
          const duplicatedPhoneNumber = await dataManipulator.findOne({
            type: 'StudentModel', 
            query: {
              _id: { $not: { $in: [id] } },
              phoneNumber: phoneNumber,
              deleted: false
            }  
          });
          if(duplicatedPhoneNumber){
              throw new Error('Duplicated phone number!');
          }
        }),
      ranked: Joi.string()
        .required(),
    });
  
    const {value, error} = await studentSchema.validateAsync(args);
    
    if(error) {
      throw new Error(error);
    }
  }

  function validateEmailIsUnique(args) {
    return async email => {
      const record = await dataManipulator.findOne({
        type: 'StudentModel',
        query: {
          _id: { $ne: lodash.get(args, 'id') },
          email: {
            $regex: `^${email}$`,
            $options: 'i'
          }
        }
      });
      if (!lodash.isNil(record)) {
        return Promise.reject(
          errorBuilder.newError('StudentService_Email_Unique')
        );
      }
    }
  }

  async function upsertStudent(updateData, ctx) {
    const studentId = lodash.get(updateData, 'id');
    const { dataTag, holderId, now } = ctx;

    // add slug field
    const firstName = lodash.get(updateData, 'firstName');
    const lastName = lodash.get(updateData, 'lastName');
    if (lodash.isString(firstName) && lodash.isString(lastName)) {
      const slug = slugifyString(`${lastName} ${firstName}`);
      lodash.set(updateData, 'slug', slug);
    }

    if (lodash.isString(studentId)) {
      return dataManipulator.findOneAndUpdate({
        type: 'StudentModel',
        query: {
          _id: studentId
        },
        update: {
          ...updateData,
          tags: dataTag,
          updatedAt: now,
          updatedBy: holderId
        }
      })
    } else {
      return dataManipulator.create({
        type: 'StudentModel',
        data: {
          ...updateData,
          tags: dataTag,
          createdAt: now,
          updatedAt: now,
          createdBy: holderId,
          updatedBy: holderId
        }
      });
    }
  }
}

function loadContext(args) {
  const dataTag = lodash.get(args, 'dataTag');
  const holderId = lodash.get(args, 'holderId');
  const timezone = lodash.get(args, 'timezone', constants.TIMEZONE_DEFAULT);
  const now = moment.tz(timezone);
  return { dataTag, holderId, timezone, now };
}

const slugifyName = (firstName, lastName) => {
  const fullName = firstName + ' ' + lastName;
  const slugName = slugify(fullName, {
      replacement: '-',
      lower: true,
      trim: true
  })
  return slugName;
}

Service.referenceHash = {
  dataManipulator: 'app-datastore/dataManipulator',
  errorBuilder: 'errorBuilder',
};

module.exports = Service;
