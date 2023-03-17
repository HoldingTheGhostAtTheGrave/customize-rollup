/**
 * 遍历ast 语法树
 */
function walk(ast, { enter, leave }) {
    visit(ast, null, enter, leave);
}
/**
 * 访问node 节点
 * @param {*} ast 
 * @param {*} parent 
 * @param {*} enter 
 * @param {*} leave 
 */
function visit(node, parent, enter, leave) {
    // 执行节点的enter 方法
    if (enter) {
        enter.call(null, node, parent);
    }
    // 遍历子节点 
    let childKeys = Object.keys(node).filter(key => typeof node[key] === 'object');
    childKeys.forEach((childKey) => {
        let value = node[childKey];
        if (Array.isArray(value)) {
            value.forEach(val => visit(val, node, enter, leave));
        } else {
            visit(value, node, enter, leave);
        }
    })
    // 离开方法
    if (leave) {
        leave.call(null, node, parent);
    }
}

module.exports = walk