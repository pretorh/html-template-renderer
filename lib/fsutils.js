var fs = require("fs");

module.exports.filelist = filelist;

function filelist(path, extention) {
    var regex = new RegExp("." + extention + "$");
    var files = readdir("", path, regex);
    return files;
}

function readdir(root, path, regex) {
    var dir = root + path + "/";
    var files = fs.readdirSync(dir);

    return files
        .filter(function(file) {
            return regex.test(file);
        });
}
