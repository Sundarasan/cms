
const express = require('express')
const router = express.Router()
const websiteService = require('../../../service/website')

router.post('/website', (req, res) => {
  const website = req.body
  websiteService.createWebsite(website).then(websiteDoc => {
    res.json(websiteDoc)
  }).catch(httpErr => {
    console.error('[ERROR]: Failed to create website. Error:', httpErr)
    res.status(httpErr.statusCode || 500).json(httpErr)
  })
})

router.put('/website/:websiteId', (req, res) => {
  const websiteId = req.params.websiteId
  const website = req.body
  websiteService.updateWebsite(websiteId, website).then(websiteDoc => {
    res.json(websiteDoc)
  }).catch(httpErr => {
    res.status(httpErr.statusCode || 500).json(httpErr)
  })
})

router.delete('/website/:websiteId', (req, res) => {
  const websiteId = req.params.websiteId
  websiteService.deleteWebsite(websiteId).then(() => {
    res.json({
      status: 'OK',
      message: 'Website deleted successfully'
    })
  }).catch(httpErr => {
    res.status(httpErr.statusCode || 500).json(httpErr)
  })
})

module.exports = router