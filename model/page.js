const mongoose = require('mongoose')
const Schema = mongoose.Schema


var PageSchema = new Schema({
  website: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
    required: true,
    index: true
  },
  label: {
    type: String,
    maxlength: 100,
    trim: true,
    unique: true,
    required: true,
    index: true
  },
  content: {
    type: String,
    trim: true,
    required: true
  }
}, {
  timestamps: true
})

PageSchema.index({
  website: 1,
  label: 1
}, {
  unique: true
})

const PageModel = mongoose.model('Page', PageSchema)

module.exports = PageModel