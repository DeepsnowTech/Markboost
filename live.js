var watch = require('node-watch');
var MarkdownIt = require('markdown-it')
var md = new MarkdownIt().use(require('./lib/container/index.js')).use(require('./lib/citation')).disable(['code', 'fence', 'blockquote']);
const fs = require("fs");
const { writeClosed } = require('./lib/helper.js');

watch('./live.md', { recursive: true }, function (evt, name) {
    console.log('%s changed.', name);
    let liveInput = fs.readFileSync(name,"utf-8")
    //console.log(liveInput)
    var result = md.render(liveInput)

    let head = [writeClosed("link", { rel: "stylesheet", type: "text/css", href: "./markboost.css" }), `<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id = "MathJax-script" async src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" >
</script>`]
    let html = ["<html>", "<head>"].concat(head).concat(["</head><body><div class=\"main\">", result, "</div></body></html>"])
    fs.writeFileSync("./public/"+name+".html", html.join(""))
});