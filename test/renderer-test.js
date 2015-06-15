var assert = require("assert");
var render = require("../lib/render.js");

describe("render", function() {
    var PATH = __dirname + "/../sample/"
    var STATIC = PATH + "static/";
    var options = {
        templateDir: PATH + "www/",
        contextDir: PATH + "context/",
        dist: STATIC
    };

    var renderer;
    beforeEach(function() {
        renderer = new render.Renderer(options);
    });

    it("setup with the root context", function() {
        assert.notStrictEqual(undefined, renderer.rootContext);
        assert.equal("John Doe", renderer.rootContext.index.name);
        assert.equal(1, renderer.rootContext.sub.more.key);
    });

    describe("can render a file and returns", function() {
        var result;
        beforeEach(function() {
            result = renderer.render("index.html");
        });

        it("the input filename", function() {
            assert.equal("index.html", result.inputFile);
        });
    });
});
