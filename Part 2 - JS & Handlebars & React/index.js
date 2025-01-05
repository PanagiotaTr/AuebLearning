const uuid = require('uuid');
const express = require('express')
const app = express()
const MemoryInitializer = require('./models/memorydao/MemoryInitializer');
const Login = require('./public/js/Login')


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

    const { username, password } = req.body;
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