const express = require('express')
const router = express.Router()
const Website = require('../../model/website')
const Page = require('../../model/page')
const _ = require('lodash')
const rword = require('rword')

router.get('/websites', (req, res) => {
  Website.find({}).then(websiteDocs => {
    res.render('website/websites', {
      websiteDocs
    })
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fetch websites'
    })
  })
})

router.get('/website', (req, res) => {
  const randomSubdomain = rword.generate(undefined, { length: '3-4' })
  res.render('website/create-website', {
    randomSubdomain
  })
})

router.get('/website/:subdomain', (req, res) => {
  Website.findOne({
    subdomain: req.params.subdomain
  }).then(websiteDoc => {
    if (!websiteDoc) {
      res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Website not found'
      })
    } else {
      Page.find({
        website: websiteDoc.get('id')
      }).then(pageDocs => {
        res.render('website/edit-website', {
          websiteDoc,
          pageDocs
        })
      }).catch(err => {
        res.status(500).json({
          type: 'UNKNOWN_ERROR',
          message: 'Failed to fech pages'
        })    
      })
    }
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fech website'
    })
  })
})

module.exports = router
