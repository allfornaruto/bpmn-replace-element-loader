# Bpmn-replace-element-loader 插件使用说明

>官方文档中并没有提供直接操纵BpmnElement对象和BpmnBusinessObject对象的方法，为了满足一些业务需求，我将其提取出来挂载在window.bpmnPanel对象中。这样我们就可以在自己的业务逻辑中往BpmnElement对象和BpmnBusinessObject对象中添加自定义数据。

>使用方法
window.bpmnPanel.bpmnPanelCommandStack.execute(commandToExecute.cmd, commandToExecute.context || { element : element });

#### HACK bpmn-js/lib/features/popup-menu/ReplaceMenuProvider.js

#### HACK bpmn-properties-panel/lib/PropertiesPanel.js

#### HACK bpmn-properties-panel/lib/cmd/index.js

#### HACK bpmn-properties-panel/lib/provider/bpmn/parts/DocumentationProps.js

#### HACK bpmn-properties-panel/lib/provider/camunda/parts/ConditionalProps.js

#### HACK bpmn-properties-panel/lib/provider/camunda/parts/implementation.Properties.js

