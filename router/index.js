const express = require('express')
const router = express.Router()
const Page = require('../model/page')
const mongoose = require('mongoose')

router.get('/', (req, res) => {
  res.redirect('/pages')
})

router.get('/pages', (req, res) => {
  Page.find({}).then(pageDocs => {
    res.render('pages', {
      pageDocs
    })
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fetch pages'
    })
  })
})

router.get('/page', (req, res) => {
  res.render('create-page')
})

router.get('/p/:label', (req, res) => {
  Page.findOne({
    label: req.params.label
  }).then(pageDoc => {
    res.render('serve-page', {
      pageDoc
    })
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fetch pages'
    })
  })
})

module.exports = router