const UserDao = require("../dao/UserDao");
const User = require("../domain/User");
const MongoConnector = require("../mongodao/MongoConnector")
const LearningItem = require("../domain/LearningItem")

class UserMongoDao extends UserDao {

    /**
     * 
     * @param {User} user - The user object to be saved in the table users
     * @returns {Promise<boolean>} - A promise that resolves true if the user is properly saved, else false
     */
    save(user) {
        let client = MongoConnector.getClient()
        let db = client.db('AuebLearning')
        let collection = db.collection('Users')
        let saved = false
        return client.connect()
            .then(() => {
                return collection.insertOne(user)
            })
            .then(res => {
                if (res.acknowledged) {
                    let documentId = res.insertedId
                    console.log(`Created document ${documentId}`)
                    saved = true
                    return resolve(saved)
                }
            })
            .catch(err => console.log(err))
            .finally(() => client.close())
    }

    /**
     * 
     * @param {User} user - The user object to be updated (sessionId)
     * @returns {Promise<boolean>} - A promise that resolves true if the user is properly updated, else false
     */
    update(user) {
        let client = MongoConnector.getClient()
        let db = client.db('AuebLearning')
        let collection = db.collection('Users')
        return client.connect()
            .then(() => {
                let filter = {
                    username: user.getUsername,
                    password: user.getPassword
                }
                let update = {
                    $set: {
                        sessionId: user.getSessionId
                    }
                }

                return collection.updateOne(filter, update)
            })
            .then(res => {
                if (res.acknowledged) {
                    console.log(`Updated ${res.matchedCount} documents`)
                }
                return res.matchedCount > 0
            })
    }

    /**
     * 
     * @param {string} username - The username of the user
     * @param {string} sessionId - The sessionId of the user
     * @returns {Promise<User>} - A promise that resolves the user that is found
     */
    findUser(username, sessionId) {

        let client = MongoConnector.getClient()
        let db = client.db('AuebLearning')
        let collection = db.collection('Users')
        return client.connect()
            .then(() => {
                let query = {
                    username: username,
                    sessionId: sessionId
                }
                let options = {
                    projection: {
                        _id: 0,
                        username: 1,
                        password: 1,
                        sessionId: 1,
                        learningItems: 1
                    }
                }
                return collection.findOne(query, options)
            })
            .then(foundUser => {
                if (foundUser) {
                    let user = new User(foundUser.username, foundUser.password)
                    user.setSessionId = foundUser.sessionId
                    let learningItems = foundUser.learningItems.map(item => new LearningItem(item.title, item.id, item.type, item.cost, item.image))
                    user.setCart = learningItems
                    return user
                } else {
                    return foundUser
                }
            })
            .catch(err => console.log(err))

    }

    /**
     * 
     * @param {User} user - The user object that contains the cart that the learningItem is going to be added
     * @param {LearningItem} learningItem - The learningItem object that user added to his cart
     * @returns {Promise<number>} - A promise that resolves a number which indicates the status of the request
     */
    addToCart(user, learningItem) {
        return new Promise((resolve, reject) => {
            let client = MongoConnector.getClient()
            let db = client.db('AuebLearning')
            let collection = db.collection('Users')
            client.connect()
                .then(() => {
                    let userCart = user.getCart
                    let itemFound = userCart.find(item => item.equals(learningItem))
                    if (itemFound) {
                        throw new Error('Item already in cart')
                    }
                    else {
                        let filter = {
                            username: user.getUsername,
                            sessionId: user.getSessionId
                        }
                        let update = {
                            $push: {
                                learningItems: learningItem
                            }
                        }
                        return collection.updateOne(filter, update)
                    }
                })
                .then(res => {
                    if (res.acknowledged) {
                        console.log(`Updated ${res.matchedCount} documents`)
                        return resolve(200)
                    }
                })
                .catch(() => { resolve(409) })
                .finally(() => client.close())
        })
    }

    /**
     * 
     * @param {User} user - The user object that contains the cart that the learningItem is going to be removed from
     * @param {number} id - The id of the learningItem that is going to be removed
     * @returns {Promise<{ack: number, newTotalCost: number}>} - A promise that resolves the ack which indicates the status of the 
     * request and the newTotalCost that shows the new total cost of the cart
     */
    removeFromCart(user, id) {
        return new Promise((resolve, reject) => {


            let client = MongoConnector.getClient()
            let db = client.db('AuebLearning')
            let collection = db.collection('Users')
            let ack = 0
            let newTotalCost = 0
            client.connect()
                .then(() => {
                    const filter = {
                        username: user.getUsername,
                        sessionId: user.getSessionId
                    }
                    const update = {
                        $pull: {
                            learningItems: { 'id': id }
                        }
                    }
                    return collection.updateOne(filter, update)
                })
                .then(result => {
                    if (result.modifiedCount > 0) {
                        const filter = {
                            username: user.getUsername,
                            sessionId: user.getSessionId
                        }
                        const projection = {
                            cart: 1
                        }
                        return collection.findOne(filter, projection)
                    } else {
                        ack = 404
                        resolve({ ack, newTotalCost })
                        throw new Error('Item could not be removed')
                    }
                })
                .then(updatedUser => {
                    newTotalCost = updatedUser.learningItems.reduce((sum, item) => sum + Number(item.cost), 0)
                    ack = 200
                    resolve({ ack, newTotalCost })
                })
                .catch(err => console.log(err))
                .finally(() => client.close())
        })
    }
}


module.exports = UserMongoDao;