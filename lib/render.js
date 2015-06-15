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
    self.nested = {};
    self.startWithRegEx = new RegExp("^" + options.templateDir);

    Handlebars.registerHelper("nested", function(context, options) {
        var name = options.hash.name;
        var template = contextBuilder.getValueByFieldPath(self.nested, name);
        return template(context);
    });
    function init() {
        var contextFiles = fsutils.filelist(options.contextDir, "json");
        self.rootContext = contextBuilder.build(options.contextDir, contextFiles);
        initNested();
    }
    function initNested() {
        var nestedFiles = fsutils.filelist(options.nestedDir, "html");
        nestedFiles.forEach(function(nestedFile) {
            var last = contextBuilder.ensureObjectPathForFile(self.nested, nestedFile);
            var html = fs.readFileSync(options.nestedDir + nestedFile).toString();
            last.object[last.name] = Handlebars.compile(html);
        });
    }
    init();
};
module.exports.Renderer = Renderer;

Renderer.prototype.render = function(file) {
    if (this.startWithRegEx.test(file)) {
        file = file.substr(this.options.templateDir.length);
    }
    contextBuilder.ensureObjectPathForFile(this.rootContext, file);

    return {
        inputFile: file,
        outputFile: this.options.dist + file,
        renderedContent: renderFile(file, this.rootContext, this.options),
    };
};

function renderFile(file, context, options) {
    var html = fs.readFileSync(options.templateDir + file).toString();
    html = contextBuilder.wrapInWithBasedOnFileName(file, html);
    var template = Handlebars.compile(html);
    return template(context);
}
