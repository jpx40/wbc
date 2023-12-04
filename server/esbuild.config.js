require("esbuild").build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  platform: "node",
  outfile: "build/main.js",
  sourcemap: true,
  target: "node12",
  external: Object.keys(require("../package.json").dependencies),
});

// node esbuild.config.js

// const { build } = require("esbuild");
//
// build({
//   entryPoints: ["./index.js"],
//   outfile: "./bundle.js",
//   external: ["react", "react-dom"],
//   loader: { ".js": "jsx", ".png": "base64" },
//   minify: true,
// }).catch((error) => {
//   console.error(error);
//   process.exit(1);
// });
