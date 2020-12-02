const webpack = require('webpack')

module.exports = {
  output: {
    // Serve the bundle from /static
    publicPath: '/static/'
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
        test: /\.(eot|woff|svg|woff2|ttf)([\?]?.*)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: ['url-loader?limit=100000']
      }
    ]
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],

  devServer: {
    hot: true,
    port: 3000,
    host: '0.0.0.0',
    disableHostCheck: true,
    public: 'vsc.filpro.io',
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
