require('./helper/require-text')

const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const compression = require('compression')
const subdomain = require('subdomain')
const config = require('config')
const db = require('./helper/db')

const indexPageRouter = require('./router/page/index')
const websitePageRouter = require('./router/page/website')
const pagePageRouter = require('./router/page/page')
const servePageRouter = require('./router/page/serve')

const websiteRouterV1 = require('./router/api/v1/website')
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
app.use(subdomain({ base: config.get('host'), removeWWW: true }))

app.use('/', indexPageRouter)
app.use('/', websitePageRouter)
app.use('/', pagePageRouter)
app.use('/', servePageRouter)

app.use('/api/v1', websiteRouterV1)
app.use('/api/v1', pageRouterV1)

module.exports = app