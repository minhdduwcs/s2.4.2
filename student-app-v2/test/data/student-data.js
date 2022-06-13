const ObjectId = require('mongoose').Types.ObjectId;
module.exports = 
  {
    students: [
      {
        "_id": ObjectId("6295dc7ee76bf16f490ab57f"),
        "firstName": "TEST",
        "lastName": "TEST",
        "phoneNumber": "0000000000",
        "email": "test@gmail.com",
        "ranked": "686faf56-d573-42ab-b37e-363ded840995",
        "slug": "test-test",
        "deleted": false
      },
      {
        "_id": ObjectId("6295eb5bdcc1b6a8d9c6fa07"),
        "firstName": "TEST2",
        "lastName": "TEST2",
        "phoneNumber": "0111111111",
        "email": "test2@gmail.com",
        "ranked": "686faf56-d573-42ab-b37e-363ded840995",
        "slug": "test2-test2",
        "deleted": false
      }
    ]
  }
  
