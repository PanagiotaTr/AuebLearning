const Initializer = require("../dao/Initializer");
const UserMemoryDao = require("../memorydao/UserMemoryDao");
const User = require("../domain/User");

class MemoryInitializer extends Initializer {

  prepareData() {

    // Users are already defined if mongoDB is used, so init them only for local DAO

    if(process.env.useMongoDb === undefined){
      console.log('Initiallizing Data...')
      const user1 = new User("user", "User123#")
      const user2 = new User("george", "George123#")
      const user3 = new User("example", "Pass1234@")
      const user4 = new User("test","test123#")

      this.getUserDao().save(user1)
      this.getUserDao().save(user2)
      this.getUserDao().save(user3)
      this.getUserDao().save(user4)
    }

  }

}

module.exports = MemoryInitializer;
