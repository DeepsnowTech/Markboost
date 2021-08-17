const MarkdownIt = require('markdown-it')

module.exports = new MarkdownIt().use(require('./container/index.js')).use(require('./citation')).disable(['code', 'fence', 'blockquote']);