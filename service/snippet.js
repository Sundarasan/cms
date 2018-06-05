
const _ = require('lodash')
const ejs = require('ejs')
const HttpError = require('../helper/http-error')
const Website = require('../model/website')
const Page = require('../model/page')
const Snippet = require('../model/snippet')
const compilePageHelper = require('../helper/compile-page')
const defaultFooterContentTemplate = require('../helper/default-content').defaultFooterContentTemplate

const pageMenubarTemplateString = require('../view/page/static/page-menubar.html')
const pageMenubarTemplate = ejs.compile(pageMenubarTemplateString)

const createSnippet = (websiteId, snippet) => {
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
      const snippetDoc = new Snippet()
      snippetDoc.set({
        website: websiteDoc.get('id'),
        label: _.trim(snippet.label),
        content: _.trim(snippet.content),
        isEditable: true
      })
      return snippetDoc.save().then(snippetDoc => {
        // Defers compile page task
        compilePageHelper.compilePages(websiteDoc).then(() => {
          console.log(`Compiled all pages and stored successfully. Subdomain: ${websiteDoc.get('subdomain')}`)
        }).catch(err => {
          console.error('[ERROR]: Failed to compile given content. Error:', err)
        })
        return Promise.resolve(snippetDoc)
      }).catch(err => {
        console.error('[ERROR]: Failed to create snippet. Error:', err)
        return Promise.reject(new HttpError(
          500,
          'UNKNOWN_ERROR',
          'Failed to create snippet'
        ))
      })
    }
  })
}

const updateSnippet = (websiteId, snippetId, snippet) => {
  return Website.findById(websiteId).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to fetch website'
    ))
  }).then(websiteDoc => {
    return Snippet.findOne({
      _id: snippetId,
      website: websiteDoc.get('id'),
      isEditable: true
    }).catch(err => {
      console.error('[ERROR]: Failed to update snippet. Error:', err)
      return Promise.reject(new HttpError(
        500,
        'UNKNOWN_ERROR',
        'Failed to fetch snippet'
      ))
    }).then(snippetDoc => {
      if (!snippetDoc) {
        return Promise.reject(new HttpError(
          404,
          'SNIPPET_NOT_FOUND',
          'Snippet not found'
        ))
      } else {
        snippetDoc.set('label', _.trim(snippet.label))
        snippetDoc.set('content', _.trim(snippet.content))
        return snippetDoc.save().then(snippetDoc => {
          // Defers compile page task
          compilePageHelper.compilePages(websiteDoc).then(() => {
            console.log(`Compiled all pages and stored successfully. Subdomain: ${websiteDoc.get('subdomain')}`)
          }).catch(err => {
            console.error('[ERROR]: Failed to compile given content. Error:', err)
          })
          return Promise.resolve(snippetDoc)
        }).catch(err => {
          console.error('[ERROR]: Failed to save snippet. Error:', err)
          return Promise.reject(new HttpError(
            500,
            'UNKNOWN_ERROR',
            'Failed to save snippet'
          ))
        })
      }
    })
  })
}

const deleteSnippet = (websiteId, snippetId) => {
  return Website.findById(websiteId).catch(err => {
    console.error('[ERROR]: Failed to fetch website. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to fetch website'
    ))
  }).catch(err => {
    console.error('[ERROR]: Failed to delete snippet. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to delete snippet'
    ))
  }).then(websiteDoc => {
    return Snippet.findOneAndRemove({
      _id: snippetId,
      website: websiteDoc.get('id'),
      isEditable: true
    }).then(result => {
      // Defers compile page task
      compilePageHelper.compilePages(websiteDoc).then(() => {
        console.log(`Compiled all pages and stored successfully. Subdomain: ${websiteDoc.get('subdomain')}`)
      }).catch(err => {
        console.error('[ERROR]: Failed to compile given content. Error:', err)
      })
      return Promise.resolve(result)
    })
  })
}

const createFooterSnippet = (websiteDoc) => {
  const content = defaultFooterContentTemplate({
    websiteDoc
  })
  return createSnippet(websiteDoc.get('id'), {
    label: 'footer',
    content: content
  })
}

const udpatePageMenubarSnippet = (websiteDoc) => {
  return Page.find({
    website: websiteDoc.get('id')
  }).catch(err => {
    console.error('[ERROR]: Failed to fetch pages. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to fetch pages'
    ))
  }).then(pageDocs => {
    const menubarContent = pageMenubarTemplate({
      pageDocs
    })
    return updateNonEditableSnippet(websiteDoc, 'menubar', menubarContent)
  })
}

const updateNonEditableSnippet = (websiteDoc, label, content) => {
  return Snippet.findOneAndUpdate({
    label: label,
    website: websiteDoc.get('id'),
  }, {
    $set: {
      content: content,
      isEditable: false
    }
  }, {
    upsert: true
  }).catch(err => {
    console.error('[ERROR]: Failed to update non-editable snippet. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to update non editable snippet'
    ))
  }).then(result => {
    // Defers compile page task
    compilePageHelper.compilePages(websiteDoc).then(() => {
      console.log(`Compiled all pages and stored successfully. Subdomain: ${websiteDoc.get('subdomain')}`)
    }).catch(err => {
      console.error('[ERROR]: Failed to compile given content. Error:', err)
    })
    return Promise.resolve(result)
  })
}

const deleteWebsiteSnippets = (websiteDoc) => {
  return Snippet.remove({
    website: websiteDoc.get('id')
  }).catch(err => {
    console.error('[ERROR]: Failed to delete website snippets. Error:', err)
    return Promise.reject(new HttpError(
      500,
      'UNKNOWN_ERROR',
      'Failed to delete website snippets'
    ))
  })
}

module.exports = {
  createSnippet,
  updateSnippet,
  deleteSnippet,
  udpatePageMenubarSnippet,
  createFooterSnippet,
  deleteWebsiteSnippets
}
