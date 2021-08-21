'use strict';

const parseParagraph = require("./paragraph")

module.exports.getTokenizer = function (rules) {

    const tokenizeWrapper = function (state, tagName, params, auto_closed, startLine, endLine) {
        let old_parent = state.parentType;
        let old_line_max = state.lineMax;
        state.parentType = 'wrapper';
        state.lineMax = endLine;

        const tagRule = rules[tagName]
        if (!tagRule) {
            state.parentType = old_parent;
            state.lineMax = old_line_max;
            state.line = endLine + (auto_closed ? 1 : 0);
            return
        }
        if (auto_closed) {

            if (tagRule.beforeTokenize) tagRule.beforeTokenize(state, params)

            if (tagRule.attrs.defaultLabel) {
                if (!tagRule.attrs.tagName) tagRule.attrs.tagName = tagName
                let tagNameToLabel = tagName
                let refNameToLabel = tagRule.attrs.refName || tagName
                if (params.tagName) tagNameToLabel = params.tagName
                if (params.refName) refNameToLabel = params.refName
                defaultLabel(state, params, 0, tagNameToLabel, refNameToLabel)

            }

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
                case -1: // Parse paragraphs
                    {
                        let token = state.push('wrapper_open', tagName, 1);
                        token.attrs = params;
                        token.map = [startLine, endLine];

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

function defaultLabel(state, params, level, tagName, refName) {

    const env = state.env
    let tagCounter = env.counter[tagName]
    level = level || 0

    // Create counter if hasn't
    if (!tagCounter) {
        tagCounter = new Array(level + 1).fill(0)
        env.counter[tagName] = tagCounter
    } else if (tagCounter[level] === undefined) {
        tagCounter = tagCounter.concat(new Array(level + 1 - tagCounter.length).fill(0))
        env.counter[tagName] = tagCounter
    }

    // Update counter
    if (!params.no_index) {
        tagCounter[level]++
        // Make counter after current level all zero
        for (let i = level + 1; i < tagCounter.length; i++) {
            tagCounter[i] = 0
        }
    } else {
        return
    }

    let index = tagCounter.slice(0, level + 1) // assign a copy of the index

    // Assign default id
    if (!params.id) {
        params.id = toLowerLine(tagName) + "-" + index.join('-')
    }
    // Register idNames
    env.idNames[params.id]

    let record = {
        tagName: tagName,
        refName: refName || tagName,
        index: index
    }
    env.idNames[params.id] = record
    params["index"] = index.join(".")
}

function toLowerLine(str) {
    var temp = str.replace(/[A-Z]/g, function (match) {
        return "_" + match.toLowerCase();
    });
    if (temp.slice(0, 1) === '_') {
        temp = temp.slice(1);
    }
    return temp;
};