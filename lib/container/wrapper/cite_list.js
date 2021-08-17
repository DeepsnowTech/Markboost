const { writeElement, writeOpen, writeEnd } = require("../../renderer")

function renderCiteList(tokens, idx, _options, env, slf) {
    // opening tag
    let res = []
    res.push(writeElement("h2", { class: "citation-list-heading" }, "Reference"))
    res.push(writeOpen("ol", { class: "citation-list" }))
    for (let key of env.citedKeys) {
        let entry = env.bibJSON[key].entryTags
        res.push(writeElement("li", { id: "cite-def-" + key, class: "cite-def" }, [getDisplayName(entry.author),entry.title,entry.journal+" "+entry.volume,entry.number,"("+entry.year+")"].join(", ")))
        console.log(entry)
    }
    res.push(writeEnd("ol"))
    return res.join("")
}

function getDisplayName(authorStr) {
    let strSplit = authorStr.split("and")
    let authorList = []
    for (let term of strSplit) {
        let [last, first] = term.split(",")
        let abbrFirst = []
        for(let p of first.trim().split("-")){
            abbrFirst.push(p[0]+".")
        }
        authorList.push(abbrFirst.join("-")+" "+last.trim())
    }
    return authorList.join(", ")
}

module.exports = {
    attrs: {
        innerType: 0
    },
    render: renderCiteList
}