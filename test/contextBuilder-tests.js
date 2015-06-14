var assert = require("assert");

var contextBuilder = require("../lib/contextBuilder");

describe("contextBuilder", function() {
    describe("build", function() {
        it("object fields are the file names", function() {
            var o = contextBuilder.build(__dirname + "/../sample/context/", ["index.json"]);
            assert.notStrictEqual(undefined, o.index);
        });

        it("parse the json file", function() {
            var o = contextBuilder.build(__dirname + "/../sample/context/", ["index.json"]);
            assert.equal("John Doe", o.index.name);
        });

        it("maps files recursively in sub objects", function() {
            var o = contextBuilder.build(__dirname + "/../sample/context/", ["sub/more.json"]);
            assert.notStrictEqual(undefined, o.sub);
            assert.notStrictEqual(undefined, o.sub.more);
            assert.equal(1, o.sub.more.key);
        });
    });

    describe("wrapInWithBasedOnFileName", function() {
        it("returns handlebars wrapped text", function() {
            var file = "index.html";
            var inner = "text in middle";
            var result = contextBuilder.wrapInWithBasedOnFileName(file, inner);
            assert.equal(true, /^{{#with index/.test(result), "unexpected start: " + result);
            assert.equal(true, /}}text in middle{{/.test(result), "unexpected middle: " + result);
            assert.equal(true, /{{\/with}}$/.test(result), "unexpected end: " + result);
        });

        it("does not include the file's extention", function() {
            var file = "index.html";
            var result = contextBuilder.wrapInWithBasedOnFileName(file, "");
            assert.equal(false, /\.html/.test(result), "expected to not contain .html: " + result);
        });

        it("use . for path separator", function() {
            var file = "q/w/e/index.html";
            var result = contextBuilder.wrapInWithBasedOnFileName(file, "");
            assert.equal(true, /q\.w\.e\.index/.test(result), "expected path separator not found: " + result);
        });
    });
});
