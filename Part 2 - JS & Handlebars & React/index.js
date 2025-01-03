const uuid = require('uuid');
const express = require('express')
const app = express()
const MemoryInitializer = require('./models/memorydao/MemoryInitializer');


let initializer = new MemoryInitializer()
initializer.prepareData()
console.log(initializer.getUserDao().findAll())

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