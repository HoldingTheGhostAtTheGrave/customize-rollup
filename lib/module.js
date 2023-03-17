const MagicString = require("magic-string");
const { parse } = require("acorn");

const path = require("path");
const analyes = require("./ast/analyes.js");
/**
 * 每个文件都是模块 每个模块都会对应 一个module 实例
 */
class Module {
    constructor({ code, path, bundle }) {
        this.code = new MagicString(code, { filename: path });
        this.path = path;
        this.bundle = bundle;  // 属于 bundle 实例
        this.imports = {};
        this.exports = {};
        // 代码转 ast 树
        this.ast = parse(code, {
            ecmaVersion: 7,
            sourceType: 'module'
        });
        this.analyes();
    }
    analyes() {
        this.ast.body.forEach(node => {
            if (node.type === 'ImportDeclaration') {// 说明这是一个 import 语句 
                let source = node.source.value; // 从哪个模块导入的 
                let specifiers = node.specifiers; // 导入标识符 
                specifiers.forEach(specifier => {
                    const name = specifier.imported.name; //name 
                    const localName = specifier.local.name; //name 
                    //本地的哪个变量，是从哪个模块的的哪个变量导出的 
                    this.imports[localName] = { name, localName, source }
                });
            } else if (node.type === 'ExportNamedDeclaration') { // 说明这是一个 exports 语句 
                let declaration = node.declaration;
                if (declaration.type === 'VariableDeclaration') {
                    let name = declaration.declarations[0].id.name;
                    this.exports[name] = {
                        node, localName: name, expression: declaration
                    }
                }
            }
        });
        console.log(this.imports);
        console.log(this.exports);
        analyes(this.ast, this.code, this);
    }
    // 展开模块的所有语句 吧这些变量的所有语句都放在结果中
    expandAllStatements() {
        let allStatements = [];
        this.ast.body.forEach(statement => {
            let statements = this.expandStatements(statement);
            allStatements.push(...statements);
        });
        return allStatements;
    }
    // 展开一个节点
    // 知道当前节点依赖的变量 它访问的变量 找到这些变量声明的语句
    // 这些模块可能是在当前模块内声明的 也可能是其它模块声明
    expandStatements(statement) {
        let result = [];
        // 判断当前节点是否已被标记使用
        if (!statement._included) {
            statement._included = true; // 这个节点已经纳入节点中 以后不需要重复添加
            // 核心在这
            result.push(statement);
        }
        return result;
    }
}


module.exports = Module;