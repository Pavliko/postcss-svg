var postcss = require('postcss');
var postcssSVG = require('../index.js');
var open = require("open");
var fs = require('fs');
var css = fs.readFileSync('./example/style.css').toString();

css = postcss([ postcssSVG({paths: ['./example']}) ]).process(css).css;
fs.writeFileSync('./example/output.css', css);
open("./example/index.html");
