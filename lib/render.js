var fsutils = require("./fsutils");
var fs = require("fs");

module.exports = render;

function render(options) {
    fsutils.ensureDirExists(options.dist);
    var files = fsutils.filelist(options.templateDir, "html");

    files.forEach(renderFile);

    function renderFile(file) {
        var html = fs.readFileSync(options.templateDir + file).toString();
        fs.writeFileSync(options.dist + file);
    }
}
