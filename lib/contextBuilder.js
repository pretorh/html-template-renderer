var fs = require("fs");

module.exports.build = build;

function build(rootPath, files) {
    var result = {};
    files.forEach(function(file) {
        var name = file.match("(.+?)\.json$")[1];
        appendFileToContext(rootPath + file, name, result);
    });
    return result;
}

function appendFileToContext(fullpath, name, object) {
    var data = fs.readFileSync(fullpath).toString();
    var json = JSON.parse(data);
    setObject(object, json, name);
}

function setObject(onto, object, path) {
    onto[path] = object;
}
