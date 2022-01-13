const plugin = require("tailwindcss/plugin");

module.exports = plugin.withOptions(({ themes }) => {
  return ({ addVariant }) => {
    for (const [name, sel] of Object.entries(themes)) {
      addVariant(name, `${sel} &`);
    }
  };
});
