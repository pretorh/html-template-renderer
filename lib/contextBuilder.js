var fs = require("fs");

module.exports.build = build;

function build(rootPath, files) {
    var result = {};
    files.forEach(function(file) {
        var name = file.match("(.+?)\.json$")[1];
        var data = fs.readFileSync(rootPath + file).toString();
        result[name] = JSON.parse(data);
    });
    return result;
}
