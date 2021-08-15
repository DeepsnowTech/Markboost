'use strict';
module.exports.getTokenizer = function (rules) {
    const tokenizeSpace = function (state, tagName, params, auto_closed, startLine, endLine) {
        let old_parent = state.parentType;
        let old_line_max = state.lineMax;
        state.parentType = 'space';
        state.lineMax = endLine;

        if (auto_closed) {
            if (rules[tagName].beforeTokenize)
                rules[tagName].beforeTokenize(state, params)
            let token = state.push('space_open', tagName, 1);
            token.block = true;
            token.attr = params;
            token.map = [startLine, endLine];

            if (startLine != endLine) state.md.block.tokenize(state, startLine + 1, endLine);

            token = state.push('space_close', tagName, -1);
            token.block = true;
            token.attr = params;
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
    return tokenizeSpace
}