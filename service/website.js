
const _ = require('lodash')
const Promise = require('bluebird')
const HttpError = require('../helper/http-error')
const Website = require('../model/website')
const Page = require('../model/page')
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
  return Website.findOneAndRemove({
    _id: websiteId
  }).catch(err => {
    console.error('[ERROR]: Failed to delete website. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to delete website'
    ))
  }).then(result => {
    console.log('result:', result)
    if (!result.n) {
      return Promise.reject(new HttpError(
        404,
        'WEBSITE_NOT_FOUND',
        'Website not found'
      ))
    } else {
      const promiseArray = []
      return Promise.all([
        Page.remove({
          website: websiteId
        }),
        CompiledPage.remove({
          website: websiteId
        }),
        Snippet.remove({
          website: websiteId
        })
      ]).catch(err => {
        console.error('[ERROR]: Failed to delete website data. Error:', err)
        return Promise.reject(new HttpError(
          500,
          'UNKNOWN_ERROR',
          'Failed to delete website data'
        ))
      })    
    }
  })
}

module.exports = {
  createWebsite,
  updateWebsite,
  deleteWebsite
}