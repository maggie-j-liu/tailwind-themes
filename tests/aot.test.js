const plugin = require("../index.js");
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const cssMatcher = require("jest-matcher-css");
const pseudoClasses = require("./pseudoClasses");

expect.extend({
  toMatchCss: cssMatcher,
});

const baseTheme = {
  theme: {
    colors: {
      blue: {
        500: "#3B82F6",
      },
    },
  },
  corePlugins: ["textColor"],
};

const baseOptions = {
  themes: { blue: ".theme-blue" },
};

const generatePluginCss = (config = baseTheme, options = baseOptions) => {
  return postcss(
    tailwindcss({
      corePlugins: false,
      plugins: [plugin(options)],
      ...config,
    })
  )
    .process("@tailwind utilities;", {
      from: undefined,
    })
    .then((result) => result.css);
};

describe("works with aot mode", () => {
  it("generates base variants", async () => {
    const css = await generatePluginCss({
      ...baseTheme,
      variants: {
        textColor: ["themes"],
      },
    });
    expect(css).toMatchCss(`
      .text-blue-500 {
        color: #3B82F6
      }
      .theme-blue .blue\\:text-blue-500 {
        color: #3B82F6
      }
    `);
  });

  for (const [variant, pseudoClass] of Object.entries(pseudoClasses)) {
    it(`generates ${variant} variants`, async () => {
      const css = await generatePluginCss({
        ...baseTheme,
        variants: {
          textColor: [variant, "themes"],
        },
      });
      expect(css).toMatchCss(`
        .text-blue-500 {
          color: #3B82F6
        }
        .${variant}\\:text-blue-500:${pseudoClass} {
          color: #3B82F6
        }
        .theme-blue .blue\\:text-blue-500 {
          color: #3B82F6
        }
        .theme-blue .blue\\:${variant}\\:text-blue-500:${pseudoClass} {
          color: #3B82F6
        }
      `);
    });
  }
});
