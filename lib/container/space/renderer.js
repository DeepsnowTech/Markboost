
const { renderAttr, writeElement, writeOpen, writeClose, writeClosed } = require("../helper")
let rules = {
    Figure: function (tokens, idx, _options, env, slf) {
        if (tokens[idx].nesting === 1) {
            // opening tag
            return writeOpen('div', { class: "figure" })+
            writeClosed('image', tokens[idx].info)

        } else {
            // closing tag
            return '</div>\n';
        }
    },
    Author: function (tokens, idx, _options, env, slf) {
        if (tokens[idx].nesting === 1) {
            // opening tag
            return '<p>\n' + 'Author:' + env.author + "\n"

        } else {
            // closing tag
            return '</p>\n';
        }
    },
    Quote: function (tokens, idx, _options, env, slf) {
        if (tokens[idx].nesting === 1) {
            // opening tag
            return writeOpen("blockquote", tokens[idx].info)

        } else {
            // closing tag
            return writeClose("blockquote");
        }
    },
    CiteList: function (tokens, idx, _options, env, slf) {
        if (tokens[idx].nesting === 1) {
            // opening tag
            let resList = ['<ol class="citation-list">\n']
            for (let key of env.citedKeys) {
                resList.push(writeElement("li", { id: "cite-def-" + key, class: "cite-def" }, env.bibtexJSON[key].entryTags.title))
            }
            return resList.join("")

        } else {
            // closing tag
            return '</ol>\n';
        }
    }
    ,
    "": function (tokens, idx, _options, env, slf) {
        if (tokens[idx].nesting === 1) {
            // opening tag
            return '<div>\n'

        } else {
            // closing tag
            return '</div>\n';
        }
    }
}




const { getContainerRenderer } = require("../helper")
module.exports = getContainerRenderer(rules)