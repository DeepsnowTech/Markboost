const bibtexParse = require('@orcid/bibtex-parse-js');
const fs = require("fs");
const { writeInline } = require('../helper')

function renderCitation(tokens, idx, _options, env, slf) {

    if (env.bibtex) {
        // If bibtex file has not being loaded
        if (!env.bibJSON) {
            // Load the file
            env.bibJSON = loadBibtex(env.bibtex)
            // If fail loading
            if (!env.bibJSON) {
                // Make the object {} so that the render won't load again
                env.bibJSON = {}
                return writeWarning("Bibtex invalid")
            } else {
                env.bibtexKeys = Object.keys(env.bibJSON)
            }
        }
    } else {
        return writeWarning("Bibtex not identified")
    }

    let label = tokens[idx].info
    let links = getCiteLinkList(label, env.bibtexKeys, env.citedKeys)

    return ["[", links, "]"].join("")
}
module.exports.renderCitation = renderCitation

function getCiteLinkList(label, bibtexKeys, citedKeys) {
    let idList = label.split(",")
    let tagList = []
    let missedKeys = []
    for (let id of idList) {
        id = id.trim()
        let tag = citedKeys.indexOf(id)
        // If key hasn't cited yet
        if (tag < 0) {
            if (bibtexKeys.indexOf(id) > -1) {
                citedKeys.push(id)
                tagList.push(citedKeys.length - 1)
            } else {
                missedKeys.push(id)
            }
        } else {
            tagList.push(tag)
        }
    }
    // Return if only one cite term
    if (tagList.length == 1) {
        return getCiteLinkStr(tagList, citedKeys, missedKeys)
    }

    tagList.sort()

    // Return if only two cite terms
    if (tagList.length == 2) {
        return getCiteLinkStr(tagList, citedKeys, missedKeys)
    }

    // If tagList.length >= 3
    let citeGroups = []

    for (let i = 0; i < tagList.length;) {
        let groupLen = 1
        for (let j = i + 1; j < tagList.length; j++) {
            if (tagList[j] != tagList[j - 1] + 1) break;
            else groupLen += 1
        }
        if (groupLen == 1) {
            citeGroups.push(tagList[i])
            i += 1
            continue
        }
        if (groupLen == 2) {
            citeGroups.push(tagList[i])
            citeGroups.push(tagList[i + 1])
            i += 2
            continue
        }
        // if groupLen >= 3
        citeGroups.push([tagList[i], tagList[i + groupLen - 1]])
        i += groupLen
    }

    return getCiteLinkStr(citeGroups, citedKeys, missedKeys)
}

function getCiteLinkStr(links, citedKeys, missedKeys) {
    let res = []
    for (let link of links) {
        if (!Array.isArray(link)) {
            res.push(writeInline("a", { class: "cite-link", href: "#cite-def-" + citedKeys[link] }, link + 1))
        } else {
            res.push(writeInline("a", { class: "cite-link", href: "#cite-def-" + citedKeys[link[0]] }, [link[0] + 1, link[1] + 1].join("-")))
        }
    }
    if (missedKeys.length > 0) {
        res.push(writeInline("a", { class: "citekey-miss-link", info: missedKeys.join() }, "?"))
    }
    return res.join()
}

function loadBibtex(path) {
    try {
        let bibtexContent = fs.readFileSync(path, 'utf-8')
        let bibtexList = bibtexParse.toJSON(bibtexContent)
        let bibJSON = {}
        for (let term of bibtexList) {
            bibJSON[term.citationKey] = term
        }
        return bibJSON
    } catch (error) {
        return null
    }
}