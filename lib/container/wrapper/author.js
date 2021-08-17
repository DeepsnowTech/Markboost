const { writeElement, writeOpen, writeEnd, writeWarning } = require("../../renderer")
const { getLabellingBeforeTokenize } = require("../../tokenizer")
const { escapeHtml } = require("./tokenizer")


function render(tokens, idx, _options, env, slf) {
    if (!env.author) {
        return writeWarning("No author specified!")
    }
    if (!env.affils) {
        env.affils = {}
    }
    if (typeof env.author == String) {
        env.author = [{ givenName: env.author }]
    }
    if (!Array.isArray(env.author)) env.author = [env.author]

    let affilIndices = preProcessAuthorAffil(env.author, env.affils)

    return getAuthorBox(env.author, env.affils, affilIndices)
}



function getAuthorBox(author, affilDict, affilIndices) {

    let res = []
    res.push(writeOpen("div", { class: "author-box" }))
    res.push(writeOpen("div", { class: "author-list" }))
    for (let info of author) {
        res.push(writeOpen("span", { class: "author-entry" }))
        res.push([info.givenName, info.familyName].join(" "))
        if (info.affils) {
            res.push(writeOpen("sup", null))
            for (let affil of info.affils) {
                let attr = { class: "affil-link", href: "#affil-def-" + affil }
                res.push(writeElement("a", attr, affilIndices[affil]))
            }
            res.push(writeEnd("sup"))
        }
        if (info.email) {

        }
        res.push(writeEnd("span"))
    }
    res.push(writeEnd("div")) // End author-list
    res.push(writeOpen("div", { class: "affil-list" }))
    for (let affilKey in affilIndices) {
        res.push(writeElement("p", { class: "affil-define", id: "affil-def-" + affilKey }, writeElement("sup", null, affilIndices[affilKey]) + affilDict[affilKey]))
    }
    res.push(writeEnd("div")) // End affil-list
    res.push(writeEnd("div")) // End author-box
    return res.join("")
}


function preProcessAuthorAffil(author, affilDict) {
    let usedAffil = []
    let affilIndices = {}
    for (let info of author) {
        if (!info.affils) continue;
        if (!Array.isArray(info.affils)) info.affils = [info.affils]
        for (let i in info.affils) {
            let affil = info.affils[i]
            // If this affil is not registered
            if (!affilDict[affil]) {
                let newKey = "not-registered-" + Object.keys(affilDict).length
                affilDict[newKey] = affil
                info.affils[i] = newKey
                affil = newKey
            }
            let index = usedAffil.indexOf(affil)
            if (index < 0) {
                usedAffil.push(affil)
                affilIndices[affil] = usedAffil.length
            }
        }
    }
    return affilIndices
}

module.exports = {
    attrs: {
        innerType: 0
    },
    beforeTokenize: null,
    render: render
}