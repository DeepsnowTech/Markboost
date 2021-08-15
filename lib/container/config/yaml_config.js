const yaml = require('js-yaml')

function beforeTokenize(state, params) {

}

function render(tokens, idx, _options, env, slf) {
    let config = yaml.load(tokens[idx].content)
    Object.assign(env, config)
    return ""
}

module.exports = {
    attrs: {},
    beforeTokenize: beforeTokenize,
    render: render
}