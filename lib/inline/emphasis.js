// Process *this* and _that_
//
'use strict';


// Insert each marker as a separate text token, and add it to delimiter list
//
module.exports.tokenize = function emphasis(state, silent) {
    var i, scanned, token,
        start = state.pos,
        marker = state.src.charCodeAt(start);

    if (silent) { return false; }

    if (marker !== 0x5F /* _ */ && marker !== 0x2A /* * */) { return false; }

    scanned = state.scanDelims(state.pos, marker === 0x2A /* * */);

    for (i = 0; i < scanned.length; i++) {
        token = state.push('text', '', 0);
        token.content = String.fromCharCode(marker);

        state.delimiters.push({
            // Char code of the starting marker (number).
            //
            marker: marker,

            // Total length of these series of delimiters.
            //
            length: scanned.length,

            // An amount of characters before this one that's equivalent to
            // current one. In plain English: if this delimiter does not open
            // an emphasis, neither do previous `jump` characters.
            //
            // Used to skip sequences like "*****" in one step, for 1st asterisk
            // value will be 0, for 2nd it's 1 and so on.
            //
            jump: i,

            // A position of the token this delimiter corresponds to.
            //
            token: state.tokens.length - 1,

            // If this delimiter is matched as a valid opener, `end` will be
            // equal to its position, otherwise it's `-1`.
            //
            end: -1,

            // Boolean flags that determine if this delimiter could open or close
            // an emphasis.
            //
            open: scanned.can_open,
            close: scanned.can_close
        });
    }

    state.pos += scanned.length;

    return true;
};


function postProcess(state, delimiters) {
    var i,
        startDelim,
        endDelim,
        token,
        ch,
        isDouble,
        max = delimiters.length;

    for (i = max - 1; i >= 0; i--) {
        startDelim = delimiters[i];

        if (startDelim.marker !== 0x5F/* _ */ && startDelim.marker !== 0x2A/* * */) {
            continue;
        }

        // Process only opening markers
        if (startDelim.end === -1) {
            continue;
        }

        endDelim = delimiters[startDelim.end];

        // If the previous delimiter has the same marker and is adjacent to this one,
        // merge those into one strong delimiter.
        //
        // `<em><em>whatever</em></em>` -> `<strong>whatever</strong>`
        //
        isDouble = i > 0 &&
            delimiters[i - 1].end === startDelim.end + 1 &&
            delimiters[i - 1].token === startDelim.token - 1 &&
            delimiters[startDelim.end + 1].token === endDelim.token + 1 &&
            delimiters[i - 1].marker === startDelim.marker;

        ch = String.fromCharCode(startDelim.marker);

        if (startDelim.marker === 0x2A/* * */) {
            token = state.tokens[startDelim.token];
            token.type = isDouble ? 'strong_open' : 'em_open';
            token.tag = isDouble ? 'strong' : 'em';
            token.nesting = 1;
            token.markup = isDouble ? ch + ch : ch;
            token.content = '';

            token = state.tokens[endDelim.token];
            token.type = isDouble ? 'strong_close' : 'em_close';
            token.tag = isDouble ? 'strong' : 'em';
            token.nesting = -1;
            token.markup = isDouble ? ch + ch : ch;
            token.content = '';
        } else if (startDelim.marker === 0x5F/* _ */) {
            token = state.tokens[startDelim.token];
            token.type = 'underline_open'
            token.tag = isDouble ? 'wave' : 'line';
            token.nesting = 1;
            token.markup = isDouble ? ch + ch : ch;
            token.content = '';

            token = state.tokens[endDelim.token];
            token.type = 'underline_close';
            token.tag = isDouble ? 'wave' : 'line';
            token.nesting = -1;
            token.markup = isDouble ? ch + ch : ch;
            token.content = '';
        }
        if (isDouble) {
            state.tokens[delimiters[i - 1].token].content = '';
            state.tokens[delimiters[startDelim.end + 1].token].content = '';
            i--;
        }
    }
}


// Walk through delimiter list and replace text tokens with tags
//
module.exports.postProcess = function emphasis(state) {
    var curr,
        tokens_meta = state.tokens_meta,
        max = state.tokens_meta.length;

    postProcess(state, state.delimiters);

    for (curr = 0; curr < max; curr++) {
        if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
            postProcess(state, tokens_meta[curr].delimiters);
        }
    }
};


module.exports.renderUnderline = function renderUnderline(tokens, idx, _options, env, slf) {
    if (tokens[idx].nesting === 1) {
        switch(tokens[idx].tag){
            case "line": return '<span class="em2">'
            case "wave": return '<span class="em3">'
        }
        
    } else if (tokens[idx].nesting === -1) {
        return "</span>"
    }
}