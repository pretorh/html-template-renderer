module.exports.build = build;

function build(rootPath, files) {
    var result = {};
    files.forEach(function(file) {
        var name = file.match("(.+?)\.json$")[1];
        result[name] = "";
    });
    return result;
}
