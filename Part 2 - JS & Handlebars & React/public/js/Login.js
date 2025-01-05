const { v4: uuidv4 } = require('uuid');
const MemoryInitializer = require('../../models/memorydao/MemoryInitializer');
const User = require('../../models/domain/User');

const initializer = new MemoryInitializer()

class Login{

  static generateUuid() {
      return uuidv4();
    }
  
  static checkUser(username, password) {
      let sessionId = Login.generateUuid()
      let userLogin = new User(username, password)
      userLogin.sessionId = sessionId
      let promise = initializer.getUserDao().update(userLogin)

      // console.log(initializer.getUserDao().findAll())
      return promise
        .then(updated => {
          if (updated) {
            return sessionId;
          }
          else {
            return null;
          }
        })
        .catch(error => {
          throw error
        });
    }

}

module.exports = Login