const watch = require('node-watch');
const fs = require("fs");
const sass = require('sass');

const mb = require('./lib/index')
const { writeClosed } = require('./lib/renderer.js');

var argv = require('minimist')(process.argv.slice(2));
console.log(argv,)

var liveSetting = {
    src: "./test/test.md",
    output: "./test/",
    style: './style/markboost.sass'
}

Object.assign(liveSetting,argv)

compileMd(null, liveSetting.src)
compileSass(null, liveSetting.style)

watch(liveSetting.src, { recursive: true }, compileMd);
watch(liveSetting.style, { recursive: true }, compileSass)


function compileSass(evt, name) {
    sass.render({ file: name }, function (err, result) {
        if (result) {
            let css = String(result.css)
            fs.writeFileSync(liveSetting.output+"markboost.css", css)
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
    
    var result = mb.render(liveInput)
    let head = [writeClosed("link", { rel: "stylesheet", type: "text/css", href: "./markboost.css" }), `<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id = "MathJax-script" async src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" >
    </script>`]
    let html = ["<html>", "<head>"].concat(head).concat(["</head><body><article lang=en>", result, "</article></body></html>"])

    let fileName = name.split("/").pop().replace(/\.md/,".html")
    fs.writeFileSync(liveSetting.output+"/"+fileName, html.join(""))
}