import devMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import { resolve } from 'path';

let compiler = webpack({
  entry: {
    app: [ resolve(__dirname, '..', '..', 'client', 'entry.jsx') ]
  },
  output: {
    path: '/'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: [ 'babel?optional[]=runtime&optional[]=es7.decorators&optional[]=es7.exportExtensions&stage=2' ]
    }]
  },
  resolve: {
    extensions: ['', '.jsx', '.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_DEVTOOLS': JSON.stringify(process.env.NODE_DEVTOOLS),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
});

let options = {
  publicPath: '/js/',
  stats: {
    colors: true
  }
};

export default () => devMiddleware(compiler, options);
