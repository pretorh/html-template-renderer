var fsutils = require("./fsutils");
var contextBuilder = require("./contextBuilder");
var fs = require("fs");
var Handlebars = require("handlebars");

module.exports.renderAndSave = renderAndSave;
module.exports.Renderer = Renderer;

function renderAndSave(options) {
    var renderer = new Renderer(options);
    var files = fsutils.filelist(options.templateDir, "html");
    var rootContext = renderer.rootContext;

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

function Renderer(options) {
    var self = this;
    self.options = options;
    self.rootContext = {};

    function init() {
        var contextFiles = fsutils.filelist(options.contextDir, "json");
        self.rootContext = contextBuilder.build(options.contextDir, contextFiles);
    }
    init();
}

Renderer.prototype.render = function(file) {
    contextBuilder.ensureObjectPathForFile(this.rootContext, file);

    var html = fs.readFileSync(this.options.templateDir + file).toString();
    html = contextBuilder.wrapInWithBasedOnFileName(file, html);
    var template = Handlebars.compile(html);
    var output = template(this.rootContext);

    return {
        inputFile: file,
        outputFile: this.options.dist + file,
        renderedContent: output,
    };
};
