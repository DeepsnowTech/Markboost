'use strict';

const parseParagraph = require("./paragraph")

module.exports.getTokenizer = function (rules) {

    const tokenizeWrapper = function (state, tagName, params, auto_closed, startLine, endLine) {
        let old_parent = state.parentType;
        let old_line_max = state.lineMax;
        state.parentType = 'wrapper';
        state.lineMax = endLine;

        const tagRule = rules[tagName]
        if (auto_closed) {
            if (tagRule.beforeTokenize) tagRule.beforeTokenize(state, params)
            switch (tagRule.attrs.innerType) {
                case 1: // innerType is block
                    {
                        let token = state.push('wrapper_open', tagName, 1);
                        token.block = true;
                        token.attrs = params;
                        token.map = [startLine, endLine];

                        if (startLine != endLine) state.md.block.tokenize(state, startLine + 1, endLine);

                        token = state.push('wrapper_close', tagName, -1);
                        token.block = true;
                        break
                    }
                case 0: // one line command
                    {
                        if (startLine == endLine) {
                            let token = state.push('one_line_command', tagName, 0);
                            token.block = true;
                            token.attrs = params;
                            token.map = [startLine, endLine];
                        } else {
                            let token = state.push('parse_warning', 'div', 0);
                            token.block = true;
                            token.info = "Command \"" + tagName + "\" should be one line!";
                            token.map = [startLine, endLine];
                        }
                        break
                    }
                case -1:
                    {
                        let token = state.push('wrapper_open', tagName, 1);
                        token.attrs = params;
                        token.map = [startLine, endLine];

                        // Parse paragraphs
                        if (startLine != endLine) {
                            state.line = startLine + 1
                            do {
                                parseParagraph(state, state.line)
                            } while (state.line < endLine);
                        }

                        token = state.push('wrapper_close', tagName, -1);
                        break
                    }
                case 2: // direct pass
                    {
                        let token = state.push('one_line_command', tagName, 1);
                        token.attrs = params;
                        token.map = [startLine, endLine];

                        let content = null
                        if (startLine != endLine) {
                            let contentStart = state.bMarks[startLine + 1] + state.tShift[startLine + 1]
                            let contentEnd = state.eMarks[endLine - 1]
                            content = state.src.slice(contentStart, contentEnd);
                        }
                        token.content = content
                        break
                    }
                default:

            }
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
    return tokenizeWrapper
}