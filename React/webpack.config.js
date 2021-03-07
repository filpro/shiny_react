const webpack = require('webpack')
const path = require('path');

module.exports = {
  output: {
    // Serve the bundle from /static
    publicPath: '/www/',
    path: path.join('/shiny_react/R/inst/app/www/'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  module: {
    rules: [
      // we use babel-loader to load our jsx and tsx files
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ],
        include: /\.module\.css$/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        exclude: /\.module\.css$/
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash].[ext]',
              outputPath: 'static/img',
              esModule: false // <- here
            }
          }
        ]
      },
    ]
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],

  devServer: {
    hot: true,
    port: 3000,
    host: '0.0.0.0',
    disableHostCheck: true,
    public: 'vsc.filpro.io',
    historyApiFallback: {
      disableDotRule: true,
      index: path.publicUrlOrPath,
    },
    // Proxy everything besides the bundle to Shiny
    proxy: {
      '/': {
        target: 'http://localhost:3838'
      },
      '/websocket': {
        target: 'ws://localhost:3838',
        ws: true
      },
      '/autoreload': {
        target: 'ws://localhost:3838',
        ws: true
      }
    }
  }
}
