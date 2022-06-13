'use strict';

const Devebot = require('devebot');
const Promise = Devebot.require('bluebird');
const lodash = Devebot.require('lodash');
const slugify = require('slugify');
const Joi = require('joi');

function Service(params = {}) {
  const { dataManipulator, errorBuilder } = params;

  this.createStudent = async function (args, opts = {}) {
    try {
      await this.validateStudent(args);
      
      // Create
      const slugName = slugifyName(args.firstName, args.lastName)
      lodash.set(args, "slug", slugName);

      return dataManipulator.create({ type: 'StudentModel', data: args });

    } catch (error) {
        throw errorBuilder.newError('GeneralError', {
          payload: { 
            message: error.message,
            args 
          },
        });
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