const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (env = {dev: true, prod: false}) {
  var srcPath = path.resolve(__dirname, 'src/');
  var distPath = path.resolve(__dirname, 'dist/');
  var optionsPage = path.resolve(__dirname, "options.html");
  var componentsDir = path.resolve(srcPath, 'components');

  return {
    context: srcPath,
    entry: {
      app: path.resolve(componentsDir, "app/app.tsx"),
      background: path.resolve(srcPath, "background/background.ts"),
      injector: path.resolve(srcPath, "user-script/injector.ts"),
      content: path.resolve(srcPath, "user-script/user-script.tsx"),
      page: path.resolve(srcPath, "user-script/content-page.scss"),
    },
    output: {
      path: distPath,
      publicPath: './',
      filename: '[name].js'
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    module: {
      loaders: [
        {
          test: /\.tsx?$/,
          use: 'awesome-typescript-loader',
        },
        {
          test: /\.s?css$/,
          loader: ExtractTextPlugin.extract({
            loader: [
              "css",
              {
                loader: "sass",
                query: {
                  data: '@import "' + path.resolve(componentsDir, "vars.scss") + '";',
                  includePaths: [srcPath]
                }
              }
            ]
          })
        },
        {
          test: /\.(jpg|png|svg)$/,
          loader: "file?name=assets/[name]-[hash:6].[ext]"
        },
        {
          test: /\.(ttf|eot|woff2?)$/,
          loader: 'file?name=fonts/[name].[ext]'
        },
        {
          test: /\.json$/,
          loader: "json"
        },
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        hash: true,
        chunks: ["common", "app"],
        filename: path.basename(optionsPage),
        template: optionsPage
      }),
      new ExtractTextPlugin({
        filename: "[name].css",
        allChunks: true,
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env.prod ? "production" : "development"),
        }
      }),
      new CopyWebpackPlugin([
        {from: "../manifest.json"},
        {from: "../_locales", to: "_locales"},
        {from: path.resolve(componentsDir, "icons/*.png"), to: "icons", flatten: true},
      ]),
    ],
  };
};