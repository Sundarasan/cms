
const _ = require('lodash')
const HttpError = require('../helper/http-error')
const Website = require('../model/website')
const Page = require('../model/page')
const CompiledPage = require('../model/compiled-page')
const compilePageHelper = require('../helper/compile-page')
const snippetService = require('../service/snippet')
const defaultPageContentTemplate = require('../helper/default-content').defaultPageContentTemplate

const createPage = (websiteId, page) => {
  return Website.findById(websiteId).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to fetch website'
    ))
  }).then(websiteDoc => {
    if (!websiteDoc) {
      return Promise.reject(new HttpError(
        404,
        'WEBSITE_NOT_FOUND',
        'Website not found'
      ))
    } else {
      const pageDoc = new Page()
      pageDoc.set({
        website: websiteDoc.get('id'),
        label: _.trim(page.label),
        content: _.trim(page.content)
      })
      return pageDoc.save().catch(err => {
        console.error('[ERROR]: Failed to create page. Error:', err)
        return Promise.reject(new HttpError(
          500,
          'UNKNOWN_ERROR',
          'Failed to create page'
        ))
      }).then(pageDoc => {
        // Defers compile page task
        compilePageHelper.compilePage(websiteDoc, pageDoc).then(() => {
          console.log(`Compiled page and stored successfully. Subdomain: ${websiteDoc.get('subdomain')} | Page: ${pageDoc.get('label')}`)
        }).catch(err => {
          console.error('[ERROR]: Failed to compile given content. Error:', err)
        })
        snippetService.udpatePageMenubarSnippet(websiteDoc).then(() => {
          console.log(`Updated menubar snippet. Subdomain: ${websiteDoc.get('subdomain')}`)
        }).catch(err => {
          console.error('[ERROR]: Failed to update menubar snippet. Error:', err)
        })
        return Promise.resolve(pageDoc)
      })
    }
  })
}

const updatePage = (websiteId, pageId, page) => {
  const pageDoc = new Page()
  return Website.findById(websiteId).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to fetch website'
    ))
  }).then(websiteDoc => {
    if (!websiteDoc) {
      return Promise.reject(new HttpError(
        404,
        'WEBSITE_NOT_FOUND',
        'Website not found'
      ))
    } else {
      return Page.findOne({
        _id: pageId,
        website: websiteDoc.get('id')
      }).catch(err => {
        console.error('[ERROR]: Failed to fetch page. Error:', err)
        return Promise.reject(new HttpError(
          500,
          'UNKNOWN_ERROR',
          'Failed to fetch page'
        ))
      }).then(pageDoc => {
        if (!pageDoc) {
          return Promise.reject(new HttpError(
            404,
            'PAGE_NOT_FOUND',
            'Page not found'
          ))
        } else {
          pageDoc.set('label', _.trim(page.label))
          pageDoc.set('content', _.trim(page.content))
          return pageDoc.save().catch(err => {
            console.error('[ERROR]: Failed to update page. Error:', err)
            return Promise.reject(new HttpError(
              500,
              'UNKNOWN_ERROR',
              'Failed to save page'
            ))
          }).then(pageDoc => {
            // Defers compile page task
            compilePageHelper.compilePage(websiteDoc, pageDoc).then(() => {
              console.log(`Compiled page and stored successfully. Subdomain: ${websiteDoc.get('subdomain')} | Page: ${pageDoc.get('label')}`)
            }).catch(err => {
              console.error('[ERROR]: Failed to compile given content. Error:', err)
            })
            snippetService.udpatePageMenubarSnippet(websiteDoc).then(() => {
              console.log(`Updated menubar snippet. Subdomain: ${websiteDoc.get('subdomain')}`)
            }).catch(err => {
              console.error('[ERROR]: Failed to update menubar snippet. Error:', err)
            })
            return Promise.resolve(pageDoc)
          })
        }
      })
    }
  })
}

const deletePage = (websiteId, pageId) => {
  return Page.findOneAndRemove({
    _id: pageId,
    website: websiteId
  }).catch(err => {
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to delete page'
    ))
  }).then(result => {
    return CompiledPage.findOneAndRemove({
      page: pageId,
      website: websiteId
    }).catch(err => {
      return Promise.reject(new HttpError(
        500,
        'UNKNOWN_ERROR',
        'Failed to delete compiled page'
      ))
    })
  })
}

const createHomePage = (websiteDoc) => {
  const label = 'home'
  console.log('Page label:', label)
  const content = defaultPageContentTemplate({
    pageLabel: label
  })
  return createPage(websiteDoc.get('id'), {
    label,
    content
  })
}

const deleteWebsitePages = (websiteDoc) => {
  const websiteId = websiteDoc.get('id')
  return Page.remove({
    website: websiteId
  }).catch(err => {
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to delete website pages'
    ))
  }).then(result => {
    return CompiledPage.remove({
      website: websiteId
    }).catch(err => {
      return Promise.reject(new HttpError(
        500,
        'UNKNOWN_ERROR',
        'Failed to delete compiled website pages'
      ))
    })
  })
}

module.exports = {
  createPage,
  updatePage,
  deletePage,
  createHomePage,
  deleteWebsitePages
}