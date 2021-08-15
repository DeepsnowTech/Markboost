'use strict';

const RJSON = require('relaxed-json')

module.exports = function getContainerParser(marker_str, min_markers, name, tokenizeContent) {

    let marker_char = marker_str.charCodeAt(0)
    let marker_len = marker_str.length

    function parseContainer(state, startLine, endLine, silent) {
        var pos, currentLine, marker_count, markup,
            start = state.bMarks[startLine] + state.tShift[startLine],
            max = state.eMarks[startLine];
        var auto_closed = false

        // Check out the first character quickly,
        // this should filter out most of non-spaces
        //
        if (marker_char !== state.src.charCodeAt(start)) { return false; }

        // Check out the rest of the marker string
        //
        for (pos = start + 1; pos <= max; pos++) {
            if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
                break;
            }
        }

        marker_count = Math.floor((pos - start) / marker_len);
        if (marker_count < min_markers) { return false; }
        pos -= (pos - start) % marker_len;

        markup = state.src.slice(start, pos);

        let afterMarkup = state.src.slice(pos, max).trim()
        let afterLen = afterMarkup.length
        // Check single line container
        var single_line = true
        var pos1 = 0
        for (; pos1 < markup.length; pos1++) {
            if (markup[markup.length - 1 - pos1] !== afterMarkup[afterLen - pos1 - 1]) {
                single_line = false
                break;
            }
        }
        if (single_line) {
            afterMarkup = afterMarkup.slice(0, afterLen - pos1).trim()
        }

        let infoTexts = afterMarkup.split("{", 2);
        let tagName = infoTexts[0].trim()
        let params = null
        if (infoTexts[1]) {
            let rjson_src = "{" + infoTexts[1]
            try {
                params = RJSON.parse(rjson_src, { warnings: true })
            } catch (error) {
                let token = state.push('parse_warning', 'div', 0);
                //token.markup = markup;
                token.block = true;
                token.info = ["JSON parse error:\"", error.message, "\" at string \"", rjson_src, "\""].join("");
                token.map = [startLine, endLine];
            }
        }

        // Since start is found, we can report success here in validation mode
        //
        if (silent) { return true; }

        // Search for the end of the block
        //
        currentLine = startLine;

        if (!single_line) {
            for (; ;) {
                currentLine++;
                // unclosed block should be autoclosed by end of document.
                // also block seems to be autoclosed by end of parent
                if (currentLine >= endLine) {
                    break;
                }

                start = state.bMarks[currentLine] + state.tShift[currentLine];
                max = state.eMarks[currentLine];

                // non-empty line with negative indent should stop the list:
                // - ```
                //  test
                if (start < max && state.sCount[currentLine] < state.blkIndent) {
                    break;
                }

                if (marker_char !== state.src.charCodeAt(start)) { continue; }

                // closing fence should be indented less than 4 spaces
                if (state.sCount[currentLine] - state.blkIndent >= 4) {
                    continue;
                }

                // count markers
                for (pos = start + 1; pos <= max; pos++) {
                    if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
                        break;
                    }
                }
                // closing code fence must be at least as long as the opening one
                if (Math.floor((pos - start) / marker_len) < marker_count) { continue; }

                // make sure tail has spaces only
                pos -= (pos - start) % marker_len;
                pos = state.skipSpaces(pos);

                if (pos < max) { continue; }

                // found!
                auto_closed = true;
                break;
            }
        } else {
            auto_closed = true
        }

        tokenizeContent(state, tagName, params, auto_closed, startLine, currentLine)

        return true;
    }

    return parseContainer
}