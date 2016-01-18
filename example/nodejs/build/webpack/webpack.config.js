var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: "./js/main.js",
  output: {
    filename: "output/[name].bundle.js",
    path: __dirname + '/assets/',  //path.join(__dirname, 'out'),  //打包输出的路径
    publicPath: "/assets/"
  },
  module: {
    loaders: [
       //.css 文件使用 style-loader 和 css-loader 来处理
      { test: /\.css$/, loader: "style!css" },
      { test: /\.less$/, //loader: "style!css!less" },
          loader: ExtractTextPlugin.extract('css?sourceMap!' +'less?sourceMap') },
    //  { test: /\.js$/,  loader: "jsx-loader" },
      { test: /\.js$/, loader: 'babel' , exclude: '/(node_modules|bower_components)/' ,
        query: {presets: ['es2015'] }  },  /// 'react' , 'stage-0'
      { test: /.(png|jpg)$/, loader: 'url-loader?limit=8192'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  // 内联css提取到单独的styles的css
  plugins: [new ExtractTextPlugin('styles.css')]
  // 当然，插件也支持所有独立样式打包成一个css文件。增加多一个参数即可。
  // new ExtractTextPlugin("style.css", {allChunks: true})
};
