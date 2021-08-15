'use strict';

const bibtexParse = require('@orcid/bibtex-parse-js');
const fs = require("fs");
const { renderAttr, writeElement, writeInline } = require('../container/helper');
module.exports = function citation_plugin(md, name, options) {

    options = options || {};

    md.inline.ruler.before('link', 'citation', parseCitation);
    md.renderer.rules["id_link"] = function (tokens, idx, _options, env, slf) {
        let id = tokens[idx].info
        let linkName = env.idNames[id]
        return ['<a href="#', tokens[idx].info, '">', linkName.name, linkName.tag, '</a>'].join("")
    }
    md.renderer.rules["cite_link"] = function (tokens, idx, _options, env, slf) {
        let id = tokens[idx].info
        if (env.bibtex) {
            if (env.bibtexJSON) {

            } else {
                // TODO deal with err
                let bibtexContent = fs.readFileSync(env.bibtex, 'utf-8')
                let bibtexList = bibtexParse.toJSON(bibtexContent)
                let bibtexJSON = {}
                for(let term of bibtexList){
                    bibtexJSON[term.citationKey] = term
                }
                env.bibtexJSON = bibtexJSON
            }
        } else {
            //return writeElement("span",null,tokens[idx].info)
        }
        let tag = env.citedKeys.indexOf(id)
        if (tag < 0) {
            env.citedKeys.push(id)
            tag = env.citedKeys.length - 1
        }
        tag += 1
        return writeInline("a", { href: "#cite-def-" + id }, "[" + tag + "]")
    }

};


function parseCitation(state, silent) {
    if (state.src.charCodeAt(state.pos) !== 0x5B/* [ */) { return false; }
    let markup = state.src[state.pos + 1]
    if (markup !== "@" && markup !== "#") { return false }
    let labelStart = state.pos + 2;
    let labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
    // parser failed to find ']', so it's not a valid citation
    if (labelEnd < 0) { return false; }

    let label = state.src.slice(labelStart, labelEnd)

    if (markup == "#") {
        let token = state.push('id_link', 'a', 0);
        token.info = label;
    }

    if (markup == "@") {
        let token = state.push('cite_link', 'a', 0);
        token.info = label;
    }


    state.pos = labelEnd + 2

    return true
}