const MarkdownIt = require('markdown-it')

module.exports = new MarkdownIt({
    html: true,        // Enable HTML tags in source
    xhtmlOut: true
}).use(require('./container/index.js')).use(require('./citation')).use(require('./inline/index'));