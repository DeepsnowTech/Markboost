const bibtexParse = require('@orcid/bibtex-parse-js');
const fs = require("fs");
const path = require('path');
const { writeInline, writeWarning } = require('../renderer')

function renderCitation(tokens, idx, _options, env, slf) {

    if (env.bibPath) {
        // If bib file has not being loaded
        if (!env.bibDict) {
            // Load the file
            env.bibDict = loadBibDict(path.resolve(env.basePath,env.bibPath))
            // If fail loading
            if (!env.bibDict) {
                // Make the object {} so that the render won't load again
                env.bibDict = {}
                env.bibKeys = []
                return writeWarning("bibPath invalid")
            } else {
                env.bibKeys = Object.keys(env.bibDict)
            }
        }
    } else {
        return writeWarning("bibPath not identified")
    }

    let label = tokens[idx].info
    let links = getCiteLinkList(label, env.bibKeys, env.citedKeys)

    return writeInline("span",{class:"cite-links"},links)

}
module.exports.renderCitation = renderCitation

function getCiteLinkList(label, bibKeys, citedKeys) {
    let idList = label.split(",")
    let tagList = []
    let missedKeys = []
    for (let id of idList) {
        id = id.trim()
        let tag = citedKeys.indexOf(id)
        // If key hasn't cited yet
        if (tag < 0) {
            if (bibKeys.indexOf(id) > -1) {
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

function loadBibDict(path) {
    try {
        let bibtexContent = fs.readFileSync(path, 'utf-8')
        let bibtexList = bibtexParse.toJSON(bibtexContent)
        let bibDict = {}
        for (let term of bibtexList) {
            bibDict[term.citationKey] = term
        }
        return bibDict
    } catch (error) {
        return null
    }
}