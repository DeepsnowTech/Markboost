const { writeOpen, writeInline } = require("../../renderer")

function render(tokens, idx, _options, env, slf) {
    if (tokens[idx].nesting === 1) {
        // opening tag
        let attrs = tokens[idx].attrs
        let name = attrs.tagName || tokens[idx].tag
        let res = [writeOpen('div', { class: "remark-box", id: attrs.id, name: name, index: attrs.index })]
        if (attrs.title)
            res.push(writeInline("span", { class: "remark-title" }, attrs.title))
        return res.join("")
    } else {
        // closing tag
        return '</div>\n';
    }
}

function getRemarkPlugin(tagName, refName) {
    return {
        attrs: {
            innerType: 1, // only paragraphs
            defaultLabel: true,
            tagName: tagName,
            refName: refName
        },
        beforeTokenize: null,
        render: render
    }
}


module.exports = getRemarkPlugin