const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
module.exports = merge(common, {
  devServer: {
    historyApiFallback: true,
  },
  devtool: "source-map",
  mode: "development",
});
