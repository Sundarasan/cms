
const express = require('express')
const router = express.Router()
const pageService = require('../../../service/page')

router.post('/website/:websiteId/page', (req, res) => {
  const websiteId = req.params.websiteId
  const page = req.body
  pageService.createPage(websiteId, page).then(pageDoc => {
    res.json(pageDoc)
  }).catch(httpErr => {
    res.status(httpErr.statusCode).json(httpErr)
  })
})

router.put('/website/:websiteId/page/:pageId', (req, res) => {
  const websiteId = req.params.websiteId
  const pageId = req.params.pageId
  const page = req.body
  pageService.updatePage(websiteId, pageId, page).then(pageDoc => {
    res.json(pageDoc)
  }).catch(httpErr => {
    res.status(httpErr.statusCode).json(httpErr)
  })
})

router.delete('/website/:websiteId/page/:pageId', (req, res) => {
  const websiteId = req.params.websiteId
  const pageId = req.params.pageId
  pageService.deletePage(websiteId, pageId).then(() => {
    res.json({
      status: 'OK',
      message: 'Page deleted successfully'
    })
  }).catch(httpErr => {
    res.status(httpErr.statusCode).json(httpErr)
  })
})

module.exports = router