const express = require('express')
const _ = require('lodash')
const router = express.Router()
const Website = require('../../../model/website')
const Snippet = require('../../../model/snippet')
const mongoose = require('mongoose')

router.post('/website/:websiteId/snippet', (req, res) => {
  const websiteId = req.params.websiteId
  const snippet = req.body
  Website.findById(websiteId).then(websiteDoc => {
    if (!websiteDoc) {
      res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Website not found'
      })
    } else {
      const snippetDoc = new Snippet()
      snippetDoc.set({
        website: websiteDoc.get('id'),
        label: _.trim(snippet.label),
        content: _.trim(snippet.content)
      })
      snippetDoc.save().then(snippetDoc => {
        res.json(snippetDoc)
      }).catch(err => {
        console.error('[ERROR]: Failed to create snippet. Error:', err)
        res.status(500).json({
          type: 'UNKNOWN_ERROR',
          message: 'Failed to create snippet'
        })
      })
    }
  }).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fetch website'
    })
  })
})

router.put('/website/:websiteId/snippet/:snippetId', (req, res) => {
  const snippet = req.body
  const websiteId = req.params.websiteId
  const snippetId = req.params.snippetId
  Snippet.findById(snippetId).then(snippetDoc => {
    if (!snippetDoc) {
      res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Snippet not found'
      })
    } else {
      snippetDoc.set('label', _.trim(snippet.label))
      snippetDoc.set('content', _.trim(snippet.content))
      snippetDoc.save().then(snippetDoc => {
        res.json(snippetDoc)
      }).catch(err => {
        console.error('[ERROR]: Failed to save snippet. Error:', err)
        res.status(500).json({
          type: 'UNKNOWN_ERROR',
          message: 'Failed to save snippet'
        })
      })
    }
  }).catch(err => {
    console.error('[ERROR]: Failed to update snippet. Error:', err)
    return res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fetch snippet'
    })
  })
})

router.delete('/website/:websiteId/snippet/:snippetId', (req, res) => {
  const websiteId = req.params.websiteId
  const snippetId = req.params.snippetId
  Snippet.findOneAndRemove({
    _id: snippetId,
    website: websiteId
  }).then(result => {
    res.json({
      status: 'OK',
      message: 'Snippet deleted successfully'
    })
  }).catch(err => {
    console.error('[ERROR]: Failed to delete snippet. Error:', err)
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to delete snippet'
    })
  })
})

module.exports = router