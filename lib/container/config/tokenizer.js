'use strict';



module.exports = function tokenizeConfig(state, tagName, params, auto_closed, startLine, endLine) {
    let old_line_max = state.lineMax;
    state.parentType = 'config';
    state.lineMax = endLine;

    if (auto_closed) {

        let content = null
        if (startLine != endLine) {
            let contentStart = state.bMarks[startLine + 1] + state.tShift[startLine + 1]
            let contentEnd = state.eMarks[endLine - 1]
            content = state.src.slice(contentStart, contentEnd);
        }
        let token = state.push('config_container', 'div', 0);
        token.block = true;
        token.hidden = true;
        token.tag = tagName;
        token.content = content
        token.info = params;
        token.map = [startLine, endLine];
    } else {
        let token = state.push('parse_warning', 'div', 0);
        //token.markup = markup;
        token.block = true;
        token.info = "Container not closed!";
        token.map = [startLine, endLine];
    }

    state.lineMax = old_line_max;
    state.line = endLine + (auto_closed ? 1 : 0);
}