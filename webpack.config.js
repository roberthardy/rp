const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  name: "inspector",
  mode: "development",
  entry: "./src/ui/index.tsx",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist/ui"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /node_modules/,
        options: {
          configFileName: "src/ui/tsconfig.json"
        }
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "index.js",
    path: path.resolve(process.cwd(), "dist", "ui"),
    publicPath: "/"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "ui", "index.html")
    }),
    new FaviconsWebpackPlugin(path.resolve(__dirname, "src", "ui", "logo.png"))
  ]
};
