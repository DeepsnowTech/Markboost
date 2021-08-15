const TAG_NAME = "Equation"
const REF_NAME = "Equ."

const { renderAttr } = require("../../helper")
const { getContainerBeforeTokenize } = require("../tokenizer")

function beforeTokenize(state, params) {

}

function render(tokens, idx, _options, env, slf) {

    let content = tokens[idx].content.trim()
    let end = content.length - 1
    let numMarker = 0
    if (content[0] === "$" && content[end] === "$") {
        if (end > 3 && content[1] === "$" && content[end - 1] === "$") {
            numMarker = 2
        } else {
            if (end > 1) numMarker = 1
        }
    }
    content = content.slice(numMarker, end - numMarker + 1)
    let id = tokens[idx].attr.id
    let attr = { class: "equation", id: id }
    const tag = env.idNames[id].index.slice().reverse().join(".")
    return ["<p", renderAttr(attr), ">\n$$\n", content, "\n\\tag{", tag, "}\n$$\n</p>\n"].join("")
}

module.exports = {
    attrs: {},
    beforeTokenize: getContainerBeforeTokenize(TAG_NAME, REF_NAME),
    render: render
}