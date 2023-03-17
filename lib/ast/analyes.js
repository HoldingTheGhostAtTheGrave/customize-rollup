function analyes (ast , magicString , module) {
    ast.body.forEach(statement => {
        Object.defineProperties(statement,{
            // statement.start 子节点中的开始节点  magicString.end 代码的结束节点
            _source:{ value:magicString.snip(statement.start , statement.end) }
        })
    })
}

module.exports = analyes;