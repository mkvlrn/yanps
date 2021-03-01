import webpack from "webpack";
import ForkTypeChecker from "fork-ts-checker-webpack-plugin";

const config: webpack.Configuration = {
  resolve: {
    extensions: [".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: "/node_modules/",
        options: {
          // will check for types with plugin
          transpileOnly: true,
        },
      },
    ],
  },
  plugins: [new ForkTypeChecker()],
  devtool: process.env.NODE_ENV === "development" ? "source-maps" : false,
};

export default config;
