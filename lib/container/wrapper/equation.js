const TAG_NAME = "Equation"
const REF_NAME = "Equ."

const { writeElement } = require("../../renderer")
const { getLabeller } = require("../../tokenizer")


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
    let id = tokens[idx].attrs.id
    let attr = { class: "equation", id: id }
    const tag = env.idNames[id].index.slice().reverse().join(".")
    return writeElement("div", attr, ["$$", content, "\n\\tag{", tag, "}$$\n"].join(""))
}

module.exports = {
    attrs: {
        innerType: 2
    },
    beforeTokenize: getLabeller(TAG_NAME, REF_NAME),
    render: render
}