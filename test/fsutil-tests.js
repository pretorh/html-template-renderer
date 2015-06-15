var assert = require("assert");
var fs = require("fs");
var rimraf = require("rimraf");

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

    describe("ensureDirExists", function() {
        beforeEach(removeTempTestDir);

        it("can make a directory", function() {
            fsutils.ensureDirExists("test/made");
            var exists = fs.existsSync("test/made");
            assert.equal(true, exists);
        });

        it("does not fail if it already exists", function() {
            fsutils.ensureDirExists("test/made");
            fsutils.ensureDirExists("test/made");       // this should not fail
        });

        it("fails if the item is a file", function() {
            var errored = false;
            try {
                // this is a file, so should fail
                fsutils.ensureDirExists("index.js");
            } catch (e) {
                errored = true;
            }
            assert.equal(true, errored);
        });
    });

    describe("ensureDirForFileExists", function() {
        beforeEach(removeTempTestDir);

        it("makes the directory", function() {
            fsutils.ensureDirForFileExists("test/made/abc.json");
            var exists = fs.existsSync("test/made");
            assert.equal(true, exists);
        });
    });

    describe("getWellFormedPath", function() {
        it("returns path if well formed", function() {
            assert.equal("q/", fsutils.getWellFormedPath("q/"));
        });

        it("adds trailing slash", function() {
            assert.equal("q/", fsutils.getWellFormedPath("q"));
        });

        it("uses . if not defined", function() {
            assert.equal("./", fsutils.getWellFormedPath());
        });
    });

    function removeTempTestDir(done) {
        var exists = fs.existsSync("test/made");
        if (!exists)
            return done();
        rimraf("test/made", done);
    }
});
