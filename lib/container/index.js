'use strict';

const getContainerParser = require('./parser')

const moduleCommand = require('./command/index')
const moduleWrapper = require('./wrapper/index')

module.exports = function container_plugin(md, options) {

  options = options || {};

  // Wrapper container
  let wrapperParser = getContainerParser("=", 3, "wrapper", moduleWrapper.tokenize)
  md.block.ruler.before('fence', 'wrapper', wrapperParser, {
    alt: ['paragraph']
  });
  let wrapperRender = moduleWrapper.render
  md.renderer.rules['wrapper_open'] = wrapperRender;
  md.renderer.rules['wrapper_close'] = wrapperRender;
  md.renderer.rules['one_line_command'] = wrapperRender;

  // Command container
  let commandParser = getContainerParser("-", 3, "command", moduleCommand.tokenize)
  md.block.ruler.after('wrapper', 'command', commandParser, {
    alt: ['paragraph', 'list']
  });
  let commandRender = moduleCommand.render
  md.renderer.rules['command_container'] = commandRender;

  // Warning renderer
  md.renderer.rules['parse_warning'] = renderWarning;

  md.disable(["lheading",'code', 'fence', 'blockquote', 'image'])

  // Modify the render function !! Important !!
  md.render = function (src, _env, moreResult) {
    _env = _env || {}
    let env = Object.assign({
      basePath: "",
      idNames: {},
      counter: {},   // Array or Number
      citedKeys: [],
      __cache__:{
        labeler:{}
      }
    }, _env)
    let tokens = md.parse(src, env)
    let rendered = md.renderer.render(tokens, md.options, env);
    Object.assign(_env, env)
    return rendered
  };

};

function renderWarning(tokens, idx, _options, env, slf) {
  return '<div class="warning"> \n' + tokens[idx].info + '\n</div>\n'
}