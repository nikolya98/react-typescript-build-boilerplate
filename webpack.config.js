const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const SOURCE = path.resolve(__dirname, "src");
const BUILD = path.resolve(__dirname, "build");
const PUBLIC = path.resolve(__dirname, "public");

const isProd = process.env.NODE_ENV === "production";

const getSettingsForStyles = (withModules = false) => {
  return [
    isProd ? MiniCssExtractPlugin.loader : "style-loader",
    !withModules
      ? "css-loader"
      : {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: !isProd
                ? "[path][name]__[local]"
                : "[hash:base64]",
            },
          },
        },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["autoprefixer"],
        },
      },
    },
    "sass-loader",
  ];
};

module.exports = {
  entry: path.join(SOURCE, "index.tsx"),
  output: {
    path: BUILD,
    publicPath: "/",
    filename: "bundle.js",
    clean: true,
  },

  mode: isProd ? "production" : "development",
  target: "browserslist",

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.s?css$/,
        exclude: /\.module.s?css$/,
        use: getSettingsForStyles(),
      },
      {
        test: /\.module.s?css$/,
        use: getSettingsForStyles(true),
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({ template: path.join(PUBLIC, "index.html") }),
    !isProd && new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name]-[hash].css",
    }),
  ].filter(Boolean),

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".scss"],
    alias: {
      "@components": path.resolve(SOURCE, "components"),
      "@styles": path.resolve(SOURCE, "styles"),
      "@assets": path.resolve(SOURCE, "assets"),
      "@utils": path.resolve(SOURCE, "utils"),
      "@pages": path.resolve(SOURCE, "App/pages"),
    },
  },

  devServer: {
    static: {
      directory: SOURCE,
    },
    host: "127.0.0.1",
    port: 3000,
    hot: true,
  },
};
