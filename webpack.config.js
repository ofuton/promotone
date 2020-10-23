const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")

const environment = process.env.NODE_ENV || "development"
const ASSET_PATH = process.env.ASSET_PATH || "/"

module.exports = {
  mode: environment,
  devtool: "inline-source-map",

  entry: {
    content: "./src/app/content.ts",
    background: "./src/app/background.ts",
    inject: "./src/app/web_accessible_resources/inject.ts",
    options: "./src/app/options.ts",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
    publicPath: ASSET_PATH,
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css",
    }),
    new CopyPlugin({ patterns: [{ from: "src/icons/", to: "icons" }] }),
    new CopyPlugin({ patterns: [{ from: "src/html/", to: "html" }] }),
    new webpack.DefinePlugin({
      "process.env.ASSET_PATH": JSON.stringify(ASSET_PATH),
    }),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: environment === "development",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development",
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\/manifest\.json$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
          "extract-loader",
          {
            loader: "chrome-manifest-loader",
            options: {
              mapVersion: true,
            },
          },
        ],
        type: "javascript/auto",
      },
      {
        test: /\.(jpg|png)$/,
        loader: "url-loader",
      },
    ],
  },
}
