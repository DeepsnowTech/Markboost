'use strict';

const getContainerParser = require('./parser')

const moduleConfig = require('./config/index')
const moduleSpace = require('./space/index')

module.exports = function container_plugin(md, options) {

  options = options || {};

  // Space container
  let spaceParser = getContainerParser("=", 3, "space", moduleSpace.tokenize)
  md.block.ruler.before('fence', 'space', spaceParser, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  });
  let spaceRender = moduleSpace.render
  md.renderer.rules['space_open'] = spaceRender;
  md.renderer.rules['space_close'] = spaceRender;

  // Config container
  let configParser = getContainerParser("-", 3, "config", moduleConfig.tokenize)
  md.block.ruler.after('space', 'config', configParser, {
    alt: ['paragraph', 'reference', 'list']
  });
  let configRender = moduleConfig.render
  md.renderer.rules['config_container'] = configRender;

  // Warning renderer
  md.renderer.rules['parse_warning'] = renderWarning;

  // Modify the render function !! Important !!
  md.render = function (src, env) {
    env = env || {};
    env = Object.assign({
      idNames: {},
      counter: {},   // Array or Number
      citedKeys: []
    }, env)
    let tokens = md.parse(src, env)

    return md.renderer.render(tokens, md.options, env);
  };

};

function renderWarning(tokens, idx, _options, env, slf) {
  return '<div class="warning"> \n' + tokens[idx].info + '\n</div>\n'
}