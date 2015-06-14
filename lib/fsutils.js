var fs = require("fs");

module.exports.filelist = filelist;

function filelist(path, extention) {
    var files = fs.readdirSync(path);
    return files;
}
