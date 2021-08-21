const { renderAttr, writeElement, writeOpen, writeEnd, writeClosed } = require("../../renderer")
const { getLabeller } = require("../../tokenizer");

let rules = {
    "": {
        attrs: {
            innerType: 1
        },
        render: function (tokens, idx, _options, env, slf) {
            if (tokens[idx].nesting === 1) {
                // opening tag
                return writeOpen("div", tokens[idx].attrs)

            } else {
                // closing tag
                return '</div>\n';
            }
        }
    },
    Figure: {
        attrs: {
            innerType: -1
        },
        render: function (tokens, idx, _options, env, slf) {
            if (tokens[idx].nesting === 1) {
                // opening tag
                let id = tokens[idx].attrs.id
                const tag = env.idNames[id].index.slice().join(".")
                return writeOpen('figure', { class: "figure-box" }) +
                    writeClosed('image', tokens[idx].attrs) + writeOpen('figcaption', { class: "caption", beginning: "Figure " + tag + "." })
            } else {
                // closing tag
                return '</figcaption></figure>\n';
            }
        },
        beforeTokenize: getLabeller("Figure", "Fig."),
    },
    Author: require('./author'),
    Title: {
        attrs: {
            innerType: 0
        },
        render: function (tokens, idx, _options, env, slf) {
            return writeElement("h1", { class: "title" }, env.title)
        }
    },
    BoxQuote: {
        render: function (tokens, idx, _options, env, slf) {
            if (tokens[idx].nesting === 1) {
                // opening tag
                return writeOpen("div", { class: "box-quote" })

            } else {
                // closing tag
                return writeEnd("div");
            }
        }
    },
    CiteList: require("./cite_list"),
    ContentTable: require("./content_table"),
    Abstract: require("./abstract"),
    Equation: require("./equation"),
    Code: require("./code")
}

const getRemarkPlugin = require("./remarks");

const remarkRules = {
    Theorem: getRemarkPlugin("Theorem", "Thm."),
    Definition: getRemarkPlugin("Definition", "Def."),
    Proposition: getRemarkPlugin("Proposition", "Prop."),
    Lemma: getRemarkPlugin("Lemma", "Lemma"),
    Corollary: getRemarkPlugin("Corollary", "Corollary"),
    Property: getRemarkPlugin("Property", "Property"),
    Claim: getRemarkPlugin("Claim", "Claim"),
    Remark: getRemarkPlugin("Remark", "Remark"),
    Conjecture: getRemarkPlugin("Conjecture", "Conjecture"),
    Protocol: getRemarkPlugin("Protocol", "Protocol"),
    Algorithm: getRemarkPlugin("Algorithm", "Alg."),
    List: getRemarkPlugin("List", "List")
}

rules = Object.assign(rules, remarkRules)


// Set default attrs

for (let key in rules) {
    if (!rules[key].attrs) {
        rules[key].attrs = {
            innerType: 1 //block inner
        }
    }
}

const { getContainerRenderer } = require("../../renderer");
const { getTokenizer } = require("./tokenizer");
module.exports.render = getContainerRenderer(rules)
module.exports.tokenize = getTokenizer(rules)
