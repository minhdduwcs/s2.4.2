'use strict';

module.exports = {
  name: 'StudentModel',
  descriptor: {
    firstName: { 
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    ranked: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
    },
  },
  options: {
    collection: 'students',
  },
};