const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const glob = require('glob')

module.exports = (env, argv) => {
  console.log(argv.mode, __dirname)
  return {
    mode: 'development',
    // entry: () => {
    //   --- ./src/front/app/ 内
    //   const jsBasePath = path.resolve(__dirname, 'src/front/app/')
    //   const targets = glob.sync(`${jsBasePath}/**/index.mjs`)
    //   const entries = {}
    //   targets.forEach(value => {
    //     const replaced = jsBasePath.replace(/\\/g, '/')
    //     const re = new RegExp(replaced)
    //     const key = value.replace(re, '').replace(/index.mjs/g, 'bundle')
    //     entries[key] = value
    //   })
    //   --- ./src/front/ 直下
    //   entries['bundle'] = './src/front/index.js'
    //   return entries
    // },
    entry: {
      main: ['@babel/polyfill', './src/main.js']
      // 'watchword-box/bundle': ['@babel/polyfill', './src/front/app/watchword-box/index.mjs']
    },
    devtool: 'source-map',
    output: {
      path: __dirname + '/public',
      filename: 'dist/[name].js',
      chunkFilename: 'dist/[name].js'
    },
    optimization: {
      minimize: argv.mode === 'production' ? true : false
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000'
        }
      ]
    },
    resolve: {
      extensions: ['*', '.vue', '.json', '.js'],
      alias: {
        vue$: 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' webpack 1 用
      }
    },
    plugins: [new VueLoaderPlugin()],
    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      port: 3000
    }
  }
}
