"use strict";

var MarkdownIt = require('markdown-it')

var md = new MarkdownIt().use(require('./lib/container/index.js')).use(require('./lib/citation')).disable(['code', 'fence', 'blockquote']);

let testInput = `
---
root: 123
author: Zijian Zhang
bibtex: ./public/test.bib
---

--- Equation
$$E=mc^2$$
---

--- Equation {id:one-one}
1+1=2
---

=== Author ===

# 12

=== Figure {src:"./TCard.jpg"} 
I am a figure
===

[#equ-mc2]

[@stair2021qforte] [@palao2001quantum]

=== Quote {id:quote-1}
123
===


[#one-one]

=== CiteList ===

`
let citeTest = `
---
bibtex: ./public/test.bib
---

See Ref.[@zhang2022]

[@stair2021qfrte] [@palao2001quantum]

[@stair2021qforte,palao2001quantum]

[@zhang2022,palao2001quntum,zhang2021,zhang2023]

=== CiteList ===
`

var result = md.render(testInput)
const fs = require("fs");
const { writeClosed } = require('./lib/helper.js');
console.log(result)

let head = [writeClosed("link", { rel: "stylesheet", type: "text/css", href: "./markboost.css" }), `<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id = "MathJax-script" async src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" >
</script>`]
let html = ["<html>", "<head>"].concat(head).concat(["</head><body><div class=\"main\">", result, "</div></body></html>"])
fs.writeFileSync("./public/index.html", html.join(""))