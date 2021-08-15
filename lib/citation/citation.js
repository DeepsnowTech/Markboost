'use strict';

;
const { renderCitation } = require('./renderer');
module.exports = function citation_plugin(md, name, options) {

    options = options || {};

    md.inline.ruler.before('link', 'citation', parseCitation);
    md.renderer.rules["id_link"] = function (tokens, idx, _options, env, slf) {
        let id = tokens[idx].info
        let linkName = env.idNames[id]
        return ['<a href="#', tokens[idx].info, '">', linkName.name, linkName.tag, '</a>'].join("")
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

    state.pos = labelEnd + 2

    return true
}