
const Promise = require('bluebird')
const Website = require('../model/website')
const Page = require('../model/page')
const Snippet = require('../model/snippet')
const CompiledPage = require('../model/compiled-page')
const ejs = require('ejs')
const _ = require('lodash')
const compilationErrorTempateString = require('../view/page/static/compilation-error.html')
const compilationErrorTemplate = ejs.compile(compilationErrorTempateString)

const compilePages = (websiteDoc) => {
  return Page.find({
    website: websiteDoc.get('id')
  }).then(pageDocs => {
    return Snippet.find({
      website: websiteDoc.get('id')
    }).then(snippetDocs => {
      return Promise.each(pageDocs, pageDoc => {
        return _compilePage(websiteDoc, pageDoc, snippetDocs)
      })
    })
  })
}

const compilePage = (websiteDoc, pageDoc) => {
  return Snippet.find({
    website: websiteDoc.get('id')
  }).then(snippetDocs => {
    return _compilePage(websiteDoc, pageDoc, snippetDocs)
  })
}

const _compilePage = (websiteDoc, pageDoc, snippetDocs) => {
  const snippetContentArray = _.map(snippetDocs, snippetDoc => ({
    label: snippetDoc.get('label'),
    content: snippetDoc.get('content')
  }))
  const snippetByLabel = {}
  snippetContentArray.forEach(snippetContentObj => {
    snippetByLabel[snippetContentObj.label] = snippetContentObj.content
  })
  const templateParams = snippetByLabel
  let returnPromise
  try {
    const contentTemplate = ejs.compile(pageDoc.get('content'))
    const compiledContent = contentTemplate(templateParams)
    returnPromise = _updateCompilationSuccess(websiteDoc, pageDoc, compiledContent)
  } catch (error) {
    const compilationError = JSON.stringify(error, Object.getOwnPropertyNames(error))
    returnPromise = _updateCompilationError(websiteDoc, pageDoc, compilationError)
  }
  return returnPromise
}

const _updateCompilationSuccess = (websiteDoc, pageDoc, compiledContent) => {
  return CompiledPage.findOneAndUpdate({
    website: websiteDoc.get('id'),
    page: pageDoc.get('id')
  }, {
    $set: {
      content: compiledContent,
      isCompilationSuccess: true
    },
    $unset: {
      compilationError: 1
    }
  }, {
    upsert:true
  })
}

const _updateCompilationError = (websiteDoc, pageDoc, compilationError) => {
  const content = compilationErrorTemplate({
    pageLabel: pageDoc.get('label'),
    compilationError: compilationError
  })
  return CompiledPage.findOneAndUpdate({
    website: websiteDoc.get('id'),
    page: pageDoc.get('id')
  }, {
    $set: {
      content: content,
      isCompilationSuccess: false,
      compilationError: compilationError
    }
  }, {
    upsert:true
  })
}

module.exports = {
  compilePages,
  compilePage
}