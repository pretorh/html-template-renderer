var fsutils = require("./fsutils");
var contextBuilder = require("./contextBuilder");
var fs = require("fs");
var Handlebars = require("handlebars");

module.exports = render;

function render(options) {
    var files = fsutils.filelist(options.templateDir, "html");
    var contextFiles = fsutils.filelist(options.contextDir, "json");
    var rootContext = contextBuilder.build(options.contextDir, contextFiles);

    files.forEach(renderFile);

    function renderFile(file) {
        var html = fs.readFileSync(options.templateDir + file).toString();
        var template = Handlebars.compile(html);
        var output = template(rootContext);

        var outputFile = options.dist + file;
        fsutils.ensureDirForFileExists(outputFile);
        fs.writeFileSync(outputFile, output);
    }
}
