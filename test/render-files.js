var assert = require("assert");
var fs = require("fs");
var rimraf = require("rimraf");

var htRenderer = require("../index.js");

describe("render files", function() {
    var PATH = __dirname + "/../sample/"
    var STATIC = PATH + "static/";

    before(removeDirectory);

    describe("when rendered", function() {
        before(render);

        it("creates the directory", function() {
            var exists = fs.existsSync(STATIC);
            assert.equal(true, exists, "directory not created");
        });

        it("should create the file", function() {
            var exists = fs.existsSync(STATIC + "index.html");
            assert.equal(true, exists, "file not created");
        });

        it("should write correct file", function() {
            var html = fs.readFileSync(STATIC + "index.html").toString();
            assert.equal(-1, html.indexOf("{{"), "file not rendered");
            assert.equal(-1, html.indexOf("}}"), "file not rendered");
            assert.notEqual(-1, html.indexOf("John Doe"), "file not rendered");
        });

        it("should write correct file with root context", function() {
            var html = fs.readFileSync(STATIC + "sub/about.html").toString();
            assert.notEqual(-1, html.indexOf("Name: John Doe"), "file not rendered with @root");
        });

        it("should write nested views", function() {
            var html = fs.readFileSync(STATIC + "index.html").toString();
            assert.notEqual(-1, html.indexOf("awesome"), "comment(1) not rendered");
            assert.notEqual(-1, html.indexOf("bored"), "comment(2) not rendered");
            assert.notEqual(-1, html.indexOf("123"), "comment(3) not rendered");
        });
    });

    function removeDirectory(done) {
        rimraf(STATIC, done);
    }
    function render() {
        htRenderer.render({
            templateDir: PATH + "www/",
            contextDir: PATH + "context/",
            nestedDir: PATH + "nested/",
            dist: STATIC
        });
    }
});
