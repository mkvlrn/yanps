import { join } from "path";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import HtmlPlugin from "html-webpack-plugin";

const { WEBPACK_MODE } = process.env;
const PORT = +(process.env.PORT || 1337);
const DEV = WEBPACK_MODE === "development";

const plugins = [];
plugins.push([new HtmlPlugin({ template: "./src/static/index.html" })]);
const jsxLoader = {
  loader: "babel-loader",
  options: {},
};
if (DEV) {
  plugins.push(new ReactRefreshPlugin());
  jsxLoader.options = { plugins: ["react-refresh/babel"] };
}

const config = {
  mode: WEBPACK_MODE || undefined,
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
};

const devServer = {
  contentBase: "./dist",
  port: PORT,
  historyApiFallback: true,
  stats: "minimal",
  hot: true,
  hotOnly: true,
  open: true,
  host: "0.0.0.0",
  public: `localhost:${PORT}`,
};

export default { ...config, devServer };
