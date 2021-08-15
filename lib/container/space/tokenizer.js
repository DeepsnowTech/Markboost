'use strict';

module.exports = function tokenizeSpace(state, tagName, params, auto_closed, startLine, endLine) {
    let old_parent = state.parentType;
    let old_line_max = state.lineMax;
    state.parentType = 'space';
    state.lineMax = endLine;

    if (auto_closed) {
        let token = state.push('space_open', 'div', 1);
        token.block = true;
        token.tag = tagName
        token.info = params;
        token.map = [startLine, endLine];

        if(startLine!=endLine) state.md.block.tokenize(state, startLine + 1, endLine);

        token = state.push('space_close', 'div', -1);
        token.block = true;
        token.tag = tagName
        token.info = params;
    } else {
        let token = state.push('parse_warning', 'div', 0);
        token.block = true;
        token.info = "Container not closed!";
        token.map = [startLine, endLine];
    }

    state.parentType = old_parent;
    state.lineMax = old_line_max;
    state.line = endLine + (auto_closed ? 1 : 0);
}