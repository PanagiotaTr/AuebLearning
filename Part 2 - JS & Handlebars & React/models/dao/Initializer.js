const UserMemoryDao = require("../memorydao/UserMemoryDao");

class Initializer {
    
    prepareData(){};

    getUserDao() {
      return new UserMemoryDao();
    }
}
  
module.exports = Initializer;
  