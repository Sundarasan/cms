const express = require('express')
const router = express.Router()
const Page = require('../../../model/page')
const mongoose = require('mongoose')

router.get('/page', (req, res) => {
  Page.find({}).then(pageDocs => {
    res.json(pageDocs)
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fetch pages'
    })
  })
})

router.post('/page', (req, res) => {
  const page = req.body
  const pageDoc = new Page()
  pageDoc.set({
    label: page.label,
    content: page.content
  })
  pageDoc.save().then(pageDoc => {
    res.json(pageDoc)
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to create page'
    })
  })
})

router.put('/page/:_id', (req, res) => {
  const page = req.body
  const pageDoc = new Page()
  return Page.findById(req.params._id).then(pageDoc => {
    if (!pageDoc) {
      res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Page not found to update'
      })
    } else {
      pageDoc.set('label', page.label)
      pageDoc.set('content', page.content)
      return pageDoc.save().then(pageDoc => {
        res.json(pageDoc)
      }).catch(err => {
        res.status(500).json({
          type: 'UNKNOWN_ERROR',
          message: 'Failed to save page'
        })
      })
    }
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to find page'
    })
  })
})

router.delete('/page/:_id', (req, res) => {
  const page = req.body
  const pageDoc = new Page()
  Page.findOneAndRemove({
    _id: req.params._id
  }).then(result => {
    res.json({
      status: 'OK',
      message: 'Page deleted successfully'
    })
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to save page'
    })
  })
})

module.exports = router