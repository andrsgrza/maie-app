const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./app/src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  mode: isProduction ? "production" : "development",

  plugins: [
    new Dotenv({
      path: isProduction ? false : "./.env",
    }),
    new HtmlWebpackPlugin({ template: "app/src/index.html" }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "app/resources/logo.ico"),
          to: "resources/",
        },
      ],
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 8082,
  },
  devtool:
    process.env.NODE_ENV === "production" ? "source-map" : "eval-source-map",
  optimization: {
    minimize: process.env.NODE_ENV === "production", // Only minimize in production
    minimizer: [new TerserPlugin()],
  },
};
