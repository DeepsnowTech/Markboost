
const rules = {
    //"onRender": require('./on_render'),
    "":require('./on_parse')
}

const { getContainerRenderer } = require("../../renderer")
const { getTokenizer } = require('./tokenizer')

module.exports.render = getContainerRenderer(rules)
module.exports.tokenize = getTokenizer(rules)