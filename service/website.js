
const _ = require('lodash')
const Promise = require('bluebird')
const HttpError = require('../helper/http-error')
const Website = require('../model/website')
const Page = require('../model/page')
const websiteHelper = require('../helper/website')
const CompiledPage = require('../model/compiled-page')

const createWebsite = (website) => {
  const websiteDoc = new Website()
  websiteDoc.set({
    subdomain: _.trim(website.subdomain)
  })
  return websiteDoc.save().catch(err => {
    console.error('[ERROR]: Failed to create website. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to create website'
    ))
  }).then(websiteDoc => {
    return websiteHelper.createDefaultWebsiteEntities(websiteDoc)
  })
}

const updateWebsite = (websiteId, website) => {
  return Website.findById(websiteId).catch(err => {
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to find website'
    ))
  }).then(websiteDoc => {
    if (!websiteDoc) {
      return Promise.reject(new HttpError(
        404,
        'WEBSITE_NOT_FOUND',
        'Failed to find website'
      ))
    } else {
      websiteDoc.set('subdomain', _.trim(website.subdomain))
      return websiteDoc.save().catch(err => {
        console.error('[ERROR]: Failed to update website. Error:', err)
        return Promise.reject(new HttpError(
          500,
          'UNKNOWN_ERROR',
          'Failed to save website'
        ))
      })
    }
  })
}

const deleteWebsite = (websiteId) => {
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
        'Failed to find website'
      ))
    } else {
      return websiteHelper.deleteWebsiteEntities(websiteDoc).then(() => {
        return websiteDoc.remove().catch(err => {
          console.error('[ERROR]: Failed to delete website. Error:', err)
          return Promise.reject(new HttpError(
            500,
            'UNKNOWN_ERROR',
            'Failed to delete website'
          ))  
        })
      })
    }
  })
}

module.exports = {
  createWebsite,
  updateWebsite,
  deleteWebsite
}