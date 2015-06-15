var render = require("../").render;

var args = process.argv.slice(2);
if (args.length < 4) {
    console.error("Need 4 params: <templateDir> <contextDir> <nestedDir> <distribution dir>");
    process.exit(1);
}

var options = {
    templateDir: args[0],
    contextDir:  args[1],
    nestedDir:   args[2],
    dist:        args[3],
};

render(options);
