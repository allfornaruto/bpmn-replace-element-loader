const compiler = require("./compiler.js");

test("window.replaceElement is exist", async () => {
  const stats = await compiler("example.js");
  const output = stats.toJson().modules[0].source;
  expect(output).toMatch(/window.replaceElement = replaceElement/);
});
