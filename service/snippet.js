
const _ = require('lodash')
const HttpError = require('../helper/http-error')
const Website = require('../model/website')
const Snippet = require('../model/snippet')

const createSnippet = (websiteId, snippet) => {
  return Website.findById(websiteId).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to fetch website'
    ))
  }).then(websiteDoc => {
    if (!websiteDoc) {
      return Promise.reject(new HttpError(
        404,
        'WEBSITE_NOT_FOUND',
        'Website not found'
      ))
    } else {
      const snippetDoc = new Snippet()
      snippetDoc.set({
        website: websiteDoc.get('id'),
        label: _.trim(snippet.label),
        content: _.trim(snippet.content)
      })
      return snippetDoc.save().catch(err => {
        console.error('[ERROR]: Failed to create snippet. Error:', err)
        return Promise.reject(new HttpError(
          500,
          'UNKNOWN_ERROR',
          'Failed to create snippet'
        ))
      })
    }
  })
}

const updateSnippet = (websiteId, snippetId, snippet) => {
  return Snippet.findOne({
    _id: snippetId,
    website: websiteId,
  }).catch(err => {
    console.error('[ERROR]: Failed to update snippet. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to fetch snippet'
    ))
  }).then(snippetDoc => {
    if (!snippetDoc) {
      return Promise.reject(new HttpError(
        404,
        'SNIPPET_NOT_FOUND',
        'Snippet not found'
      ))
    } else {
      snippetDoc.set('label', _.trim(snippet.label))
      snippetDoc.set('content', _.trim(snippet.content))
      return snippetDoc.save().catch(err => {
        console.error('[ERROR]: Failed to save snippet. Error:', err)
        return Promise.reject(new HttpError(
          500,
          'UNKNOWN_ERROR',
          'Failed to save snippet'
        ))
      })
    }
  })
}

const deleteSnippet = (websiteId, snippetId) => {
  return Snippet.findOneAndRemove({
    _id: snippetId,
    website: websiteId
  }).catch(err => {
    console.error('[ERROR]: Failed to delete snippet. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to delete snippet'
    ))
  })
}

module.exports = {
  createSnippet,
  updateSnippet,
  deleteSnippet
}
