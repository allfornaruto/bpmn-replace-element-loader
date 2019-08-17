const compiler = require("./compiler.js");

test("replaceElement is exist", async () => {
  const stats = await compiler("example.js");
  const output = stats.toJson().modules[0].source;
  expect(output).toMatch(/window\.bpmnPanel\.replaceElement = replaceElement;/);
});

test("replaceElement is not exist", async () => {
  const stats = await compiler("example2.js");
  const output = stats.toJson().modules[0].source;
  expect(output).not.toMatch(/window\.bpmnPanel\.replaceElement = replaceElement;/);
});

test("bpmnPanelCommandStack is exist",async ()=>{
  const stats = await compiler('cmdIndex.js');
  const output = stats.toJson().modules[0].source;
  expect(output).toMatch(/window\.bpmnPanel\.bpmnPanelCommandStack = commandStack;/);
});

test("bpmnInit success",async ()=>{
  const stats = await compiler('propertiesPanel.js');
  const output = stats.toJson().modules[0].source;
  expect(output).toMatch(/window\.bpmnPanel = {};/);
});

test("bpmnPanelElementDocuEntry is exist",async ()=>{
  const stats = await compiler('documentationProps.js');
  const output = stats.toJson().modules[0].source;
  expect(output).toMatch(/window\.bpmnPanel\.bpmnPanelElementDocuEntry = group\.entries\[0\];/);
});

test("conditionalProps is exist",async ()=>{
  const stats = await compiler('conditionalProps.js');
  const output = stats.toJson().modules[0].source;
  expect(output).toMatch(/window\.bpmnPanel\.bpmnPanelConditionalEntry = group.entries\[0\];/);
});

test("properties is exist",async()=>{
  expect.assertions(2);
  const stats = await compiler('properties.js');
  const output = stats.toJson().modules[0].source;
  expect(output).toMatch(/window\.bpmnPanel\.bpmnPanelElement = element;/);
  expect(output).toMatch(/window\.bpmnPanel\.bpmnPanelBusinessObject = bo;/);
});













