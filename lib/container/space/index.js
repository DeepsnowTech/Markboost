const { renderAttr, writeElement, writeOpen, writeClose, writeClosed } = require("../../helper")
const { getLabellingBeforeTokenize } = require("../tokenizer");

const rules = {
    Figure: {
        render: function (tokens, idx, _options, env, slf) {
            if (tokens[idx].nesting === 1) {
                // opening tag
                let id = tokens[idx].attr.id
                const tag = env.idNames[id].index.slice().reverse().join(".")
                return writeOpen('div', { class: "figure", id:id}) +
                    writeClosed('image', tokens[idx].attr) + writeOpen('div', { class: "caption", begining: "Figure " + tag+"." })
            } else {
                // closing tag
                return '<div/></div>\n';
            }
        },
        beforeTokenize: getLabellingBeforeTokenize("Figure", "Fig."),
    },
    Author: {
        render: function (tokens, idx, _options, env, slf) {
            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<p>\n' + 'Author:' + env.author + "\n"

            } else {
                // closing tag
                return '</p>\n';
            }
        }
    },
    Quote: {
        render: function (tokens, idx, _options, env, slf) {
            if (tokens[idx].nesting === 1) {
                // opening tag
                return writeOpen("blockquote", tokens[idx].attr)

            } else {
                // closing tag
                return writeClose("blockquote");
            }
        }
    },
    CiteList: {
        render: function (tokens, idx, _options, env, slf) {
            if (tokens[idx].nesting === 1) {
                // opening tag
                let resList = []
                resList.push(writeElement("h2", { class: "citation-list-heading" }, "Reference"))
                resList.push(writeOpen("ol", { class: "citation-list" }))
                for (let key of env.citedKeys) {
                    resList.push(writeElement("li", { id: "cite-def-" + key, class: "cite-def" }, env.bibJSON[key].entryTags.title))
                }
                return resList.join("")
            } else {
                // closing tag
                return writeClose("ol");
            }
        }
    }
    ,
    "": {
        render: function (tokens, idx, _options, env, slf) {
            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<div>\n'

            } else {
                // closing tag
                return '</div>\n';
            }
        }
    }
}

const { getContainerRenderer } = require("../../helper");
const { getTokenizer } = require("./helper");
module.exports.render = getContainerRenderer(rules)
module.exports.tokenize = getTokenizer(rules)
