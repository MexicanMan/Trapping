var path = require('path');
 
module.exports = {
  entry: "./src/index.jsx", // source file
  output:{
      path: path.resolve(__dirname, './public'),     // output - dir public
      publicPath: '/',
      filename: "bundle.js"       // output filename
  },
  module:{
      rules:[   //js loader
          {
              test: /\.jsx?$/, // set file type
              exclude: /(node_modules)/,  // exclude dir node_modules
              loader: "babel-loader",   // set loader
              options:{
                  presets:["@babel/preset-env", "@babel/preset-react"]    // use plugins
              }
          },
          {
              test: /\.png$/, 
              loader: "url-loader?mimetype=image/png"
          },
          {
              test: /\.css$/,
              loaders: ['style-loader', 'css-loader'],
           },
      ]
  },
  devServer: {
    historyApiFallback: true,
  },
}