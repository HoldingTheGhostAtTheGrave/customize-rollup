const fs = require('fs');
const MagicString  = require('magic-string');
const Module = require('./module');

class Bundle {
    constructor (options) {
        // 入口文件的绝对路径
        this.entryPath = options.entry.replace(/\.js$/,'')+'.js';
        this.modules = {}; // 所有的模块 入口文件和依赖的模块
    }
    build(outputFileName){
        // 从入口文件出发找到它的模块
        let entryModule = this.fetchModule(this.entryPath);
        // 吧所有的入口模块 所有的语句进行展开 返回所有的语句 组成的数组
        this.statements = entryModule.expandAllStatements();
        const { code } = this.generate();
        fs.writeFileSync(outputFileName , code ,'utf8');
    }
    // 吧 this.statement  生成代码
    generate(){
        let magicString = new MagicString.Bundle();
        this.statements.forEach(statement => {
            const source = statement._source.clone();
            magicString.addSource({
                content:source,
                separator:'\n'
            });
        })
        return { code:magicString.toString() };
    }
    // 获取模块信息
    fetchModule(importee){
        let route = importee; // 入口文件的绝对路径

        if(route){
            // 获取模块的原代码
           let code = fs.readFileSync(route,'utf8');
           let module = new Module({
                code,
                path:route,
                bundle:this
           });
           return module;
        }
    }
}

module.exports = Bundle;