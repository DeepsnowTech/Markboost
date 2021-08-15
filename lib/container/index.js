'use strict';

const getContainerParser = require('./parser')
const tokenizeConfig = require('./config/tokenizer')
const tokenizeSpace = require('./space/tokenizer')

module.exports = function container_plugin(md, name, options) {

  options = options || {};

  // Space container
  let spaceParser = getContainerParser("=", 3, "space", tokenizeSpace)
  md.block.ruler.before('fence', 'space', spaceParser, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  });
  let spaceRender = require('./space/renderer').render
  md.renderer.rules['space_open'] = spaceRender;
  md.renderer.rules['space_close'] = spaceRender;

  // Config container
  let configParser = getContainerParser("-", 3, "config", tokenizeConfig)
  md.block.ruler.after('space', 'config', configParser, {
    alt: ['paragraph', 'reference', 'list']
  });
  let configRender = require('./config/renderer').render
  md.renderer.rules['config_container'] = configRender;

  // Warning renderer
  md.renderer.rules['parse_warning'] = renderWarning;


  // Modify the render function !! Important !!
  md.render = function (src, env) {
    env = env || {};
    env = Object.assign({
      idNames: {},
      counter: {},
      citedKeys: []
    }, env)
    let tokens = md.parse(src, env)

    return md.renderer.render(tokens, md.options, env);
  };

};

function renderWarning(tokens, idx, _options, env, slf) {
  return '<div class="warning"> \n' + tokens[idx].info + '\n</div>\n'
}