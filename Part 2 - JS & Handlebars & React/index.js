const uuid = require('uuid');
const express = require('express')

const app = express()

app.use('/public', 
    express.static(__dirname + '/public'))


let server = app.listen(8080)