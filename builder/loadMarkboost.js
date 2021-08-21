
const { writeClosed } = require('../lib/renderer');
const path = require('path');
const mb = require('../lib/index')
const fs = require("fs");
const { createOutputPath } = require('./helper');

module.exports = function loadMarkboost(filepath, basePath, outputBase) {
    
    outputPath = createOutputPath(filepath, basePath, outputBase, "html")

    let input = fs.readFileSync(filepath, "utf-8")
    let env = { basePath: basePath }
    var result = mb.render(input, env)

    let head = [writeClosed("link", { rel: "stylesheet", type: "text/css", href: "./markboost.css" }), renderMathJaxHead(env),
        `<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id = "MathJax-script" async src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" >
    </script>`
    ]

    let html = ["<html>", "<head>"].concat(head).concat(["</head><body>", renderHeader(env), "<article lang=en>", result, "</article></body></html>"])

    fs.writeFileSync(outputPath, html.join(""))
}

function renderHeader(env) {
    let res = ["<header>"]

    res.push(env.title)

    res.push("</header>")
    return res.join("")
}

function renderMathJaxHead(env) {
    let rendered = ["<script>", "MathJax = {"]
    rendered.push("tex: {inlineMath: [['$', '$']],")
    rendered.push(renderMathJaxMacroConfig(env))
    rendered.push("},")
    rendered.push("svg: {fontCache: 'global'},")
    rendered.push("};</script>")
    return rendered.join("")
}

function renderMathJaxMacroConfig(env) {

    if (!env.mathMacros) return ""
    let res = ["macros:{"]

    for (let key in env.mathMacros) {
        res.push(key + ":")
        res.push(JSON.stringify(env.mathMacros[key]))
        res.push(",\n")
    }

    res.push("}")
    return res.join("")
}