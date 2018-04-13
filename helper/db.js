
const Promise = require('bluebird')
const config = require('config')
const mongoose = require('mongoose')
const mongodbURL = config.get('db')

/**
 * Configuring mongoose Promise with Bluebird Promises
 * Referrence: http://mongoosejs.com/docs/promises.html
 */
mongoose.Promise = Promise;

let connection

const connect = () => {
  if (!connection) {
    connection = mongoose.connect(mongodbURL)
    connection.then(() => {
      console.log('Connected to MongoDB. MongoDB URL: "' + mongodbURL + '"');
    }).catch(err => {
      console.error('Failed to connect to MongoDB. Error:', err);
    })
  }
  return connection
}

const getConnection = () => connection

module.exports = {
  connect,
  getConnection
}
