"use strict";

var MarkdownIt = require('markdown-it')

var md = new MarkdownIt().use(require('../plugins/container/index.js'), 'space').use(require('../plugins/citation/citation'), 'citation').disable(['code', 'fence', 'blockquote']);

var result = md.render(`
---
root: 123
author: Zijian Zhang
bibtex: ./public/test.bib
---


--- Equation {id:equ-mc2}
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

`, )
const fs = require("fs")
console.log(result)
fs.writeFileSync("./public/index.html",result)