const yaml = require('js-yaml')
const toml = require('toml');
const rjson = require('relaxed-json')

function parseDict(raw, _lang) {
    let lang = _lang || "yaml"
    switch (lang) {
        case "toml": {
            try {
                return toml.parse(raw)
            }
            catch (error) {
                return "TOML Parsing error on line " + error.line + ", column " + error.column +
                    ": " + error.message
            }
        }
        case "yaml": {
            try {
                return yaml.load(raw)
            }
            catch (error) {
                return error.message
            }
        }
        case "json": {
            try {
                return rjson.parse(raw, { warnings: true })
            } catch (error) {
                return error.message
            }
        }
    }
}
module.exports = parseDict