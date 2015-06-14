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
    });

    function removeDirectory(done) {
        rimraf(STATIC, done);
    }
    function render() {
        htRenderer.render({
            templates: PATH + "www/",
            context: PATH + "context/",
            dist: STATIC
        });
    }
});
