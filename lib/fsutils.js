var fs = require("fs");

module.exports.filelist = filelist;
module.exports.ensureDirExists = ensureDirExists;

function filelist(path, extention) {
    var regex = new RegExp("." + extention + "$");
    var files = readdir(path + "/", "", regex);
    return files;
}

function ensureDirExists(path) {
    if (fs.existsSync(path))
        return;
    fs.mkdirSync(path);
}

function readdir(root, path, regex) {
    var dir = root + path;
    var files = [];
    var subfiles = [];
    var entries = fs.readdirSync(dir);
    entries.forEach(function(entry) {
        var stat = fs.statSync(root + path + "/" + entry);
        if (stat.isDirectory()) {
            subfiles = subfiles.concat(readdir(root + path, entry + "/", regex));
        } else if (stat.isFile()) {
            files.push(entry);
        }
    });

    return files
        .filter(function(file) {
            return regex.test(file);
        })
        .map(function(file) {
            return path + file;
        })
        .concat(subfiles);
}
