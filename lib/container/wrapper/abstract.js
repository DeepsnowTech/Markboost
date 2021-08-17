const { writeOpen, writeEnd, writeElement } = require("../../renderer");

function render(tokens, idx, _options, env, slf) {
    env.abstract = tokens[idx].content
    let res = []
    res.push(writeOpen("div", { class: "abstract" }))
    
    let contents = tokens[idx].content.split("\n\n")
    for(let para of contents){
        res.push(writeElement("p",null,para))
    }

    res.push(writeEnd("div", { class: "abstract" }))
    return res.join("")
}

module.exports = {
    attrs: {
        innerType: 2 // direct
    },
    beforeTokenize: null,
    render: render
}