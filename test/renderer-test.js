var assert = require("assert");
var rimraf = require("rimraf");
var fs = require("fs");
var Renderer = require("../").Renderer;

describe("Renderer", function() {
    var PATH = __dirname + "/../sample/"
    var STATIC = PATH + "static/";
    var options = {
        templateDir: PATH + "www/",
        contextDir: PATH + "context/",
        nestedDir: PATH + "nested/",
        dist: STATIC
    };

    var renderer;
    beforeEach(function() {
        renderer = new Renderer(options);
    });

    it("setup with the root context", function() {
        assert.notStrictEqual(undefined, renderer.rootContext);
        assert.equal("John Doe", renderer.rootContext.index.name);
        assert.equal(1, renderer.rootContext.sub.more.key);
    });

    describe("nested items", function() {
        it("loaded when Renderer created", function() {
            assert.notStrictEqual(undefined, renderer.nested);
            assert.notStrictEqual(undefined, renderer.nested.comments);
            assert.notStrictEqual(undefined, renderer.nested.comments.root);
            assert.notStrictEqual(undefined, renderer.nested.comments.each);
        });

        it("setup nested as functions", function() {
            assert.equal("function", typeof(renderer.nested.comments.root));
            assert.equal("function", typeof(renderer.nested.comments.each));
        });

        it("can be rendered", function() {
            var result = renderer.render("index.html");
            // John said awesome
            assert.notEqual(-1, result.renderedContent.indexOf("John"));
            assert.notEqual(-1, result.renderedContent.indexOf("awesome"));
            // Jane said bored
            assert.notEqual(-1, result.renderedContent.indexOf("Jane"));
            assert.notEqual(-1, result.renderedContent.indexOf("bored"));
        });
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

        describe("works with full path of files", function() {
            var result;
            beforeEach(function() {
                result = renderer.render(options.templateDir + "index.html");
            });

            it("the input filename", function() {
                assert.equal("index.html", result.inputFile);
            });

            it("the rendered content", function() {
                var renderedContent = result.renderedContent;
                assert.notStrictEqual(undefined, renderedContent);
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
