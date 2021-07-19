const plugin = require("tailwindcss/plugin");
const selectorParser = require("postcss-selector-parser");

module.exports = plugin(({ addVariant, prefix }) => {
  addVariant(
    "blue",
    ({ modifySelectors, separator }) => {
      const modified = modifySelectors(({ selector }) => {
        return selectorParser((selectors) => {
          for (let i = selectors.first.nodes.length - 1; i >= 0; i--) {
            // find the last class selector
            if (selectors.first.nodes[i].type === "class") {
              // modify it to add the color variant
              selectors.first.nodes[
                i
              ].value = `blue${separator}${selectors.first.nodes[i].value}`;
              break;
            }
          }
        }).processSync(selector);
      });
      // go through all the rules and add the color class
      modified.walkRules((rule) => {
        rule.selectors = rule.selectors.map((selector) => {
          return `${prefix(".blue")} ${selector}`;
        });
      });
      return modified;
    },
    { unstable_stack: true }
  );
});
