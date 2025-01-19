const LearningItem = require("../../models/domain/LearningItem");
const User = require("../../models/domain/User");
const MemoryInitializer = require("../../models/memorydao/MemoryInitializer");
const initializer = new MemoryInitializer()
class CartItemService {

    /**
     * Adds an item to the users cart
     * 
     * This function retrieves a user by the username and the sessionId, creates the LearningItem that is going
     * to be added to the users cart. If successful, it returns an acknowledgement.
     * 
     * @param {string} username - The username of the user
     * @param {string} sessionId - The sessionId of the user
     * @param {string} title - The title of the learningItem
     * @param {number} id -  The id of the learningItem
     * @param {string} type - The type of the learningItem
     * @param {number} cost - The cost of the learningItem
     * @param {string} image - The image of the learningItem
     * @returns {Promise<number>} - A promise that resolves the status of the request
     */
    static addToCart(username, sessionId, title, id, type, cost, image) {
        const user = initializer.getUserDao().findUser(username, sessionId)
        return user
            .then(foundUser => {
                if (foundUser != undefined) {
                    let learningItem = new LearningItem(title, id, type, cost, image)
                    return initializer.getUserDao().addToCart(foundUser, learningItem)
                }
            })
            .then(ack => {
                if (ack) {
                    return ack
                } else {
                    throw new Error("Unexpected error while updating the cart")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    /**
     * Retrieves and displays the user's cart items, including their details and total cost.
     * 
     * This function retrieves a user by the username and the sessionId. It maps the LearningItems to JSON that contains the
     * info needed and also computes the total cost of the cart
     * 
     * @param {string} username - The username of the user
     * @param {string} sessionId - The sessionId of the user
     * @returns {Promise<string>} - A promise that resolves to a JSON string containing the cart items and total cost.
     */
    static showCart(username, sessionId) {
        const user = initializer.getUserDao().findUser(username, sessionId)
        return user
            .then(foundUser => {
                if (foundUser != undefined) {
                    const learningItems = foundUser.getCart;

                    const cartItems = learningItems.map(item => ({
                        id: item.id,
                        type: item.type,
                        title: item.title,
                        cost: item.cost
                    }));

                    const totalCost = cartItems.length !== 0 ? cartItems.reduce((sum, item) => sum + Number(item.cost), 0) : 0;

                    return JSON.stringify({
                        cartItems: cartItems,
                        totalCost: totalCost
                    });
                } else {
                    let err = new Error("Ο χρήστης δεν βρέθηκε.")
                    err.code = 401
                    throw err
                }
            })
            .catch(error => {
                throw error;
            });
    }


    /**
     * Removes a LearningItem from the users cart and computes the new cost of the cart
     * 
     * This function retrieves the user based on `username` and `sessionId`, and if the user is found, it removes 
     * the specified item (using the id) from the users cart. If successful, it returns the acknowledgement and the
     * new cost of cart
     * 
     * @param {string} username - The username of the user
     * @param {string} sessionId - The sessionId of the user
     * @param {number} id - The id of the LearningItem
     * @returns {Promise<{ack: number, newTotalCost: number}>}
     */
    static removeFromCart(username, sessionId, id) {
        const user = initializer.getUserDao().findUser(username, sessionId)
        return user
            .then(foundUser => {
                if (foundUser !== undefined) {
                    return initializer.getUserDao().removeFromCart(foundUser,id)
                } else {
                    let error = new Error("Ο χρήστης δεν βρέθηκε")
                    error.code = 401
                    throw error
                }
            })
            .then(({ ack, newTotalCost }) => {
                if (ack) {
                    return { ack, newTotalCost }
                } else {
                    let error = new Error("Μη αναμενόμενο σφάλμα κατά την ενημέρωση του καλαθιού")
                    error.code = 500
                    throw error
                }
            })
            .catch(error => { throw error })
    }
}

module.exports = CartItemService