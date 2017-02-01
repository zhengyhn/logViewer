var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var rootPath = path.resolve(__dirname, '..')
var srcPath = path.join(rootPath, 'src')
var distPath = path.join(rootPath, 'dist')

module.exports = {
  // multiple entries
  entry: {
    app: path.join(srcPath, 'main.js'),
    vendor: ['bootstrap-loader']
  },
  // different entry, different filename
  output: {
    path: distPath,
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        include: srcPath,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|eot|woff(2)?)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /bootstrap-sass(\\|\/)assets(\\|\/)javascripts(\\|\/)/,
        loader: 'imports-loader?jQuery=jquery'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    modules: [srcPath, 'node_modules'],
    // extensions: ['*', '.js', '.vue'],
    alias: {
      COMPONENT: path.join(srcPath, 'components'),
      SERVICE: path.join(srcPath, 'services'),
      LIB: path.join(srcPath, 'lib'),
      'vue$': 'vue/dist/vue'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(rootPath, 'index.html')
    }),
    new webpack.DefinePlugin({
      // 配置开发全局常量
      __DEV__: process.env.NODE_ENV.trim() === 'development',
      __PROD__: process.env.NODE_ENV.trim() === 'production'
    }),
    new webpack.ProvidePlugin({
      "$": "jquery",
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
