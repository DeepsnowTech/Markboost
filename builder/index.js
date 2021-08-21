const watch = require('node-watch');

var argv = require('minimist')(process.argv.slice(2));

var settings = {
    src: "./test/",
    style: './style/'
}

Object.assign(settings, argv)

if (!settings.output) {
    settings.output = settings.src
}

loaderMap = {
    ".sass": require("./loadSass"),
    ".md": require("./loadMarkboost"),
    ".jpg": require("./loadResource"),
    ".png": require("./loadResource"),
    ".gif": require("./loadResource")
}

console.log(settings)

function load(evt, name) {
    if (evt == 'remove') {
        return
    }
    let nameEnd = name.length;
    let filename = name.slice(name.lastIndexOf("/"), nameEnd)
    let extName = name.slice(name.lastIndexOf("."), nameEnd)
    if (filename.slice(0, 2) === "__") return
    let fileLoader = loaderMap[extName]
    if (!fileLoader) return
    fileLoader(name, settings.src, settings.output)
    console.log(name + " processed")
}

const iterateFiles = require('node-dir').files;

function compileAll(src) {
    iterateFiles(src, function (err, files) {
        if (err) throw err;
        files.forEach(function (filepath) {
            load("init", filepath)
        })
    });
}

function compileStyle(evt, name) {
    loaderMap[".sass"](settings.style + "/markboost.sass", settings.src, null, settings.output + "/markboost.css")
    console.log(name + " processed")
}

compileAll(settings.src)
compileStyle("init", settings.style)
watch(settings.src, { recursive: true }, load);
watch(settings.style, { recursive: true }, compileStyle);