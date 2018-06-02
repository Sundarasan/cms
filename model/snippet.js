const mongoose = require('mongoose')
const Schema = mongoose.Schema

var SnippetSchema = new Schema({
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

SnippetSchema.index({
  website: 1,
  label: 1
}, {
  unique: 'Page already exists'
})

const SnippetModel = mongoose.model('Snippet', SnippetSchema)

module.exports = SnippetModel