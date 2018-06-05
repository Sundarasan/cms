const ejs = require('ejs')

const defaultPageContent = require('../view/page/static/default-page.html')
const defaultPageContentTemplate = ejs.compile(defaultPageContent)

const defaultFooterContent = require('../view/page/static/default-footer.html')
const defaultFooterContentTemplate = ejs.compile(defaultFooterContent)

module.exports = {
  defaultPageContentTemplate,
  defaultFooterContentTemplate
}