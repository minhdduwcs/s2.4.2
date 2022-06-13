/* eslint-disable no-undef */
'use strict';

const Devebot = require('devebot');
const chores = Devebot.require('chores');
const envcloak = require('envcloak').instance;
const lodash = Devebot.require('lodash');
const chaiAsPromised = require('chai-as-promised')
const assert = require('liberica').chai.use(chaiAsPromised).assert;
const DBHelper = require('../utils/db-util');
const ObjectId = require('mongoose').Types.ObjectId;

const app = require('../server');

const studentData = require('./data/student-data');

const CONNECT_ARGS = {
  host: '172.17.0.2',
  port: '27017',
  db: 'student-test',
  username: process.env.MONGO_FC_USERNAME,
  password: process.env.MONGO_FC_PASSWORD,
};

const ENV_CLOAK_CONFIG = {
  NODE_ENV: 'test',
  LOGOLITE_FULL_LOG_MODE: 'false',
  LOGOLITE_ALWAYS_MUTED: 'all',
  appDatastore_mongoose_manipulator_host: CONNECT_ARGS.host,
  appDatastore_mongoose_manipulator_port: CONNECT_ARGS.port,
  appDatastore_mongoose_manipulator_db: CONNECT_ARGS.db,
  appDatastore_mongoose_manipulator_username: CONNECT_ARGS.username,
  appDatastore_mongoose_manipulator_password: CONNECT_ARGS.password,
};

async function getService(app, serviceName) {
  const injektor = await app.runner.invoke(lodash.identity);
  const sandboxManager = injektor.lookup('sandboxManager');
  return sandboxManager.getSandboxService(serviceName);
}
describe('adm-api', function () {
  this.timeout(20000);
  const dbUtil = new DBHelper(CONNECT_ARGS, CONNECT_ARGS.db);

  before(async function () {
    envcloak.setup(ENV_CLOAK_CONFIG);
    chores.clearCache();
    await dbUtil.start();
  });

  after(async function () {
    envcloak.reset();
    chores.clearCache();
    await dbUtil.stop();
    process.exit(0);
  });

  describe('createStudent()', () => {
    createStudentTest(app, dbUtil);
  });
  describe('updateStudent()', () => {
    updateStudentTest(app, dbUtil);
  });
});

function createStudentTest(app, dbUtil) {
  let args, studentService;
  before(async function (){
    studentService = await getService(app, 'studentService')
  });
  after(async () => {
    await dbUtil.cleanup();
  });
  beforeEach(async () => {
    await dbUtil.cleanup();
    await dbUtil.insertCollections(studentData);

    args = {
      "firstName": "Văn Trung",
      "lastName": "Hưng",
      "phoneNumber": "0859997887",
      "email": "hun@gmail.com",
      "ranked": "686faf56-d573-42ab-b37e-363ded840995"
    };
  });
  it('success case', async () => {
    const resData = await studentService.createStudent(args);
    
    const matchFields = [
      'firstName',
      'lastName',
      'phoneNumber',
      'email',
      'ranked',
    ];

    assert.deepEqual(
      lodash.pick(resData, matchFields),
      lodash.pick(args, matchFields),
    );
  });
  it('[firstName] is required', async () => {
    lodash.unset(args, 'firstName');

    await assert.isRejected(studentService.validateStudent(args));                        
  }); 
  it('[lastName] is required', async () => {
    lodash.unset(args, 'lastName');

    await assert.isRejected(studentService.validateStudent(args));                        
  }); 
  it('[phoneNumber] is required', async () => {
    lodash.unset(args, 'phoneNumber');

    await assert.isRejected(studentService.validateStudent(args));                        
  }); 
  it('[email] is required', async () => {
    lodash.unset(args, 'email');

    await assert.isRejected(studentService.validateStudent(args));                        
  }); 
  it('[phoneNumber] has format', async () => {
    lodash.set(args, 'phoneNumber', '00000000a')

    await assert.isRejected(studentService.validateStudent(args));  
  });
  it('[phoneNumber] is unique', async () => {
    lodash.set(args, 'phoneNumber', '0000000000')

    await assert.isRejected(studentService.validateStudent(args));  
  });
  it('[email] is unique', async () => {
    lodash.set(args, 'email', 'test@gmail.com')

    await assert.isRejected(studentService.validateStudent(args));  
  });
}

function updateStudentTest(app, dbUtil) {
  let args, studentService, id;
  before(async function (){
    studentService = await getService(app, 'studentService')
    id = "6295eb5bdcc1b6a8d9c6fa07"
  });
  after(async () => {
    await dbUtil.cleanup();
  });
  beforeEach(async () => {
    await dbUtil.cleanup();
    await dbUtil.insertCollections(studentData);

    args = {
      "firstName": "Văn Trung",
      "lastName": "Hưng",
      "phoneNumber": "0859997887",
      "email": "hun@gmail.com",
      "ranked": "686faf56-d573-42ab-b37e-363ded840995"
    };
    
  });
  it('success case', async () => {
    lodash.set(args, "id", id)
    await studentService.updateStudentById(args);
    const resData = await studentService.getStudentById({id})
    const matchFields = [
      'firstName',
      'lastName',
      'phoneNumber',
      'email',
      'ranked',
    ];

    assert.deepEqual(
      lodash.pick(resData, matchFields),
      lodash.pick(args, matchFields),
    );
  });
  it('[firstName] is required', async () => {
    lodash.unset(args, 'firstName');

    await assert.isRejected(studentService.validateStudent(args, id));                        
  }); 
  it('[lastName] is required', async () => {
    lodash.unset(args, 'lastName');

    await assert.isRejected(studentService.validateStudent(args, id));                        
  }); 
  it('[phoneNumber] is required', async () => {
    lodash.unset(args, 'phoneNumber');

    await assert.isRejected(studentService.validateStudent(args, id));                        
  }); 
  it('[email] is required', async () => {
    lodash.unset(args, 'email');

    await assert.isRejected(studentService.validateStudent(args, id));                        
  }); 
  it('[phoneNumber] has format', async () => {
    lodash.set(args, 'phoneNumber', '00000000a')

    await assert.isRejected(studentService.validateStudent(args, id));  
  });
  it('[phoneNumber] is unique', async () => {
    lodash.set(args, 'phoneNumber', '0000000000')
    

    await assert.isRejected(studentService.validateStudent(args, id));  
  });
  it('[email] is unique', async () => {
    lodash.set(args, 'email', 'test@gmail.com')

    await assert.isRejected(studentService.validateStudent(args, id));  
  });
}