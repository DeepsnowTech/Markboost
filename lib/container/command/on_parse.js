const yaml = require('js-yaml')
const parseDict = require('../../parse_dict')
const fs = require('fs')
const path = require('path');
function beforeTokenize(state, params, content) {

    if (params.src) {
        try {
            let extensionName = params.src.substring(params.src.lastIndexOf("."), params.src.length)
            switch (extensionName) {
                case ".toml": params.lang = "toml"; break;
                case ".yml": params.lang = "yaml"; break;
                case ".yaml": params.lang = "yaml"; break;
                case ".json": params.lang = "json"; break;
                case ".js": params.lang = "json"; break;
                default: {
                    let token = state.push('parse_warning', 'div', 0);
                    token.block = true;
                    token.info = "Not supported extension name \"" + extensionName + "\"";
                    return
                }
            }

            content = fs.readFileSync(path.resolve(state.env.basePath, params.src), 'utf-8')

        } catch (error) {
            let token = state.push('parse_warning', 'div', 0);
            token.block = true;
            token.info = "Fail to import \"" + params.src + "\"";
            return
        }
    }

    if (!params.lang) params.lang = state.env.default_config_lang || "yaml"
    let config = parseDict(content, params.lang)
    if (!(typeof config == String)) {
        Object.assign(state.env, config)
    }
    else {
        let token = state.push('parse_warning', 'div', 0);
        token.block = true;
        token.info = config;
    }
}

function render(tokens, idx, _options, env, slf) {
    return ""
}

module.exports = {
    attrs: {},
    beforeTokenize: beforeTokenize,
    render: render
}

