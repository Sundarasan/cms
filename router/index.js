const express = require('express')
const router = express.Router()
const Page = require('../model/page')
const mongoose = require('mongoose')
const ejs = require('ejs')
const defaultPageContent = require('../view/static/default-page.html')
const _ = require('lodash')
const defaultPageContentTemplate = ejs.compile(defaultPageContent)

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
  const randomNumber = _.random(0, 9999)
  res.render('create-page', {
    randomNumber,
    defaultPageContent: defaultPageContentTemplate({
      randomNumber
    })
  })
})

router.get('/page/:label', (req, res) => {
  Page.findOne({
    label: req.params.label
  }).then(pageDoc => {
    if (!pageDoc) {
      res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Page not found'
      })
    } else {
      res.render('edit-page', {
        pageDoc
      })
    }
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Unknown error'
    })
  })
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