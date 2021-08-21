const { createOutputPath } = require('./helper');
const fs = require("fs");

module.exports = function loadResource(filepath, basePath, outputBase) {
    let outputPath = createOutputPath(filepath, basePath, outputBase)
    fs.rename(filepath, outputPath, function (err) {
        if (err) throw err
        //console.log('Successfully renamed - AKA moved!')
    })

}