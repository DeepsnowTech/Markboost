const TAG_NAME = "Code"
const REF_NAME = "Code"


const { writeElement } = require("../../helper")
const { getLabellingBeforeTokenize } = require("../tokenizer")
const { escapeHtml } = require("./helper")

function beforeTokenize(state, params) {

}

function render(tokens, idx, _options, env, slf) {
    let content = escapeHtml(tokens[idx].content).replace("\n","<br/>")
    let id = tokens[idx].attr.id
    let attr = { class: "code-block", id: id }
    return writeElement("pre", attr, content)
}

module.exports = {
    attrs: {},
    beforeTokenize: getLabellingBeforeTokenize(TAG_NAME, REF_NAME),
    render: render
}