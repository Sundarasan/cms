const express = require('express')
const router = express.Router()
const Website = require('../../model/website')
const Snippet = require('../../model/snippet')

router.get('/website/:subdomain/snippet', (req, res) => {
  const subdomain = req.params.subdomain
  Website.findOne({
    subdomain: subdomain
  }).then(websiteDoc => {
    if (!websiteDoc) {
      res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Website not found'
      })
    } else {
      res.render('snippet/create-snippet', {
        websiteDoc
      })
    }
  }).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fech website'
    })
  })
})

router.get('/website/:subdomain/snippet/:label', (req, res) => {
  const subdomain = req.params.subdomain
  const label = req.params.label
  Website.findOne({
    subdomain: subdomain
  }).then(websiteDoc => {
    if (!websiteDoc) {
      res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Website not found'
      })
    } else {
      Snippet.findOne({
        label: label,
        website: websiteDoc.get('id')
      }).then(snippetDoc => {
        if (!snippetDoc) {
          res.status(404).json({
            type: 'NOT_FOUND',
            message: 'Snippet not found'
          })
        } else {
          res.render('snippet/edit-snippet', {
            websiteDoc,
            snippetDoc
          })
        }
      }).catch(err => {
        console.error('[ERROR]: Failed to fetch snippet. Error:', err)
        res.status(500).json({
          type: 'UNKNOWN_ERROR',
          message: 'Failed to fech snippet'
        })    
      })
    }
  }).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fech website'
    })
  })
})

module.exports = router
