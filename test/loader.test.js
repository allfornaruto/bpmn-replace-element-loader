const compiler = require("./compiler.js");

test("window.replaceElement is exist", async () => {
  const stats = await compiler("example.js");
  const output = stats.toJson().modules[0].source;
  expect(output).toMatch(/var vm = window.vm.\$children\[0\];/);
  expect(output).toMatch(/vm\.\$set\(vm.bpmnPanel, 'replaceElement', replaceElement\);/);
  expect(output).toMatch(/window\.bpmnPanel\.replaceElement = replaceElement;/);
});

test("window.replaceElement is not exist", async () => {
  const stats = await compiler("example2.js");
  const output = stats.toJson().modules[0].source;
  expect(output).not.toMatch(/var vm = window.vm.\$children\[0\];/);
  expect(output).not.toMatch(/vm\.\$set\(vm.bpmnPanel, 'replaceElement', replaceElement\);/);
  expect(output).not.toMatch(/window\.bpmnPanel\.replaceElement = replaceElement;/);
});