const path  = require("path");
const rollup = require('./lib/rollup.js');
// 入口文件
const enter = path.join(__dirname,'src/main.js');

rollup(enter, 'dist/bundle.js')