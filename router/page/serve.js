
const express = require('express')
const router = express.Router()
const Website = require('../../model/website')
const Page = require('../../model/page')
const CompiledPage = require('../../model/compiled-page')

router.get('/subdomain/:subdomain/*', (req, res) => {
  const subdomain = req.params.subdomain
  let path = req.originalUrl || ''
  path = decodeURI(path)
  if (path[0] === '/') {
    path = path.substring(1)
  }
  /**
   * Feching website
   */
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
      /**
       * Fetching page
       */
      Page.findOne({
        website: websiteDoc.get('id'),
        label: path || 'home'
      }).then(pageDoc => {
        if (!pageDoc) {
          res.status(404).json({
            type: 'NOT_FOUND',
            message: 'Page not found',
            website: subdomain,
            path: path
          })
        } else {
          /**
           * Fetching compiled page
           */
          CompiledPage.findOne({
            website: websiteDoc.get('id'),
            page: pageDoc.get('id')
          }).then(compiledPageDoc => {
            if (!compiledPageDoc) {
              res.status(404).json({
                type: 'NOT_FOUND',
                message: 'Compiled page not found',
                website: subdomain,
                path: path
              })
            } else {
              res.render('page/serve-page', {
                compiledPageDoc
              })
            }
          }).catch(err => {
            console.error('[ERROR]: Failed to fetch compiled page. Error:', err)
            res.status(500).json({
              type: 'UNKNOWN_ERROR',
              message: 'Failed to fetch compiled page'
            })
          })
        }
      }).catch(err => {
        console.error('[ERROR]: Failed to fetch page. Error:', err)
        res.status(500).json({
          type: 'UNKNOWN_ERROR',
          message: 'Failed to fetch page'
        })
      })
    }
  }).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    res.status(500).json({
      type: 'UNKNOWN_ERROR',
      message: 'Failed to find website'
    })
  })
})

module.exports = router
