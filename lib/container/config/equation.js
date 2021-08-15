const NAME = "Equation"
const REF_NAME = "Equ."

const { renderAttr } = require("../../helper")

function onTokenize(state, params) {

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


    let tag
    if (env.counter[NAME]) {
        tag = env.counter[NAME] + 1
        env.counter[NAME] += 1
    } else {
        env.counter[NAME] = 1
        tag = 1
    }

    let id = tokens[idx].attr?.id
    let attr = { class: "equation" }
    if (id) {
        env.idNames[id] = { name: REF_NAME, tag: tag }
        attr["id"] = id
    }

    return ["<p", renderAttr(attr), ">\n$$\n", content, "\n\\tag{", tag, "}\n$$\n</p>\n"].join("")
}

module.exports = {
    attrs: {},
    onTokenize: onTokenize,
    render: render
}