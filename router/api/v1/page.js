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

module.exports = router