
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const compression = require('compression')
const db = require('./helper/db')

const indexRouter = require('./router/index')

const pageRouterV1 = require('./router/api/v1/page')

db.connect()

let app = express();
app.set('views', path.join(__dirname, '/view'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(compression())

app.use('/', indexRouter)

app.use('/api/v1', pageRouterV1)

module.exports = app