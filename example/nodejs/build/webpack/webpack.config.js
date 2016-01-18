var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: "./js/main.js",
  output: {
    filename: "ouput/[name].bundle.js",
    path: __dirname + '/assets/',
    publicPath: "/assets/"
  },
  module: {
    loaders: [
       //.css 文件使用 style-loader 和 css-loader 来处理
      { test: /\.css$/, loader: "style!css" },
      { test: /\.less$/, //loader: "style!css!less" },
          loader: ExtractTextPlugin.extract('css?sourceMap!' +'less?sourceMap') },
    //  { test: /\.js$/,  loader: "jsx-loader" },
      { test: /\.js$/, loader: 'babel', exclude: '/node_modules/'},
      { test: /.(png|jpg)$/, loader: 'url-loader?limit=8192'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  // 内联css提取到单独的styles的css
  plugins: [new ExtractTextPlugin('styles.css')]
};
