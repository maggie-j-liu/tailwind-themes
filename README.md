This Tailwind CSS plugin adds variants for multiple themes, making it easy to add multiple color themes to your website.

To use, install the plugin using the following command.

```
# using npm
npm install tailwind-themes

# using yarn
yarn add tailwind-themes
```

Then, add the plugin to your Tailwind configuration, for example:

```
plugins: [
  require("tailwind-themes")({
    themes: {
      blue: ".blue",
      purple: ".theme-purple",
    },
  }),
]
```

In the `themes` object, each key is the name of the variant (so a key of `blue` would create classes such as `blue:text-blue-900`) and each value is the selector that activates the variant (a value of `".theme-purple"` means that the purple variant will be activated if a class of `.theme-purple` exists earlier in the HTML tree).

If you are using JIT mode, no other configuration is needed. For the default AOT mode, you should add the `themes` variant to the utilities you want to enable it for. An example is shown below, where the `themes` variant is enabled for color related utilities.

```
// only necessary if not using JIT mode
variants: {
  extend: {
    backgroundColor: ["themes"],
    gradientColorStops: ["themes"],
    borderColor: ["themes"],
    divideColor: ["themes"],
    placeholderColor: ["themes"],
    textColor: ["themes"],
  },
},
```

For an example of how this can be used, see the [demo](https://github.com/maggie-j-liu/tailwind-themes-demo).
