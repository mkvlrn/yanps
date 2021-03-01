import { HotAcceptPlugin } from "hot-accept-webpack-plugin";
import { join } from "path";
import ForkTypeChecker from "fork-ts-checker-webpack-plugin";
import Htmlplugin from "html-webpack-plugin";
import webpack from "webpack";

const PORT = process.env.PORT || 1337;
const PROD = process.env.NODE_ENV === "production";

const plugins = [];
if (!PROD) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new HotAcceptPlugin({ test: "index.tsx" })
  );
}
plugins.push(
  new ForkTypeChecker(),
  new Htmlplugin({ template: "./static/index.html" })
);

const config = {
  target: "web",
  entry: "./src/index.jsx",
  output: {
    path: join(__dirname, "./dist"),
    filename: "js/[name].js",
    chunkFilename: "js/[name].js",
    publicPath: "",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "ts-loader",
        exclude: "/node_modules/",
        options: {
          // will check for types with plugin
          transpileOnly: true,
        },
      },
      {
        test: /\.(mpeg|mpg|mp4)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: "asset/resource",
        generator: {
          filename: "videos/[hash][ext]",
        },
      },
      {
        test: /\.(jpg|jpeg|ico|png|gif|svg|webp)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: "asset/resource",
        generator: {
          filename: "img/[hash][ext]",
        },
      },
      {
        test: /\.(ttf|eot|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext]",
        },
      },
      {
        test: /\.(wav|ogg|mp3)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: "asset/resource",
        generator: {
          filename: "audio/[hash][ext]",
        },
      },
    ],
  },
  plugins,
  devtool: PROD ? "cheap-source-map" : "inline-cheap-source-map",
};

export default {
  ...config,
  devServer: {
    contentBase: "./dist",
    port: PORT,
    historyApiFallback: true,
    stats: "minimal",
    hotOnly: true,
    open: true,
    host: "0.0.0.0",
    public: `localhost:${PORT}`,
  },
};
