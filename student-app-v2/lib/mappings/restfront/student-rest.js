'use strict';

module.exports = [
  // Create
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
          ranked: req.body.ranked,
        };
      },
    },
  },
  // Read
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
  // Read by id
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
  // Update
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
  // Delete
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