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
});
