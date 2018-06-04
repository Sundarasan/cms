const Promise = require('bluebird')
const express = require('express')
const router = express.Router()
const Website = require('../../model/website')
const Page = require('../../model/page')
const Snippet = require('../../model/snippet')
const _ = require('lodash')
const rword = require('rword')

router.get('/websites', (req, res) => {
  Website.find({}).sort({
    createdAt: -1
  }).then(websiteDocs => {
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
      const promiseArray = []
      promiseArray.push(Page.find({
        website: websiteDoc.get('id')
      }).sort({
        createdAt: -1
      }))
      promiseArray.push(Snippet.find({
        website: websiteDoc.get('id')
      }).sort({
        createdAt: -1
      }))
      Promise.all(promiseArray).then(results => {
        const pageDocs = results[0]
        const snippetDocs = results[1]
        res.render('website/edit-website', {
          websiteDoc,
          pageDocs,
          snippetDocs
        })
      }).catch(err => {
        console.error('[ERROR]: Failed to fetch details. Error:', err)
        res.status(500).json({
          type: 'UNKNOWN_ERROR',
          message: 'Failed to fech details'
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
