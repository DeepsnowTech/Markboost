const yaml = require('js-yaml')

let rules = {
    "": function (tokens, idx, _options, env, slf) {
        let config = yaml.load(tokens[idx].content)
        Object.assign(env, config)
        return ""
    },
    Equation: require("./equation")
}


const { getContainerRenderer } = require("../helper")
module.exports = getContainerRenderer(rules)