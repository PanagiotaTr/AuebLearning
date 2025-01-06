class User {

    constructor(username, password) {
        this.username = username
        this.password = password
        this.sessionId = undefined
        this.learningItems = []
    }

    get getUsername() { return this.username; }

    set setUsername(name) { this.username = name; }

    get getPassword() { return this.password; }

    set setPassword(password) { this.password = password; }

    get getSessionId() { return this.sessionId; }

    set setSessionId(sessionId) { this.sessionId = sessionId; }

    get getSize() { return this.learningItems }

    equals(other) {
        if (other == null) {
            return false;
        }

        if (!(other instanceof User)) {
            return false;
        }

        return this.username === other.username && this.password === other.password;
    }

    update(user) {
        this.username = user.username;
        this.password = user.password;
        this.sessionId = user.sessionId;
    }

    addLearningItem(learningItem) {
        return new Promise((resolve, reject) => {
            let itemFound = this.learningItems.find(item => item.equals(learningItem))
            let ack = 0
            if (itemFound == undefined) {
                this.learningItems.push(learningItem)
                ack = 200
            } else {
                ack = 409
            }
            resolve(ack)
        })
    }

}

module.exports = User