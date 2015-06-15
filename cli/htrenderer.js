var render = require("../").render;
var getopt = require("node-getopt");

var args = getopt.create([
    ["t", "template=DIR", "Template directory"],
    ["c", "context=DIR" , "Context directory"],
    ["n", "nested=DIR"  , "Nested directory"],
    ["o", "output=DIR"  , "Output directory"],
    ["r", "root=DIR"    , "Root directory.\n" +
        "\tThe other 4 directories are assumed (unless specified explicitely) to be sub directories of this\n" +
        "\tShort for: -t DIR/www/, -c DIR/context -n DIR/nested/ -o DIR/static/"],
])
.bindHelp()
.parseSystem();
var values = args.options;

function testValueMissing(field, rootName) {
    values[field] = values[field] || (values.root && values.root + "/" + rootName);
    if (!values[field]) {
        console.error("%s is required (--%s DIR)", field, field);
        process.exit(1);
    }
}

testValueMissing("template", "www/");
testValueMissing("context" , "context/");
testValueMissing("nested"  , "nested/");
testValueMissing("output"  , "static/");

var options = {
    templateDir: values.template,
    contextDir:  values.context,
    nestedDir:   values.nested,
    dist:        values.output,
};

render(options);
