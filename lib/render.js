var fsutils = require("./fsutils");
var contextBuilder = require("./contextBuilder");
var fs = require("fs");
var Handlebars = require("handlebars");

module.exports = render;

function render(options) {
    var files = fsutils.filelist(options.templateDir, "html");
    var contextFiles = fsutils.filelist(options.contextDir, "json");
    var rootContext = contextBuilder.build(options.contextDir, contextFiles);

    files.forEach(ensureObjectPaths);
    files = files.map(renderFile);
    files.forEach(save);

    function ensureObjectPaths(file) {
        contextBuilder.ensureObjectPathForFile(rootContext, file);
    }

    function renderFile(file) {
        var html = fs.readFileSync(options.templateDir + file).toString();
        html = contextBuilder.wrapInWithBasedOnFileName(file, html);
        var template = Handlebars.compile(html);
        var output = template(rootContext);
        return {
            file: file,
            rendered: output,
            outputFile: options.dist + file,
        };
    }

    function save(file) {
        fsutils.ensureDirForFileExists(file.outputFile);
        fs.writeFileSync(file.outputFile, file.rendered);
    }
}
