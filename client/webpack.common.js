const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

module.exports = env => {
  return {
    entry: {
      app: APP_DIR + '/app.jsx',
    },
    output: {
      path: BUILD_DIR,
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js)?/,
          include: APP_DIR,
          use: 'babel-loader',
        }, {
          test: /\.(png|jpg|jpeg|svg|ico)$/,
          include: APP_DIR,
          use: 'url-loader?limit=1',
        }, {
          test: /\.(gltf)$/,
          include: APP_DIR,
          use: 'file-loader',
        }, {
          test: /\.csv$/,
          include: APP_DIR,
          loader: 'csv-loader',
          options: {
            header: true,
            skipEmptyLines: true,
          }
        }
      ],
    },

    // optimization: {
    //   splitChunks: {
    //     chunks: "initial",
    //   },
    //   runtimeChunk: true
    // },

    plugins: [
      new webpack.DefinePlugin({
        ENV: JSON.stringify(env.ENV)
      }),
      new CopyWebpackPlugin([
        {from: APP_DIR + '/../assets/*'},
        {from: APP_DIR + '/../assets/images/*'},
        {from: APP_DIR + '/../assets/model/*'},
        {from: APP_DIR + '/../assets/model/js/*'},
        {from: APP_DIR + '/../assets/model/build/*'},
        {from: APP_DIR + '/../assets/model/textures/terrain/*'},
        {from: APP_DIR + '/../assets/model/js/loaders/*'},
        {from: APP_DIR + '/../assets/model/js/controls/*'},
        {from: APP_DIR + '/../assets/model/monsters/*'},
        {from: APP_DIR + '/../assets/model/js/controls/*'},
      ]),

      new HtmlWebpackPlugin({
        inject: false,
        template: APP_DIR + '/../index.html',
        filename: BUILD_DIR + '/index.html',
        customHash: ((new Date()).getTime()).toString(),
      }),

    ],
    node: {
      fs: 'empty',
      global: true
    }
  }
};