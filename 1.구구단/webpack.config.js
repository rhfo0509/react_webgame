const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: "eval", // hidden-source-map
  resolve: {
    extensions: [".jsx", ".js"],
  },

  entry: {
    app: "./client",
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: ["> 5% in KR"], // browserslist
                },
                debug: true,
              },
            ],
            "@babel/preset-react",
          ],
        },
      },
    ],
  },

  plugins: [new webpack.LoaderOptionsPlugin({ debug: true })],

  output: {
    path: path.join(__dirname, "dist"),
    filename: "app.js",
  },
};
