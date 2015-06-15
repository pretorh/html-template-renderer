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
});
