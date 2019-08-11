// js代码转AST
const parser = require("@babel/parser");
//从AST中找到相应的节点
const traverse = require("@babel/traverse").default;
//提供了很多和 AST 的 Node 节点相关的辅助函数
const t = require("@babel/types");
//将 AST 树重新转为对应的代码字符串
const generate = require("babel-generator").default;
const template = require("@babel/template").default;

module.exports = function(source) {
  let ast = parser.parse(source, {
    sourceType: "module", // 支持 es6 module
    plugins: ["dynamicImport"] // 支持动态 import
  });
  traverse(ast, {
    Identifier(path) {
      const createMenuEntryParent = path.findParent(path => path.isMemberExpression());
      const isIwant=t.isIdentifier(path.node, { name: "_createMenuEntry" })
        && createMenuEntryParent.node
        && createMenuEntryParent.node.object
        && createMenuEntryParent.node.object.object
        && createMenuEntryParent.node.object.object.name==="ReplaceMenuProvider";

      if (isIwant) {
        const parent = path.findParent(path => path.isAssignmentExpression());
        const rightFunctionExpression = parent.get("right");
        const functionBody = rightFunctionExpression.get("body").get("body");
        // vm
        const astVmReplaceElement_1 = template.ast(`var vm=window.vm.$children[0];`);
        const astVmReplaceElement_2 = template.ast(`vm.$set(vm.bpmnPanel,'replaceElement',replaceElement);`);
        const astVmReplaceElement_3 = template.ast(`window.bpmnPanel.replaceElement = replaceElement;`);
        functionBody[2].insertBefore(astVmReplaceElement_1);
        functionBody[2].insertBefore(astVmReplaceElement_2);
        functionBody[2].insertBefore(astVmReplaceElement_3);
      }
    }
  });
  return generate(ast).code;
};
