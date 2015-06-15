var assert = require("assert");
var rimraf = require("rimraf");
var fs = require("fs");
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

    describe("render", function() {
        describe("returns", function() {
            var result;
            beforeEach(function() {
                result = renderer.render("index.html");
            });

            it("the input filename", function() {
                assert.equal("index.html", result.inputFile);
            });

            it("the output filename", function() {
                assert.equal(STATIC + "index.html", result.outputFile);
            });

            it("the rendered content", function() {
                var renderedContent = result.renderedContent;
                assert.notStrictEqual(undefined, renderedContent);
                assert.equal(-1, renderedContent.indexOf("{{"), "file not rendered");
                assert.equal(-1, renderedContent.indexOf("}}"), "file not rendered");
                assert.notEqual(-1, renderedContent.indexOf("John Doe"), "file not rendered");
            });
        });

        it("can render for file with no context (ensures context based on path)", function() {
            var result = renderer.render("sub/about.html");
            var renderedContent = result.renderedContent;
            assert.notEqual(-1, renderedContent.indexOf("Name: John Doe"));
        });

        describe("does not save any files", function() {
            before(function(done) {
                rimraf(STATIC, done);
            });

            it("did not create the root output directory", function() {
                var exists = fs.existsSync(STATIC);
                assert.equal(false, exists, "directory wrongly created");
            });
        });
    });
});
