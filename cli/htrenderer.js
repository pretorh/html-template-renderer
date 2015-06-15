var render = require("../").render;
var getopt = require("node-getopt");

var args = getopt.create([
    ["t", "template=DIR", "Template directory"],
    ["c", "context=DIR" , "Context directory"],
    ["n", "nested=DIR"  , "Nested directory"],
    ["o", "output=DIR"  , "Output directory"],
])
.bindHelp()
.parseSystem();
var values = args.options;

function testValueMissing(field) {
    if (!values[field]) {
        console.error("%s is required (--%s DIR)", field, field);
        process.exit(1);
    }
}

testValueMissing("template");
testValueMissing("context");
testValueMissing("nested");
testValueMissing("output");

var options = {
    templateDir: values.template,
    contextDir:  values.context,
    nestedDir:   values.nested,
    dist:        values.output,
};

render(options);
