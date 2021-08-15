
const rules = {
    "Equation": require('./equation'),
    "": require('./yaml_config'),
}

const { getContainerRenderer } = require("../../helper")
const { getTokenizer } = require('./helper')

module.exports.render = getContainerRenderer(rules)
module.exports.tokenize = getTokenizer(rules)