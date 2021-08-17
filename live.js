var watch = require('node-watch');
var MarkdownIt = require('markdown-it')
var md = new MarkdownIt().use(require('./lib/container/index.js')).use(require('./lib/citation')).disable(['code', 'fence', 'blockquote']);
const fs = require("fs");
const { writeClosed } = require('./lib/renderer.js');
var sass = require('sass');

const sassPath = './style/markboost.sass'
const mdPath = './live.md'
compileMd(null, mdPath)
compileSass(null, null)

watch(mdPath, { recursive: true }, compileMd);
watch(sassPath, { recursive: true }, compileSass)

function compileSass(evt, name) {
    sass.render({ file: sassPath }, function (err, result) {
        if (result) {
            let css = String(result.css)
            fs.writeFileSync("./public/markboost.css", css)
            console.log('%s compiled.', name);
        } else {
            console.log('%s fail compile.', name);
            if (err) {
                console.log(err)
            }
        }
    });
}

function compileMd(evt, name) {
    console.log('%s compiled.', name);
    let liveInput = fs.readFileSync(name, "utf-8")
    //console.log(liveInput)
    var result = md.render(liveInput)
    let head = [writeClosed("link", { rel: "stylesheet", type: "text/css", href: "./markboost.css" }), `<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id = "MathJax-script" async src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" >
    </script>`]
    let html = ["<html>", "<head>"].concat(head).concat(["</head><body><article lang=en>", result, "</article></body></html>"])
    fs.writeFileSync("./public/" + name + ".html", html.join(""))
}