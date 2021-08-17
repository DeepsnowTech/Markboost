const { writeOpen, writeEnd, writeElement } = require("../../renderer")

function renderToc(tokens, idx, _options, env, slf) {
    let params = tokens[idx].attrs
    let tagName = params.tagName || "Section"
    // opening tag
    let res = []
    res.push(writeOpen("div", { class: "content-table" }))

    const idNames = env.idNames
    let contentList = []
    for (let id in idNames) {
        if (idNames[id].tagName != tagName) continue
        const index = idNames[id].index
        contentList.push({ index: index, id: id, title: idNames[id]["title"] })
    }
    contentList.sort((a, b) => {
        maxLen = Math.min(a.index.length, b.index.length)
        for (let i = 0; i < maxLen; i++) {
            if (a.index[i] < b.index[i]) return -1
            if (a.index[i] > b.index[i]) return 1
        }
        if (a.index.length < b.index.length) return -1
        if (a.index.length > b.index.length) return 1
        return 0
    })

    res.push(writeOpen("ul", { class: "content-list" }))
    let lastLevel = 1
    for (let section of contentList) {
        let thisLevel = section.index.length
        if (thisLevel > lastLevel) {
            res.push(writeOpen("ul", { class: "content-list" }))
        }
        for (let diff = lastLevel - thisLevel; diff > 0; diff--) {
            res.push(writeEnd("ul"))
        }
        res.push(writeOpen("li", { class: "content-list-item" }))

        res.push(writeElement("a", { href: "#" + section.id, class: "content-list-link" }, section.index.join(".") + (section.index.length == 1 ? "." : "") + " " + section.title))
        res.push(writeEnd("li"))
        lastLevel = thisLevel
    }
    for (let i = 1; i <= lastLevel; i++) {
        res.push(writeEnd("ul"))
    }
    res.push(writeEnd("div"))
    return res.join("")
}

module.exports = {
    attrs: {
        innerType : 0
    },
    render: renderToc
}