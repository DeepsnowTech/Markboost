const sass = require('sass');
const { createOutputPath } = require('./helper');
const fs = require("fs");

module.exports = function loadSass(filepath, basePath, outputBase, outputPath) {
    if(!outputPath)
    outputPath = createOutputPath(filepath, basePath, outputBase, "css")
    
    sass.render({ file: filepath }, function (err, result) {
        if (result) {
            let css = String(result.css)
            fs.writeFileSync(outputPath, css)
        } else {
            console.log('%s fail compile.', filepath);
            if (err) {
                console.log(err)
            }
        }
    });

}