var assert = require("assert");

var fsutils = require("../lib/fsutils");

describe("fsutils", function() {
    describe("file list", function() {
        it("returns array of file names", function() {
            var files = fsutils.filelist(__dirname + "/../sample/www", "");
            assert.notStrictEqual(undefined, files);
            assert.equal("Array", files.constructor.name);
            assert.notEqual(-1, files.indexOf("index.html"));
        });

        it("return only for given extension", function() {
            var files = fsutils.filelist(__dirname + "/../sample/www", "html");
            assert.equal(-1, files.indexOf("favicon.fake"), "found, but expected not to find");
            assert.notEqual(-1, files.indexOf("index.html"), "not found");
        });

        it("returns files in subdirectories", function() {
            var files = fsutils.filelist(__dirname + "/../sample/www", "html");
            assert.notEqual(-1, files.indexOf("sub/about.html"), "not found");
        });
    });
});
