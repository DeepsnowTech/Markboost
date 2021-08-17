
const rules = {
    "": require('./config')
}

const { getContainerRenderer } = require("../../renderer")
const { getTokenizer } = require('./tokenizer')

module.exports.render = getContainerRenderer(rules)
module.exports.tokenize = getTokenizer(rules)