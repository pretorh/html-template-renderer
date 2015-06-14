var fsutils = require("./fsutils");
var fs = require("fs");

module.exports = render;

function render(options) {
    var files = fsutils.filelist(options.templateDir, "html");

    files.forEach(renderFile);

    function renderFile(file) {
        var html = fs.readFileSync(options.templateDir + file).toString();
        var output = html;

        var outputFile = options.dist + file;
        fsutils.ensureDirForFileExists(outputFile);
        fs.writeFileSync(outputFile, output);
    }
}
