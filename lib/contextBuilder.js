var fs = require("fs");

module.exports.build = build;
module.exports.wrapInWithBasedOnFileName = wrapInWithBasedOnFileName;
module.exports.ensureObjectPathForFile = ensureObjectPathForFile;
module.exports.getObjectPathForFile = getObjectPathForFile;
module.exports.getValueByFieldPath = getValueByFieldPath;

function build(rootPath, files) {
    var result = {};
    files.forEach(function(file) {
        appendFileToContext(rootPath + file, file, result);
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
    var last = {};
    path.split(".").forEach(function(name) {
        last = { object: object, name: name }
        object[name] = object[name] || {};
        object = object[name];
    });
    return last;
}

function getObjectPathForFile(filename) {
    return filename
        .replace(/\.(html|json)$/, "")
        .replace(/\//g, ".");
}

function getValueByFieldPath(object, fieldPath) {
    var result = object;
    fieldPath.split(".").forEach(function(field) {
        result = result[field];
    });
    return result;
}

function appendFileToContext(fullpath, name, object) {
    var data = fs.readFileSync(fullpath).toString();
    var json = JSON.parse(data);
    setObject(object, json, name);
}

function setObject(onto, object, path) {
    var last = ensureObjectPathForFile(onto, path);
    last.object[last.name] = object;
}
