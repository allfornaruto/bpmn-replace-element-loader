const compiler = require("./compiler.js");

test("window.replaceElement is exist", async () => {
  const stats = await compiler("example.js");
  const output = stats.toJson().modules[0].source;
  expect(output).toMatch(/window.replaceElement = replaceElement/);
});

test("window.replaceElement is not exist", async () => {
  const stats = await compiler("example2.js");
  const output = stats.toJson().modules[0].source;
  expect(output).not.toMatch(/window.replaceElement = replaceElement/);
});