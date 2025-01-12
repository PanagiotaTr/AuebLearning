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
                    const learningItems = foundUser.getSize;
                    console.log(learningItems)
                    console.log("-------------------------------------------")
                    if (learningItems.length === 0) {
                        throw new Error("Το καλάθι αγορών είναι άδειο!");
                    }
                
                    const cartItems = learningItems.map(item => ({
                        id: item.id,
                        type: item.type,
                        title: item.title,
                        cost: item.cost
                    }));

                    const totalCost = cartItems.reduce((sum, item) => sum + Number(item.cost), 0);
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
                    throw new Error("Ο χρήστης δεν βρέθηκε.");
                }
            })
            .catch(error => {
                throw error;
            });
    }

}

module.exports = CartItemService