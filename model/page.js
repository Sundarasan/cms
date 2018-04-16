const mongoose = require('mongoose')
const Schema = mongoose.Schema

var PageSchema = new Schema({
  label: {
    type: String,
    maxlength: 100,
    trim: true,
    unique: true,
    required: true
  },
  content: {
    type: String,
    trim: true,
    required: true
  }
}, {
  timestamps: true
})

const PageModel = mongoose.model('Page', PageSchema)

module.exports = PageModel