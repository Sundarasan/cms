const mongoose = require('mongoose')
const Schema = mongoose.Schema


var CompiledPageSchema = new Schema({
  website: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
    required: true,
    index: true
  },
  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true,
    index: true
  },
  content: {
    type: String,
    trim: true,
    required: true
  },
  isCompilationSuccess: {
    type: Boolean,
    default: true
  },
  compilationError: {
    type: String
  }
}, {
  timestamps: true
})

CompiledPageSchema.index({
  website: 1,
  page: 1
}, {
  unique: 'Compiled page already exists'
})

const CompiledPageModel = mongoose.model('CompiledPage', CompiledPageSchema)

module.exports = CompiledPageModel