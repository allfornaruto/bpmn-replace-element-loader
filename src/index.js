// js代码转AST
const parser = require("@babel/parser");
//从AST中找到相应的节点
const traverse = require("@babel/traverse").default;
//提供了很多和 AST 的 Node 节点相关的辅助函数
const t = require("@babel/types");
//将 AST 树重新转为对应的代码字符串
const generate = require("babel-generator").default;
const template = require("@babel/template").default;

const isIwant_replaceElement = (path) => {
  const createMenuEntryParent = path.findParent(path => path.isMemberExpression());
  const isIwant = t.isIdentifier(path.node, {name: "_createMenuEntry"})
    && createMenuEntryParent.node
    && createMenuEntryParent.node.object
    && createMenuEntryParent.node.object.object
    && createMenuEntryParent.node.object.object.name === "ReplaceMenuProvider";
  return isIwant;
};

const isIwant_commandStack = (path) => path.node && path.node.id && path.node.id.name === "CommandInitializer";

const isIwant_initBpmn = (path)=>{
  let isIwantLeftPropertiesName = false;
  let isIwantLeftInstanceName = false;
  try{
    isIwantLeftPropertiesName = path.get("left.property").isIdentifier({name:"_init"});
    isIwantLeftInstanceName = path.get("left.object.object").isIdentifier({name:"PropertiesPanel"});
  }finally {
    return isIwantLeftPropertiesName && isIwantLeftInstanceName;
  }
};

const isIwant_elementDocuEntry = (path)=>{
  let  isIwantVariableDeclarations = false;
  try{
    isIwantVariableDeclarations = path.get("declarations.0").node.id.name === "processRef";
  }finally {
    return isIwantVariableDeclarations;
  }
};

const isIwant_conditionalEntry = (path)=>{
  let  isIwantConditionalEntry = false;
  try{
    const node = path.get("declarations.0").node;
    if(node.id.name === "bo" && node.init.callee.name === "getBusinessObject"){
      const moduleExportsParams=path.parentPath.parent.params.reduce((result,item)=>{
        result.push(item.name);
        return result;
      },[]);
      isIwantConditionalEntry = ["group","element","bpmnFactory","translate"].every(item=>moduleExportsParams.includes(item));
    }
  }finally {
    return isIwantConditionalEntry ;
  }
};

const isIwant_Element_BusinessObject =(path) =>{
  let isIwantElementAndBusinessObject = false;
  try{
    const node = path.get("declarations.0").node;
    if(node.id.name === "bo" && node.init.callee.name === "getBusinessObject"){
      const moduleExportsParams=path.parentPath.parent.params.reduce((result,item)=>{
        result.push(item.name);
        return result;
      },[]);
      isIwantElementAndBusinessObject = ["element","bpmnFactory","options","translate"].every(item=>moduleExportsParams.includes(item));
    }
  }finally {
    return isIwantElementAndBusinessObject;
  }
};

module.exports = function (source) {
  let ast = parser.parse(source, {
    sourceType: "module",
    plugins: ["dynamicImport"]
  });
  traverse(ast, {
    Identifier(path) {
      if (isIwant_replaceElement(path)) {
        const parent = path.findParent(path => path.isAssignmentExpression());
        const rightFunctionExpression = parent.get("right");
        const functionBody = rightFunctionExpression.get("body").get("body");
        const ast = template.statements(`
          if(window.vm){
            var vm=window.vm.$children[0];
            vm.$set(vm.bpmnPanel,'replaceElement',replaceElement);
          }
          window.bpmnPanel.replaceElement = replaceElement;
        `)();
        functionBody[2].insertBefore(ast);
      }
    },
    FunctionDeclaration(path) {
      if(isIwant_commandStack(path)){
        const functionBody = path.get("body").get("body");
        const astCommandStackVm = template.ast(`var vm=window.vm.$children[0];`);
        const astCommandStackVmSet = template.ast(`vm.$set(vm.bpmnPanel,'bpmnPanelCommandStack',commandStack);`);
        const astCommandStack = template.ast(`window.bpmnPanel.bpmnPanelCommandStack=commandStack;`);
        functionBody[0].insertBefore(astCommandStackVm);
        functionBody[0].insertBefore(astCommandStackVmSet);
        functionBody[0].insertBefore(astCommandStack);
      }
    },
    AssignmentExpression(path) {
      if(isIwant_initBpmn(path)){
        const functionBody = path.get("right.body.body");
        const astBpmnPanel = template.ast(`window.bpmnPanel={};`);
        //[NodePath...] NodePath可以使用insertBefore方法
        functionBody[0].insertBefore(astBpmnPanel);
      }
    },
    VariableDeclaration(path){
      if(isIwant_elementDocuEntry(path)){
        const astBpmnPanelElementDocuEntryVm = template.ast(`var vm=window.vm.$children[0];`);
        const astBpmnPanelElementDocuEntryVmSet = template.ast(`vm.$set(vm.bpmnPanel,'bpmnPanelElementDocuEntry',group.entries[0]);`);
        const astBpmnPanelElementDocuEntry = template.ast(`window.bpmnPanel.bpmnPanelElementDocuEntry=group.entries[0];`);
        const functionBody = path.container;
        //[Node...] Node类型不能使用insertBefore方法
        functionBody.splice(path.key,0,astBpmnPanelElementDocuEntryVm,astBpmnPanelElementDocuEntryVmSet,astBpmnPanelElementDocuEntry);
      }
      if(isIwant_conditionalEntry(path)){
        const astBpmnPanelConditionalEntryVm = template.ast(`var vm=window.vm.$children[0];`);
        const astBpmnPanelConditionalEntryVmSet = template.ast(`vm.$set(vm.bpmnPanel,'bpmnPanelConditionalEntry',group.entries[0]);`);
        const astBpmnPanelConditionalEntry = template.ast(`window.bpmnPanel.bpmnPanelConditionalEntry=group.entries[0];`);
        const functionBody = path.container;
        //[Node...] Node类型不能使用insertBefore方法
        functionBody.push(...[astBpmnPanelConditionalEntryVm,astBpmnPanelConditionalEntryVmSet,astBpmnPanelConditionalEntry]);
      }
      if(isIwant_Element_BusinessObject(path)){
        const astVm = template.ast(`var vm=window.vm.$children[0];`);
        const astElementVmSet = template.ast(`vm.$set(vm.bpmnPanel,'bpmnPanelElement',element);`);
        const astBusinessObjectVmSet = template.ast(`vm.$set(vm.bpmnPanel,'bpmnPanelBusinessObject',bo);`);
        const astElement = template.ast(`window.bpmnPanel.bpmnPanelElement=element;`);
        const astBusinessObject = template.ast(`window.bpmnPanel.bpmnPanelBusinessObject=bo;`);
        const functionBody = path.container;
        functionBody.splice(path.key+1,0,astVm,astElementVmSet,astBusinessObjectVmSet,astElement,astBusinessObject);
      }
    }
  });
  return generate(ast).code;
};
