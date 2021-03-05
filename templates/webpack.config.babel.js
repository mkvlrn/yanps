import { join } from "path";
import ReactRefresh from "@pmmmwh/react-refresh-webpack-plugin";
import Htmlplugin from "html-webpack-plugin";

/**
 * @param {object} _ Env
 * @param {object} args Args
 * @returns {object} Webpack Config
 */
export default function Config(_, args) {
  const PORT = process.env.PORT || 1337;
  const { mode } = args;
  const DEV = mode === "development";

  const plugins = [new Htmlplugin({ template: "./src/static/index.html" })];
  const jsxLoader = {
    loader: "babel-loader",
  };
  if (DEV) {
    plugins.push(new ReactRefresh());
    jsxLoader.options = { plugins: ["react-refresh/babel"] };
  }

  const config = {
    mode,
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
          exclude: /node_modules/,
          use: [jsxLoader],
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
    devtool: DEV ? "inline-cheap-source-map" : "cheap-source-map",
    devServer: {
      contentBase: "./dist",
      port: PORT,
      historyApiFallback: true,
      stats: "minimal",
      hot: true,
      hotOnly: true,
      open: true,
      host: "0.0.0.0",
      public: `localhost:${PORT}`,
    },
  };

  return config;
}
