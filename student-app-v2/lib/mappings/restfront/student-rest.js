'use strict';

const Devebot = require('devebot');
const lodash = Devebot.require('lodash');

module.exports = [
  // POST /students
  {
    path: '/students',
    method: 'POST',
    serviceName: 'application/studentService',
    methodName: 'createStudent',
    input: {
      transform: function (req) {
        return {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          rank: req.body.rank,
          dataTag: req.headers.datatag,
          timezone: req.headers.timezone || constants.TIMEZONE_DEFAULT,
          holderId: lodash.isNil(req.accessToken)
            ? 'can-not-get-holderId'
            : req.accessToken.holderId
        };
      },
    },
  },
  // GET /students
  {
    path: '/students',
    method: 'GET',
    serviceName: 'application/studentService',
    methodName: 'getStudents',
    input: {
      transform: function (req) {
        return {
          params: req.query,
        };
      },
    },
  },
  // GET /students/:id
  {
    path: '/students/:id',
    method: 'GET',
    serviceName: 'application/studentService',
    methodName: 'getStudentById',
    input: {
      transform: function (req) {
        return {
          id: req.params.id,
        };
      },
    },
  },
  // PUT /students/:id
  {
    path: '/students/:id',
    method: 'PUT',
    serviceName: 'application/studentService',
    methodName: 'updateStudentById',
    input: {
      transform: function (req) {
        return {
          id: req.params.id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          ranked: req.body.ranked,
        };
      },
    },
  },
  // DELETE /students/:id
  {
    path: '/students/:id',
    method: 'DELETE',
    serviceName: 'application/studentService',
    methodName: 'deleteStudentById',
    input: {
      transform: function (req) {
        return {
          id: req.params.id
        }
      }
    }
  }
];
