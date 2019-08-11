// js代码转AST
const parser = require("@babel/parser");
//从AST中找到相应的节点
const traverse = require("@babel/traverse").default;
//提供了很多和 AST 的 Node 节点相关的辅助函数
const t = require("@babel/types");
//将 AST 树重新转为对应的代码字符串
const generate = require("babel-generator").default;

module.exports = function(source) {
  let ast = parser.parse(source, {
    sourceType: "module", // 支持 es6 module
    plugins: ["dynamicImport"] // 支持动态 import
  });
  traverse(ast, {
    Identifier(path) {
      if (t.isIdentifier(path.node, { name: "_createMenuEntry" })) {
        const parent = path.findParent(path => path.isAssignmentExpression());
        const rightFunctionExpression = parent.get("right");
        const functionBody = rightFunctionExpression.get("body").get("body");
        const leftIdentifier = t.memberExpression(
          t.identifier("window"),
          t.identifier("replaceElement")
        );
        const rightIdentifier = t.identifier("replaceElement");
        const windowReplaceElement = t.assignmentExpression(
          "=",
          leftIdentifier,
          rightIdentifier
        );
        functionBody[1].insertAfter(windowReplaceElement);
      }
    }
  });
  return generate(ast).code;
};
