const plugin = require("tailwindcss/plugin");
const selectorParser = require("postcss-selector-parser");

const modifyLastClass = ({ name, separator, selector }) => {
  return selectorParser((selectors) => {
    for (let i = selectors.first.nodes.length - 1; i >= 0; i--) {
      // find the last class selector
      if (selectors.first.nodes[i].type === "class") {
        // modify it to add the color variant
        selectors.first.nodes[
          i
        ].value = `${name}${separator}${selectors.first.nodes[i].value}`;
        break;
      }
    }
  }).processSync(selector);
};

// this generates one variant, themes, that can be used with multiple colors
// doesn't work in jit mode since the variant name must be used in the class
const oneVariant = ({ addVariant, prefix, themes }) => {
  addVariant(
    "themes",
    ({ separator, container }) => {
      container.each((rule) => {
        if (rule.type !== "rule") {
          return;
        }
        for (const [name, sel] of Object.entries(themes)) {
          // for each selector
          const newSelectors = rule.selectors.map((selector) => {
            // parse it
            const processed = modifyLastClass({ name, separator, selector });
            return `${prefix(sel)} ${processed}`;
          });
          // add a new rule for the current theme color
          rule.cloneBefore({ selectors: newSelectors });
        }
        // remove the rule without any variants
        rule.remove();
      });
    },
    { unstable_stack: true } // stacks custom variants with others, like hover and focus
  );
};

// generates one variant per color, for jit mode
const multipleVariants = ({ addVariant, prefix, themes }) => {
  for (const [name, sel] of Object.entries(themes)) {
    addVariant(name, ({ separator, container }) => {
      container.each((rule) => {
        if (rule.type !== "rule") {
          return;
        }
        // for each selector
        rule.selectors = rule.selectors.map((selector) => {
          // parse it
          const processed = modifyLastClass({ name, separator, selector });
          return `${prefix(sel)} ${processed}`;
        });
      });
    });
  }
};

module.exports = plugin.withOptions(({ themes }) => {
  return ({ addVariant, prefix, config }) => {
    if (config("mode") === "jit") {
      multipleVariants({ addVariant, prefix, themes });
    } else {
      oneVariant({ addVariant, prefix, themes });
    }
  };
});
