const express = require('express')
const router = express.Router()
const Page = require('../../../model/page')

router.post('/website/:websiteId/page', (req, res) => {
  const websiteId = req.params.websiteId
  const page = req.body
  const pageDoc = new Page()
  pageDoc.set({
    website: websiteId,
    label: page.label,
    content: page.content
  })
  pageDoc.save().then(pageDoc => {
    res.json(pageDoc)
  }).catch(err => {
    console.error('[ERROR]: Failed to create page. Error:', err)
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to create page'
    })
  })
})

router.put('/website/:websiteId/page/:pageId', (req, res) => {
  const websiteId = req.params.websiteId
  const pageId = req.params.pageId
  const page = req.body
  const pageDoc = new Page()
  return Page.findOne({
    _id: pageId,
    website: websiteId
  }).then(pageDoc => {
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

router.delete('/website/:websiteId/page/:pageId', (req, res) => {
  const websiteId = req.params.websiteId
  const pageId = req.params.pageId
  Page.findOneAndRemove({
    _id: pageId,
    website: websiteId
  }).then(result => {
    res.json({
      status: 'OK',
      message: 'Page deleted successfully'
    })
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to delete page'
    })
  })
})

module.exports = router