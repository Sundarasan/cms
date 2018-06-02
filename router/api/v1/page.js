const express = require('express')
const router = express.Router()
const Website = require('../../../model/website')
const Page = require('../../../model/page')
const compilePageHelper = require('../../../helper/compile-page')

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
  Website.findById(websiteId).then(websiteDoc => {
    if (!websiteDoc) {
      res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Website not found'
      })
    } else {
      Page.findOne({
        _id: pageId,
        website: websiteDoc.get('id')
      }).then(pageDoc => {
        if (!pageDoc) {
          res.status(404).json({
            type: 'NOT_FOUND',
            message: 'Page not found'
          })
        } else {
          pageDoc.set('label', page.label)
          pageDoc.set('content', page.content)
          pageDoc.save().then(pageDoc => {
            // Defers compile page task
            compilePageHelper.compilePage(websiteDoc, pageDoc).then(() => {
              console.log(`Compiled page and stored successfully. Subdomain: ${websiteDoc.get('subdomain')} | Page: ${pageDoc.get('label')}`)
            }).catch(err => {
              console.error('[ERROR]: Failed to compile given content. Error:', err)
            })
            res.json(pageDoc)
          }).catch(err => {
            console.error('[ERROR]: Failed to update page. Error:', err)
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
    }
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fetch website'
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