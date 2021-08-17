const RJSON = require('relaxed-json')

function parseTagNameAttr(str) {

    let infoTexts = str.split("{", 2);
    let tagName = infoTexts[0].trim()
    let attrs = {}


    if (infoTexts[1]) {
        let rjson_src = "{" + infoTexts[1]
        try {
            attrs = RJSON.parse(rjson_src, { warnings: true })
        } catch (error) {
            return { tagName: tagName, attrs: {error:error.message} }
        }
    }

    return { tagName: tagName, attrs: attrs }
}

module.exports.parseTagNameAttr = parseTagNameAttr