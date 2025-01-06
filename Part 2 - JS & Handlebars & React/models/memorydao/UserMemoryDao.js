const UserDao = require("../dao/UserDao")
const User = require("../domain/User")

class UserMemoryDao extends UserDao{

    static users = []

    save(user){
        return new Promise((resolve, reject) => {
            let saved = false
            let foundUser = UserMemoryDao.users.find(userObject => user.equals(userObject))
            if(foundUser === undefined){
                UserMemoryDao.users.push(user)
                saved = true
            }
            return resolve(saved)
        })
    }

    update(user){
        return new Promise((resolve, reject) => {
            let updated = false
            let foundUser = UserMemoryDao.users.find(userObject => user.equals(userObject))
            if(foundUser !== undefined){
                foundUser.update(user)
                updated = true
            }
            resolve(updated)
        })
    }

    findUser(username, sessionId){
        return new Promise((resolve, reject) => {
            let foundUser = UserMemoryDao.users.find(userObject => username === userObject.getUsername && sessionId === userObject.getSessionId)
            resolve(foundUser)
        })
    }


    findAll(){
        let temp = []
        for(let user of UserMemoryDao.users){
            temp.push(user)
        }
        return temp
    }
}

module.exports = UserMemoryDao;