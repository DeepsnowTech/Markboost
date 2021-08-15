'use strict';


module.exports.getTokenizer = function (rules) {

    const tokenizeConfig = function (state, tagName, params, auto_closed, startLine, endLine) {
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
            if(rules[tagName].beforeTokenize) 
                rules[tagName].beforeTokenize(state, params)
            let token = state.push('config_container', tagName, 0);
            token.block = true;
            token.hidden = true;
            token.content = content
            token.attr = params;
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
    return tokenizeConfig

}