const _ = require('lodash')

const config = {
  development: {
    db: 'mongodb://localhost/ec2-sample-express'
  },
  staging: {
    db: 'mongodb://localhost/ec2-sample-express'
  },
  production: {
    db: 'mongodb://localhost/ec2-sample-express'
  }
}

module.exports = (key) => {
  return _.get(key, config)
}