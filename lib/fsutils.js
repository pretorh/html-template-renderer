var fs = require("fs");

module.exports.filelist = filelist;
module.exports.ensureDirExists = ensureDirExists;
module.exports.ensureDirForFileExists = ensureDirForFileExists;
module.exports.getWellFormedPath = getWellFormedPath;

function filelist(path, extention) {
    var regex = new RegExp("." + extention + "$");
    var files = readdir(path + "/", "", regex);
    return files;
}

function ensureDirExists(path) {
    if (fs.existsSync(path) && fs.statSync(path).isDirectory())
        return;
    fs.mkdirSync(path);
}

function ensureDirForFileExists(file) {
    var match = file.match(/^(.+\/)[^\/]+$/);
    var dir = match[1];
    ensureDirExists(dir);
}

function getWellFormedPath(dir) {
    if (dir.slice(-1) != "/")
        dir += "/";
    return dir;
}

function readdir(root, path, regex) {
    var dir = root + path;
    var entries = getEntries(dir);
    var files = entries.files;
    var subfiles = getFilesInSubDirs(dir, entries.dirs, regex);

    return files
        .filter(function(file) {
            return regex.test(file);
        })
        .map(function(file) {
            return path + file;
        })
        .concat(subfiles);
}

function getFilesInSubDirs(dir, dirs, regex) {
    return dirs.reduce(function(previous, entry) {
        var filesInSubDir = readdir(dir, entry + "/", regex);
        return previous.concat(filesInSubDir);
    }, []);
}

function getEntries(dir) {
    var entries = fs.readdirSync(dir);
    var result = { dirs: [], files: [] };
    entries.forEach(function(entry) {
        var stat = fs.statSync(dir + entry);
        if (stat.isDirectory()) {
            result.dirs.push(entry);
        } else if (stat.isFile()) {
            result.files.push(entry);
        }
    });
    return result;
}
