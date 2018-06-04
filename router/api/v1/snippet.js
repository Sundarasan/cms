
const express = require('express')
const router = express.Router()
const snippetService = require('../../../service/snippet')

router.post('/website/:websiteId/snippet', (req, res) => {
  const websiteId = req.params.websiteId
  const snippet = req.body
  snippetService.createSnippet(websiteId, snippet).then(snippetDoc => {
    res.json(snippetDoc)
  }).catch(httpErr => {
    res.status(httpErr.statusCode).json(httpErr)
  })
})

router.put('/website/:websiteId/snippet/:snippetId', (req, res) => {
  const websiteId = req.params.websiteId
  const snippetId = req.params.snippetId
  const snippet = req.body
  snippetService.updateSnippet(websiteId, snippetId, snippet).then(snippetDoc => {
    res.json(snippetDoc)
  }).catch(httpErr => {
    res.status(httpErr.statusCode).json(httpErr)
  })
})

router.delete('/website/:websiteId/snippet/:snippetId', (req, res) => {
  const websiteId = req.params.websiteId
  const snippetId = req.params.snippetId
  snippetService.deleteSnippet(websiteId, snippetId).then(() => {
    res.json({
      status: 'OK',
      message: 'Snippet deleted successfully'
    })
  }).catch(httpErr => {
    res.status(httpErr.statusCode).json(httpErr)
  })
})

module.exports = router