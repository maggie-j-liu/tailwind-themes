const plugin = require("../index.js");
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const cssMatcher = require("jest-matcher-css");
const path = require("path");
const fs = require("fs/promises");
const pseudoClasses = require("./pseudoClasses");

expect.extend({
  toMatchCss: cssMatcher,
});

const baseTheme = {
  purge: ["./jit.test.html"],
  theme: {
    colors: {
      blue: {
        500: "#3B82F6",
      },
    },
  },
  prefix: "tw-",
  corePlugins: ["textColor"],
};

const baseOptions = {
  themes: { blue: ".theme-blue" },
};

const html = (className) => `
<!DOCTYPE html>
<html lang="en">
  <body>
    <div class="${className}"></div>
  </body>
</html>
`;

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

describe("works with prefixes", () => {
  it("generates variants", async () => {
    await fs.writeFile("./jit.test.html", html(`blue:tw-text-blue-500`));
    const css = await generatePluginCss();
    await fs.unlink("./jit.test.html");
    expect(css).toMatchCss(`
      .tw-theme-blue .blue\\:tw-text-blue-500 {
        color: #3B82F6
      }
    `);
  });

  for (const [variant, pseudoClass] of Object.entries(pseudoClasses)) {
    it(`generates ${variant} variants`, async () => {
      await fs.writeFile(
        `./jit-${variant}.test.html`,
        html(`blue:${variant}:tw-text-blue-500`)
      );
      const css = await generatePluginCss({
        ...baseTheme,
        purge: [`./jit-${variant}.test.html`],
      });
      await fs.unlink(`./jit-${variant}.test.html`);
      expect(css).toMatchCss(`
        .tw-theme-blue .blue\\:${variant}\\:tw-text-blue-500:${pseudoClass} {
          color: #3B82F6
        }
      `);
    });
  }
});
