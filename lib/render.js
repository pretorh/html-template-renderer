var fsutils = require("./fsutils");
var contextBuilder = require("./contextBuilder");
var fs = require("fs");
var Handlebars = require("handlebars");

module.exports.renderAndSave = renderAndSave;
module.exports.Renderer = Renderer;

function renderAndSave(options) {
    var renderer = new Renderer(options);
    var files = fsutils.filelist(options.templateDir, "html");

    files = files.map(function(file) {
        return renderer.render(file);
    });
    files.forEach(save);

    function save(file) {
        fsutils.ensureDirForFileExists(file.outputFile);
        fs.writeFileSync(file.outputFile, file.renderedContent);
    }
}

var Renderer = function(options) {
    var self = this;
    self.options = options;
    self.rootContext = {};

    function init() {
        var contextFiles = fsutils.filelist(options.contextDir, "json");
        self.rootContext = contextBuilder.build(options.contextDir, contextFiles);
    }
    init();
};

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

module.exports.Renderer = Renderer;
