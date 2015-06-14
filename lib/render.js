var fsutils = require("./fsutils");

module.exports = render;

function render(options) {
    fsutils.ensureDirExists(options.dist);
}
