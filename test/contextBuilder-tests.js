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

    describe("ensureObjectPathForFile", function() {
        it("set an empty object", function() {
            var o = {};
            contextBuilder.ensureObjectPathForFile(o, "index.html");
            assert.notStrictEqual(undefined, o.index);
        });

        it("does not overwrite", function() {
            var o = { index: { a: 1 } };
            contextBuilder.ensureObjectPathForFile(o, "index.html");
            assert.equal(1, o.index.a);
        });

        it("sets nested paths", function() {
            var o = {};
            contextBuilder.ensureObjectPathForFile(o, "q/w/e/index.html");
            assert.notStrictEqual(undefined, o.q);
            assert.notStrictEqual(undefined, o.q.w);
            assert.notStrictEqual(undefined, o.q.w.e);
            assert.notStrictEqual(undefined, o.q.w.e.index);
        });

        it("returns the last object's parent", function() {
            var o = {};
            var result = contextBuilder.ensureObjectPathForFile(o, "q/w/e/index.html");
            assert.notStrictEqual(undefined, result.object);
            assert.notStrictEqual(undefined, result.object.index);
        });

        it("returns the last name in the path", function() {
            var o = {};
            var result = contextBuilder.ensureObjectPathForFile(o, "q/w/e/index.html");
            assert.equal("index", result.name);
        });
    });

    describe("getObjectPathForFile", function() {
        it("replaces extention", function() {
            assert.equal("index", contextBuilder.getObjectPathForFile("index.html"));
        });

        it("replaces path separators with dots", function() {
            assert.equal("sub.more", contextBuilder.getObjectPathForFile("sub/more"));
        });
    });

    describe("getValueByFieldPath", function() {
        it("returns the value at the path", function() {
            var o = { index: 1 };
            var value = contextBuilder.getValueByFieldPath(o, "index");
            assert.equal(1, value);
        });

        it("returns nested fields", function() {
            var o = { sub: { key: 2 } };
            var value = contextBuilder.getValueByFieldPath(o, "sub.key");
            assert.equal(2, value);
        });
    });
});
