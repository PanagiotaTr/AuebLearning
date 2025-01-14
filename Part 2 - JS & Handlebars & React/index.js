const uuid = require('uuid');
const express = require('express')
const app = express()
const MemoryInitializer = require('./models/memorydao/MemoryInitializer');
const Login = require('./public/js/Login');
const CartItemService = require('./public/js/CartItemService');


let initializer = new MemoryInitializer()
initializer.prepareData()
// console.log(initializer.getUserDao().findAll())
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
            res.status(error.getStatus).send(error.message);
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
        // console.log("EPESTREPSE STO INDEX")
        // console.log(ack)
        res.status(ack).send()
    })
    .catch(err => {
        console.log(err)
    })
})

app.get('/cart', function (req, res) {

    console.log("Pass")

    const username = req.query.username
    const sessionId = req.query.sessionId

    console.log(username)

    const result = CartItemService.showCart(username,sessionId)

    result
    .then(result => {
        res.status(200).send(result);
        console.log(result)
        console.log("PASS")
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
            res.status(error.code).send(error.message)
        })

})

