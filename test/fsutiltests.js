var assert = require("assert");

var fsutils = require("../lib/fsutils");

describe("fs utils", function() {
    describe("file list", function() {
        it("returns array of file names", function() {
            var files = fsutils.filelist(__dirname + "/../sample/www", "");
            assert.notStrictEqual(undefined, files);
            assert.equal("Array", files.constructor.name);
            assert.notEqual(-1, files.indexOf("index.html"));
        });
    });
});
