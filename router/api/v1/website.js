const express = require('express')
const _ = require('lodash')
const router = express.Router()
const Website = require('../../../model/website')
const Page = require('../../../model/page')
const mongoose = require('mongoose')

router.post('/website', (req, res) => {
  const website = req.body
  const websiteDoc = new Website()
  websiteDoc.set({
    subdomain: _.trim(website.subdomain)
  })
  websiteDoc.save().then(websiteDoc => {
    res.json(websiteDoc)
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to create website'
    })
  })
})

router.put('/website/:websiteId', (req, res) => {
  const website = req.body
  Website.findById(req.params.websiteId).then(websiteDoc => {
    if (!websiteDoc) {
      res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Website not found to update'
      })
    } else {
      websiteDoc.set('subdomain', _.trim(website.subdomain))
      websiteDoc.save().then(websiteDoc => {
        res.json(websiteDoc)
      }).catch(err => {
        res.status(500).json({
          type: 'UNKNOWN_ERROR',
          message: 'Failed to save website'
        })
      })
    }
  }).catch(err => {
    return res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to find website'
    })
  })
})

router.delete('/website/:websiteId', (req, res) => {
  const websiteId = req.params.websiteId
  Page.remove({
    website: websiteId
  }).then(result => {
    Website.findOneAndRemove({
      _id: websiteId
    }).then(result => {
      res.json({
        status: 'OK',
        message: 'Website deleted successfully'
      })
    }).catch(err => {
      res.status(500).json({
        type: 'UNKNOWN_ERROR',
        message: 'Failed to delete website'
      })
    })
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to delete pages under website'
    })
  })
})

module.exports = router