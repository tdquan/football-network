const path = require( 'path' );

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: {
	        loader: 'babel-loader',
	        options: {
	          presets: ['@babel/preset-env']
	        }
	      }
      }
    ]
  }
 //  resolve: {
 //    extensions: ['', '.js', '.jsx']
 //  },
 //  devServer: {
 //    historyApiFallback: true,
 //    contentBase: './',
 //    watchOptions: {
 //      aggregateTimeout: 300,
 //      poll: 1000
 //    },
	// port: 3000
 //  }
};
