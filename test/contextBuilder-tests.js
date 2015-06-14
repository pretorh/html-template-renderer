var assert = require("assert");

var contextBuilder = require("../lib/contextBuilder");

describe("contextBuilder", function() {
    it("object fields are the file names", function() {
        var o = contextBuilder.build(__dirname + "/../sample/context/", ["index.json"]);
        assert.notStrictEqual(undefined, o.index);
    });
});
