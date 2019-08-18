# Bpmn-replace-element-loader 插件使用说明

>依赖库：bpmn-js , bpmn-js-properties-panel

>官方文档中并没有提供直接操纵BpmnElement对象和BpmnBusinessObject对象的方法，为了满足一些业务需求，我将其提取出来挂载在window.bpmnPanel对象中。这样我们就可以在自己的业务逻辑中往BpmnElement对象和BpmnBusinessObject对象中添加自定义数据。

>每当用户操纵Bpmn组件时，window.bpmnPanel.bpmnPanelElement和window.bpmnPanel.bpmnPanelBusinessObject 都会自动更新。我们只需要调用API进行赋值即可。

>针对Vue 我使用vm.$set将其挂载在window.vm.$children[0]中以实现响应式更新。使用watch可以很方便的监听对象的变化并进行业务逻辑的处理。

>如果你使用其他框架，那么你需要自己实现监听window.bpmnPanel对象。

##使用方法

```javascript
//Vue-cli3 vue.config.js
module.exports = {
//...
chainWebpack(config) {
    config.module
      .rule('bpmn-replace-element-loader')
      .test(/\.js$/)
      .use('bpmn-replace-element-loader')
      .loader('bpmn-replace-element-loader')
      .end()
  }
};
```


###强制修改Task类型
```javascript
//Task type
const TaskList = [
  "bpmn:Task",
  "bpmn:ServiceTask",
  "bpmn:SendTask",
  "bpmn:UserTask",
  "bpmn:BusinessRuleTask",
  "bpmn:ScriptTask",
  "bpmn:ReceiveTask",
  "bpmn:CallActivity",
  "bpmn:TimerEventDefinition",
  "bpmn:SignalEventDefinition",
  "bpmn:MultiInstanceLoopCharacteristics"
];
// 例子：默认Task->UserTask
const bpmnPanel = window.bpmnPanel;
const element = bpmnPanel.bpmnPanelElement;
bpmnPanel.replaceElement(element,{type:'bpmn:UserTask'})
```

###添加Documentation属性
```javascript
const bpmnPanel = window.bpmnPanel;
const element = bpmnPanel.bpmnPanelElement;
const command = bpmnPanel.bpmnPanelElementDocuEntry.set(element, {documentation:"your data"});
bpmnPanel.bpmnPanelCommandStack.execute(command.cmd, command.context);
```

###添加Expresstion属性
```javascript
const bpmnPanel = window.bpmnPanel;
const element = bpmnPanel.bpmnPanelElement;
const commands = bpmnPanel.bpmnPanelConditionalEntry.set(element, {conditionType: "expression",condition:"your data"});
commands.forEach(command => {
  bpmnPanel.bpmnPanelCommandStack.execute(command.cmd, command.context);
});
```

#### HACK bpmn-js/lib/features/popup-menu/ReplaceMenuProvider.js

#### HACK bpmn-properties-panel/lib/PropertiesPanel.js

#### HACK bpmn-properties-panel/lib/cmd/index.js

#### HACK bpmn-properties-panel/lib/provider/bpmn/parts/DocumentationProps.js

#### HACK bpmn-properties-panel/lib/provider/camunda/parts/ConditionalProps.js

#### HACK bpmn-properties-panel/lib/provider/camunda/parts/implementation.Properties.js

