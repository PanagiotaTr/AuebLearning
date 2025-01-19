const UserMemoryDao = require("../memorydao/UserMemoryDao");
const UserMongoDao = require("../mongodao/UserMongoDao");

class Initializer {
    
    prepareData(){};

    getUserDao() {
      return process.env.useMongoDb === undefined? new UserMemoryDao() : new UserMongoDao()
    }
}
  
module.exports = Initializer;
  