let Bundle = require('./bundle.js');
function rollup (entry , outputFileName) {
    // Bundle 打包对象 里面 会包含打包信息
    const bundle = new Bundle({ entry });
    bundle.build(outputFileName);
}

module.exports = rollup;