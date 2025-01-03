const Initializer = require("../dao/Initializer");
const UserMemoryDao = require("../memorydao/UserMemoryDao");
const User = require("../domain/User");

class MemoryInitializer extends Initializer {
    
  prepareData() {

    const user1 = new User("Pug", "pug12345678#")
    const user2 = new User("George", "George123#")
    const user3 = new User("example", "Pass1234@")

    this.getUserDao().save(user1);
    this.getUserDao().save(user2);
    this.getUserDao().save(user3);

    console.log("Prostethikan Users");
  }

}

module.exports = MemoryInitializer;
