const express = require('express')
const router = express.Router()
const Website = require('../../../model/website')
const mongoose = require('mongoose')

router.post('/website', (req, res) => {
  const website = req.body
  const websiteDoc = new Website()
  websiteDoc.set({
    subdomain: website.subdomain
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

router.put('/website/:_id', (req, res) => {
  const website = req.body
  const websiteDoc = new Website()
  return Website.findById(req.params._id).then(websiteDoc => {
    if (!websiteDoc) {
      res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Website not found to update'
      })
    } else {
      websiteDoc.set('subdomain', website.subdomain)
      return websiteDoc.save().then(websiteDoc => {
        res.json(websiteDoc)
      }).catch(err => {
        res.status(500).json({
          type: 'UNKNOWN_ERROR',
          message: 'Failed to save website'
        })
      })
    }
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to find website'
    })
  })
})

router.delete('/website/:_id', (req, res) => {
  Website.findOneAndRemove({
    _id: req.params._id
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
})

module.exports = router