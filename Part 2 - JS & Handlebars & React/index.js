const uuid = require('uuid');
const express = require('express')
const app = express()
const MemoryInitializer = require('./models/memorydao/MemoryInitializer');
const Login = require('./public/js/Login');
const CartItemService = require('./public/js/CartItemService');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("No arguments were given. Using local memory DAO.")
} else if (args.length === 3) {
    console.log("Three arguments were given. Using mongoDB.")
    process.env.useMongoDb = true
    process.env.username = args[0]
    process.env.password = args[1]
    process.env.host = args[2]
} else {
    console.log("Run without args for default use or insert username,password and host for mongoDB version")
    process.exit();
}

let initializer = new MemoryInitializer()
initializer.prepareData()

console.log("The server is open..")

app.use('/public', 
    express.static(__dirname + '/public'))

app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

let server = app.listen(8080)

app.get('/', function (req, res) {

    var options = {
        root: path.join(__dirname, 'public')
    }

    res.sendFile('index.html', options, function (err) {
        console.log(err)
    })
})

app.post('/login', function (req, res) {

    const username = req.body.username
    const password = req.body.password
    const result = Login.checkUser(username, password)
    result
        .then(sessionId => {
            if (sessionId !== null) {
                res.status(200).send({ "sessionId": sessionId });
            }
            else {
                res.status(401).send();
            }
        })
        .catch(error => {
            res.status(error.getStatus).send(error);
        })
})

app.post('/cart', function (req, res) {

    const username = req.body.username
    const sessionId = req.body.sessionId
    const title = req.body.title
    const id = req.body.id
    const type = req.body.type
    const cost = req.body.cost
    const image = req.body.image

    const result = CartItemService.addToCart(username,sessionId,title,id,type,cost,image)
    result.then(ack => {
        res.status(ack).send()
    })
    .catch(err => {
        console.log(err)
    })
})

app.get('/cart', function (req, res) {

    const username = req.query.username
    const sessionId = req.query.sessionId

    const result = CartItemService.showCart(username,sessionId)

    result
    .then(result => {
        res.status(200).send(result);
    })
    .catch(error => {
        res.status(error.code).send(error.message);
    })
})

app.delete('/cart', function (req, res) {
    let username = req.body.username
    let sessionId = req.body.sessionId
    let id = req.body.id

    const result = CartItemService.removeFromCart(username,sessionId,id)
    result
        .then(({ack, newTotalCost}) => {
            res.status(ack).send({newTotalCost})
        })
        .catch(error => {
            res.status(error.code).send(error)
        })

})

