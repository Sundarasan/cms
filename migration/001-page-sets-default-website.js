const prompt = require('prompt')
const Page = require('../model/page')
const db = require('../helper/db')

prompt.start();

prompt.get(['websiteId'], (err, result) => {
  if (err) {
    console.error('[ERROR]: Failed to get default website ID. Error:', err)
  } else {
    db.connect()
    Page.update({
      website: {
        $exists: false
      }
    }, {
      $set: {
        website: result.websiteId
      }
    }, {
      multi: true
    }).then(result => {
      console.log(`Migrated ${result.n} pages.`)
      process.exit(0)
    }).catch(err => {
      console.error('[ERROR]: Failed to migrate pages. Error:', err)
      process.exit(1)
    })
  }
});
