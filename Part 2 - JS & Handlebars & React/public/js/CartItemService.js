const LearningItem = require("../../models/domain/LearningItem");
const User = require("../../models/domain/User");
const MemoryInitializer = require("../../models/memorydao/MemoryInitializer");

const initializer = new MemoryInitializer()

class CartItemService{

    static addToCart(username,sessionId,title,id,type,cost,image){
        const user = initializer.getUserDao().findUser(username,sessionId)
        return user.then(foundUser => {
            if(foundUser!=undefined){
                console.log(foundUser.getSize)
                let learningItem = new LearningItem(title,id,type,cost,image)
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


}

module.exports = CartItemService