const LearningItem = require("../../models/domain/LearningItem");
const User = require("../../models/domain/User");
const MemoryInitializer = require("../../models/memorydao/MemoryInitializer");

const initializer = new MemoryInitializer()

class CartItemService{

    static addToCart(username,sessionId,title,id,type,cost,image){
        const user = initializer.getUserDao().findUser(username,sessionId)
        return user.then(foundUser => {
            if(foundUser!=undefined){
                let learningItem = new LearningItem(title,id,type,cost,image)
                // console.log(foundUser.getSize)
                return foundUser.addLearningItem(learningItem)
            }
        })
        .then(ack => {
            if(ack){
                return ack
            }else{
                throw new Error("Unexpected error while updating the cart")
            }
        })
        .catch(err =>{
            console.log(err)
        })
    }

    static showCart(username,sessionId,title,id,type,cost,image){
        const user = initializer.getUserDao().findUser(username,sessionId)
        return user
            .then(foundUser => {
                if(foundUser!=undefined){
                    const learningItems = foundUser.getCart;
                    console.log(learningItems)
                    console.log("-------------------------------------------")
                    
                    const cartItems = learningItems.map(item => ({
                        id: item.id,
                        type: item.type,
                        title: item.title,
                        cost: item.cost
                    }));

                    const totalCost = cartItems.length !== 0? cartItems.reduce((sum, item) => sum + Number(item.cost), 0) : 0;
                    // console.log(cartItems)
                    // console.log(totalCost)

                    console.log(JSON.stringify({
                        cartItems: cartItems,
                        totalCost: totalCost
                    }))                    

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

    static removeFromCart(username,sessionId,id){
        const user = initializer.getUserDao().findUser(username,sessionId)
        return user
            .then(foundUser => {
                if (foundUser !== undefined){
                    return foundUser.removeLearningItem(id)
                }else{
                    let error = new Error("Ο χρήστης δεν βρέθηκε")
                    error.code = 401
                    throw err
                }
            })
            .then(({ack, newTotalCost}) => {
                if(ack){
                    return {ack, newTotalCost}
                }else{
                    let error = new Error("Μη αναμενόμενο σφάλμα κατά την ενημέρωση του καλαθιού")
                    error.code = 500
                    throw error
                }
            })
            .catch(error => {throw error})
    }
}

module.exports = CartItemService