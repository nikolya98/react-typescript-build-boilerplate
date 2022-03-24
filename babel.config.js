module.exports = {
  presets: [
    [
      "@babel/preset-env",
      { useBuiltIns: "usage", corejs: "3.21", modules: false },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
