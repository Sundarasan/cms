
const _ = require('lodash')
const HttpError = require('../helper/http-error')
const Website = require('../model/website')
const Page = require('../model/page')
const compilePageHelper = require('../helper/compile-page')

const createPage = (websiteId, page) => {
  return Website.findById(websiteId).then(websiteDoc => {
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
      })
    }
  }).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to fetch website'
    ))
  })
}

const editPage = (websiteId, pageId, page) => {
  const pageDoc = new Page()
  return Website.findById(websiteId).then(websiteDoc => {
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
          return pageDoc.save().then(pageDoc => {
            // Defers compile page task
            compilePageHelper.compilePage(websiteDoc, pageDoc).then(() => {
              console.log(`Compiled page and stored successfully. Subdomain: ${websiteDoc.get('subdomain')} | Page: ${pageDoc.get('label')}`)
            }).catch(err => {
              console.error('[ERROR]: Failed to compile given content. Error:', err)
            })
            return Promise.resolve(pageDoc)
          }).catch(err => {
            console.error('[ERROR]: Failed to update page. Error:', err)
            return Promise.reject(new HttpError(
              500,
              'UNKNOWN_ERROR',
              'Failed to save page'
            ))
          })
        }
      }).catch(err => {
        console.error('[ERROR]: Failed to fetch page. Error:', err)
        return Promise.reject(new HttpError(
          500,
          'UNKNOWN_ERROR',
          'Failed to fetch page'
        ))
      })
    }
  }).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to fetch website'
    ))
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
  })
}

module.exports = {
  createPage,
  editPage,
  deletePage
}