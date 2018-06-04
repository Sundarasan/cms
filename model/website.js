const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SUBDOMAIN_REGEXP = /[^a-zA-Z0-9\-]/

const validateSubdomain = (value) => {
  return !/[^a-zA-Z0-9\-]/.test(value)
}

var WebsiteSchema = new Schema({
  subdomain: {
    type: String,
    validate: [validateSubdomain, 'Invalid subdomain'],
    required: true,
    trim: true,
    unique: true,
    index: true,
    lowercase: true
  }
}, {
  timestamps: true
})

const WebsiteModel = mongoose.model('Website', WebsiteSchema)

module.exports = WebsiteModel