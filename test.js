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
$$1+1$$
---

=== Author ===

# 12

=== Figure {src:"./hi.jpg"} 
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
const fs = require("fs")
console.log(result)
fs.writeFileSync("./public/index.html", ["<html>","<head></head><body>", result, "</body></html>"].join(""))