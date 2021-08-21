const fs = require("fs");
const path = require("path");

module.exports.createOutputPath = function (filepath, basePath, outputBase, newExtName) {
    let relativePath = path.relative(basePath, filepath)
    let outputPath = path.resolve(outputBase, relativePath)
    if(newExtName) outputPath = outputPath.slice(0, outputPath.lastIndexOf(".")) + "." + newExtName
    fs.mkdir(outputPath.slice(0, outputPath.lastIndexOf("/")), { recursive: true }, (err) => {
        if (err) throw err;
    })
    return outputPath
}