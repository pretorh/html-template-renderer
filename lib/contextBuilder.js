var fs = require("fs");

module.exports.build = build;
module.exports.wrapInWithBasedOnFileName = wrapInWithBasedOnFileName;
module.exports.ensureObjectPathForFile = ensureObjectPathForFile;

function build(rootPath, files) {
    var result = {};
    files.forEach(function(file) {
        var name = file.match("(.+?)\.json$")[1];
        appendFileToContext(rootPath + file, name, result);
    });
    return result;
}

function wrapInWithBasedOnFileName(filename, inner) {
    var name = getObjectPathForFile(filename);
    return "{{#with " + name + "}}" +
        inner +
        "{{/with}}";
}

function ensureObjectPathForFile(object, filename) {
    var path = getObjectPathForFile(filename);
    path.split(".").forEach(function(name) {
        object[name] = object[name] || {};
        object = object[name];
    });
}

function getObjectPathForFile(filename) {
    return filename
        .replace(/\.html$/, "")
        .replace(/\//g, ".");
}

function appendFileToContext(fullpath, name, object) {
    var data = fs.readFileSync(fullpath).toString();
    var json = JSON.parse(data);
    setObject(object, json, name);
}

function setObject(onto, object, path) {
    var paths = path.split("/");
    if (paths.length > 1) {
        var name = paths[0];
        onto[name] = onto[name] || {};
        return setObject(onto[name], object, paths.slice(1).join("/"));
    }
    onto[path] = object;
}
