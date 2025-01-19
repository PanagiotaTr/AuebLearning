const UserDao = require("../dao/UserDao")
const User = require("../domain/User")

class UserMemoryDao extends UserDao{

    static users = []

    /**
     * 
     * @param {User} user - The user object to be saved in the table users
     * @returns {Promise<boolean>} - A promise that resolves true if the user is properly saved, else false
     */
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

    /**
     * 
     * @param {User} user - The user object to be updated (Change username, password and sessionId)
     * @returns {Promise<boolean>} - A promise that resolves true if the user is properly updated, else false
     */
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

    /**
     * 
     * @param {string} username - The username of the user
     * @param {string} sessionId - The sessionId of the user
     * @returns {Promise<User>} - A promise that resolves the user that is found
     */
    findUser(username, sessionId){
        return new Promise((resolve, reject) => {
            let foundUser = UserMemoryDao.users.find(userObject => username === userObject.getUsername && sessionId === userObject.getSessionId)
            resolve(foundUser)
        })
    }

    /**
     * 
     * @returns {User[]} - Returns a copy of the user array. Created mostly for testing 
     */
    findAll(){
        let temp = []
        for(let user of UserMemoryDao.users){
            temp.push(user)
        }
        return temp
    }

    /**
     * 
     * @param {User} user - The user object that contains the cart that the learningItem is going to be added
     * @param {LearningItem} learningItem - The learningItem object that user added to his cart
     * @returns {Promise<number>} - A promise that resolves a number which indicates the status of the request
     */
    addToCart(user, learningItem){
        return user.addLearningItem(learningItem)
    }

    /**
     * 
     * @param {User} user - The user object that contains the cart that the learningItem is going to be removed from
     * @param {number} id - The id of the learningItem that is going to be removed
     * @returns {Promise<{ack: number, newTotalCost: number}>} - A promise that resolves the ack which indicates the status of the 
     * request and the newTotalCost that shows the new total cost of the cart
     */
    removeFromCart(user, id){
        return user.removeLearningItem(id)
    }
}

module.exports = UserMemoryDao;