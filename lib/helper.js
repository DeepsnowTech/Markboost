"use strict";

module.exports.getContainerRenderer = function (rules) {
    const render = function (tokens, idx, _options, env, slf) {
        let tagName = tokens[idx].tag
        // If tag name matches a tagName in rules
        if (rules[tagName]) {
            return rules[tagName].render(tokens, idx, _options, env, slf)
        } else {
            if (tagName[0].charCodeAt(0) < 90 /* if Uppercase*/) {
                let msg = ["Unknow container name \"", tagName, "\"\n"].join("")
                return warningRender(msg, tokens[idx].nesting)
            } else {
                return simpleRender(tagName, tokens[idx].attr, tokens[idx].nesting)
            }
        }
    }
    return render
}

function renderAttr(attrs) {
    if (!attrs) return ""
    let res = []
    let keys = Object.keys(attrs)
    let values = Object.values(attrs)

    for (let i = 0; i < keys.length; i++) {
        res.push(" ")
        res.push(keys[i])
        res.push("=\"")
        res.push(values[i])
        res.push("\"")
    }
    return res.join("")
}
module.exports.renderAttr = renderAttr


function writeBlock(tag, attr, content) {
    return ["<", tag, attr ? renderAttr(attr) : "", ">\n", content, "</", tag, ">\n"].join("")
}
module.exports.writeElement = writeBlock

function writeInline(tag, attr, content) {
    return ["<", tag, attr ? renderAttr(attr) : "", ">", content, "</", tag, ">"].join("")
}
module.exports.writeInline = writeInline

function writeClosed(tag, attr, content) {
    return ["<", tag, attr ? renderAttr(attr) : "", "/>"].join("")
}
module.exports.writeClosed = writeClosed

function writeOpen(tag, attr) {
    return ["<", tag, attr ? renderAttr(attr) : "", ">\n"].join("")
}
module.exports.writeOpen = writeOpen
function writeClose(tag) {
    return ["</", tag, ">\n"].join("")
}
module.exports.writeClose = writeClose

function writeWarning(msg) {
    return ["<div class=\"warning\">\n", msg, "</div>\n"].join("")
}

module.exports.writeWarning = writeWarning
function writeInlineWarning(msg) {
    return ["<span class=\"warning-inline\">", msg, "</span>"].join("")
}
module.exports.writeInlineWarning = writeInlineWarning

function warningRender(msg, nesting) {
    let res = []
    if (nesting !== -1) {
        // opening tag
        res = res.concat(["<div class=\"warning\">\n", msg].join(""))
    }
    if (nesting !== 1) {
        // closing tag
        res = res.concat(['</div>\n'])
    }
    return res.join("")
}

function simpleRender(tagName, attrs, nesting) {
    let res = []
    if (nesting !== -1) {
        // opening tag
        res = res.concat(['<', tagName, renderAttr(attrs), '>\n'])
    }
    if (nesting !== 1) {
        // closing tag
        res = res.concat(['</', tagName, '>\n'])
    }
    return res.join("")
}