var fs = require("fs");

module.exports.build = build;
module.exports.wrapInWithBaseOnFileName = wrapInWithBaseOnFileName;

function build(rootPath, files) {
    var result = {};
    files.forEach(function(file) {
        var name = file.match("(.+?)\.json$")[1];
        appendFileToContext(rootPath + file, name, result);
    });
    return result;
}

function wrapInWithBaseOnFileName(filename, inner) {
    var name = filename.replace(/\.html$/, "");
    return "{{#with " + name + "}}" +
        inner +
        "{{/with}}";
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
