const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
var path = require('path')
require('dotenv').config()
var webpack = require('webpack');

module.exports = (env, argv) => {
  require('dotenv').config({
    path: `./.env${env.file ? '.' + env.file : ''}`
  })
  
  return {
    mode: 'development',
    resolve: {
      extensions: ['*', '.mjs', '.js', '.jsx']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: argv.mode == 'development' ? `[name].bundle.version_1.0.2.js` : `[contenthash].bundle.version_1.0.2.js`,
      chunkFilename: argv.mode == 'development' ? `[name].bundle.version_1.0.2.js` : `[contenthash].bundle.version_1.0.2.js`,
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        },
        {
          test: /\.(jpe?g|png|gif|ico|svg)$/i,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[contenthash].[ext]'
            }
          }]
        },
        {
          test: /(\.css|\.scss|\.sass)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            }, {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('autoprefixer')
                ],
                sourceMap: true
              }
            }, {
              loader: 'sass-loader',
              options: {
                includePaths: [path.resolve(__dirname, 'src')],
                sourceMap: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './src/index.html',
        baseUrl: process.env.BASE_URL,
        excludeChunks: Object.keys({})
      }),
      new MiniCssExtractPlugin({
        filename: argv.mode == 'development' ? '[name].css' : '[contenthash].css',
        chunkFilename: argv.mode == 'development' ? '[name].css' : '[contenthash].css',
      }),
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js',
      }),
    ],
    devServer: {
      historyApiFallback: true,
      contentBase: './',
      // hot: true,
      port: 3000,
      compress: true,
      disableHostCheck: true,   // That solved it
      open: true
    },
    externals: {
      // global app config object
      config: JSON.stringify({
        apiUrl: process.env.API_URL,
        uploadHost: process.env.UPLOAD_URL
      })
    },
  }
};