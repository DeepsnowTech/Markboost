
const emphasis = require("./emphasis")
module.exports = function markboost_inline_plugin(md, options) {

    options = options || {};
    
    md.inline.ruler.before('emphasis', "mb_emphasis", emphasis.tokenize );
    md.inline.ruler2.before('emphasis', "mb_emphasis", emphasis.postProcess );
    md.inline.ruler.disable('emphasis')
    md.inline.ruler2.disable('emphasis')
    md.renderer.rules['underline_open'] = emphasis.renderUnderline;
    md.renderer.rules['underline_close'] = emphasis.renderUnderline;

};

