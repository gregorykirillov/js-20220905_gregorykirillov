const path = require('path');
module.exports = {
  mode: "none",
  entry: "./src/index.js",
  output: {
    path: __dirname + '/dist',
    filename: "bundle.js"
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
      staticOptions: {},
      publicPath: "/",
      serveIndex: true,
      watch: true,
    },
    allowedHosts: "all",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
    ]
  }
};