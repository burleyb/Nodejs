let paths = module.paths;
module.paths = require('module')._nodeModulePaths(process.cwd());
let aws = require("@aws-sdk/core");
module.paths = paths;
module.exports = aws;
