'use strict';

module.exports = {
  name: 'StudentModel',
  descriptor: {
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    rank: {
      type: String,
      enum: [
        '145a3331-704b-48c7-a54e-6aadbaa12e7d', // excellent
        'b58acb5c-d8e4-4baa-b63b-64114c1d1dc9', // good
        'd3a2de07-5f08-4275-9fd6-cf79c1596a38', // average
        '3b90e08f-a8e0-4606-aaec-6a6881bc1fae', // weak
      ]
    },
    // filtering
    slug: { type: String },
    tags: [ String ],
    activated: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    // auditing
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String }
  },
  options: {
    collection: 'students',
  },
};
