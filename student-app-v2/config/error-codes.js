'use strict';

module.exports = {
  GeneralError: {
    message: 'Có lỗi xảy ra',
    returnCode: 500,
    statusCode: 400
  },
  StudentService_Email_Unique: {
    message: 'Email bị trùng',
    returnCode: 501,
    statusCode: 400
  },
  StudentService_PhoneNumber_Unique: {
    message: 'Số điện thoại bị trùng',
    returnCode: 502,
    statusCode: 400
  },
  StudentService_IdNumber_Unique: {
    message: 'CMND/CCCD bị trùng',
    returnCode: 503,
    statusCode: 400
  },
}
