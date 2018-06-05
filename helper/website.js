
const Promise = require('bluebird')
const pageService = require('../service/page')
const snippetService = require('../service/snippet')
const compilePageHelper = require('../helper/compile-page')

const createDefaultWebsiteEntities = (websiteDoc) => {
  return Promise.all([
    pageService.createHomePage(websiteDoc),
    snippetService.udpatePageMenubarSnippet(websiteDoc),
    snippetService.createFooterSnippet(websiteDoc)
  ]).then(results => {
    // Defers compile page task
    compilePageHelper.compilePages(websiteDoc).then(() => {
      console.log(`Compiled all pages and stored successfully. Subdomain: ${websiteDoc.get('subdomain')}`)
    }).catch(err => {
      console.error('[ERROR]: Failed to compile given content. Error:', err)
    })
    return Promise.resolve(websiteDoc)
  })
}

const deleteWebsiteEntities = (websiteDoc) => {
  return Promise.all([
    pageService.deleteWebsitePages(websiteDoc),
    snippetService.deleteWebsiteSnippets(websiteDoc)
  ])
}

module.exports = {
  createDefaultWebsiteEntities,
  deleteWebsiteEntities
}