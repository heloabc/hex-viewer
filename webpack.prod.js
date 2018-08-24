const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: ['react-hot-loader/patch', './src/index.js'],
  mode: 'production',
  output: {
    filename: 'bundle-[hash].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '',
  },
  devServer: {
    contentBase: './public',
    historyApiFallback: true,
    hot: true,
    port: 6009,
    host: '0.0.0.0',
    stats: {
      colors: true,
      chunks: false,
      chunkModules: false,
      children: false
    },
  },
  optimization: {
    minimize: true,
    splitChunks: {
      minSize: 300,
      automaticNameDelimiter: '.',
      minChunks: 1,
      cacheGroups: {
        dll: {
          test: /node_modules/,
          name: 'dll',
          chunks: 'all',
        },
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2
        },
        styles: {
          name: 'styles',
          test: /\.(less|css)$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [ path.resolve(__dirname, 'src') ],
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ["react-hot-loader/babel"],
              presets: [
                [
                  '@babel/preset-react', {
                    useBuiltIns: process.env.NODE_ENV === 'development',
                    development: process.env.NODE_ENV === 'development',
                  },
                ],
              ]
            }
          }
        ]
      },
      { // stylesheet
        test: /\.(css|less)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
          },
        }],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './template/index.ejs',
      filename: 'index.html',
      hash: false,
    }),
    new MiniCssExtractPlugin({ // 提取为外部css代码
      filename: '[name].[contenthash].css',
    }),
  ]
}