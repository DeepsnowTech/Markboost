const TAG_NAME = "Code"
const REF_NAME = "Code"


const { writeElement } = require("../../renderer")
const { getLabellingBeforeTokenize } = require("../../tokenizer")
const { escapeHtml } = require("./helper")

function beforeTokenize(state, params) {

}

function render(tokens, idx, _options, env, slf) {
    let content = escapeHtml(tokens[idx].content).replace("\n","<br/>").trim()
    let id = tokens[idx].attrs.id
    let attr = { class: "code-block", id: id }
    return writeElement("pre", attr, "<span>"+content+"</span>")
}

module.exports = {
    attrs: {
        innerType: 2  // direct
    },
    beforeTokenize: getLabellingBeforeTokenize(TAG_NAME, REF_NAME),
    render: render
}