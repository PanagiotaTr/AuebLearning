class LearningItem{

    constructor(title, id, type, cost, image) {
        this.title = title
        this.id = id
        this.type = type
        this.cost = cost
        this.image = image
    }

    get getTitle() {return this.title;}

    set setTitle(title) {this.title = title;}

    get getId() {return this.id;}

    set setId(id) {this.id = id;}

    get getType() {return this.type;}

    set setType(type) {this.type = type;}

    get getCost() {return this.cost;}

    set setCost(cost) {this.cost = cost;}

    get getImage() {return this.image;}

    set setImage(image) {this.image = image;}


    equals(other){
        if (other == null) {
            return false;
        }

        if (!(other instanceof LearningItem)) {
            return false;
        }

        return this.title === other.title && this.id === other.id;
    }
}

module.exports = LearningItem