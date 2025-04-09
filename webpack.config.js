import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default (env, argv) => {
  const { mode } = argv;
  const isDevMode = mode === "development";

  return {
    mode: isDevMode ? "development" : "production",
    devtool: isDevMode ? "source-map" : false,
    entry: "./src/index.js",
    output: {
      filename: "[name].[contenthash].js",
      assetModuleFilename: "assets/[name].[hash][ext][query]",
      path: path.resolve(__dirname, "dist/www"),
      clean: true,
    },
    optimization: {
      minimize: !isDevMode,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
            compress: false,
            output: { ascii_only: true, ecma: 5 },
          },
        }),
      ],
    },
    devServer: {
      allowedHosts: "all",
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: ["html-loader"],
        },
        {
          test: /\.s[ca]ss/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                api: "modern",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Tower",
        template: path.resolve(__dirname, "src", "index.html"),
        meta: {
          viewport:
            "width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, user-scalable=0",
        },
      }),
    ],
  };
};
