var fs = require("fs");

module.exports.filelist = filelist;

function filelist(path, extention) {
    var files = fs.readdirSync(path);
    var regex = new RegExp("." + extention + "$");
    files = files.filter(function(file) {
        return regex.test(file);
    });
    return files;
}
