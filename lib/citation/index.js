'use strict';

;
const { writeInlineWarning } = require('../renderer');
const { renderCitation } = require('./renderer');
module.exports = function citation_plugin(md, options) {

    options = options || {};

    md.inline.ruler.before('link', 'citation', parseCitation);
    md.block.ruler.before('heading', 'heading_with_id', require("./heading"))
    
    md.renderer.rules["id_link"] = function (tokens, idx, _options, env, slf) {
        let id = tokens[idx].info
        let linkName = env.idNames[id]
        if(linkName)
            return ['<a href="#', tokens[idx].info, '">', linkName.refName,"&thinsp;",linkName.index.join("."), '</a>'].join("")
        else
            return writeInlineWarning("ID \""+id+"\" not found")
    }
    md.renderer.rules["cite_link"] = renderCitation

};


function parseCitation(state, silent) {
    if (state.src.charCodeAt(state.pos) !== 0x5B/* [ */) { return false; }
    let markup = state.src[state.pos + 1]
    if (markup !== "@" && markup !== "#") { return false }
    let labelStart = state.pos + 2;
    let labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
    // parser failed to find ']', so it's not a valid citation
    if (labelEnd < 0) { return false; }


    // label may contain comma like cite2020,cite2021
    // We process comma in label when rendering as not every
    // markup accept comma

    let label = state.src.slice(labelStart, labelEnd)

    // # indicates id link
    if (markup == "#") {
        let token = state.push('id_link', 'a', 0);
        token.info = label;
    }

    // @ indicates citation like \cite{}
    if (markup == "@") {
        let token = state.push('cite_link', 'a', 0);
        token.info = label;
    }

    state.pos = labelEnd + 1

    return true
}