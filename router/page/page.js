const express = require('express')
const router = express.Router()
const Website = require('../../model/website')
const Page = require('../../model/page')
const ejs = require('ejs')
const rword = require('rword')
const _ = require('lodash')
const defaultPageContent = require('../../view/page/static/default-page.html')
const defaultPageContentTemplate = ejs.compile(defaultPageContent)

router.get('/website/:subdomain/page', (req, res) => {
  Website.findOne({
    subdomain: req.params.subdomain
  }).then(websiteDoc => {
    const randomPageLabel = rword.generate(undefined, { length: '3-4' })
    res.render('page/create-page', {
      websiteDoc,
      randomPageLabel,
      defaultPageContent: defaultPageContentTemplate({
        pageLabel: randomPageLabel
      })
    })
  }).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fetch website'
    })
  })
})

router.get('/website/:subdomain/page/:pageLabel', (req, res) => {
  const subdomain = req.params.subdomain
  const pageLabel = req.params.pageLabel
  Website.findOne({
    subdomain: subdomain
  }).then(websiteDoc => {
    if (!websiteDoc) {
      res.status(404).json({
        type: 'NOT_FOUND',
        message: 'Website not found',
        subdomain: subdomain
      })
    } else {
      Page.findOne({
        website: websiteDoc.get('id'),
        label: pageLabel
      }).sort({
        createdAt: -1
      }).then(pageDoc => {
        if (!pageDoc) {
          res.status(404).json({
            type: 'NOT_FOUND',
            message: 'Page not found'
          })
        } else {
          res.render('page/edit-page', {
            websiteDoc,
            pageDoc
          })
        }
      })
    }
  }).catch(err => {
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to fetch website'
    })
  })
})

module.exports = router