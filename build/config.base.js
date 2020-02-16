const path = require('path');
const { SRC, DIST, ASSETS } = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HandlebarsWebpackPlugin = require('handlebars-webpack-plugin');

module.exports = {
    // webpack config for all environments here
    entry: {
        scripts: path.resolve(SRC, 'js', 'app.js')
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    output: {
        path: DIST,
        filename: 'js/bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpg)$/,
                use: {
                    loader: "url-loader"
                }
            },
            {
                test: /\.(html|hbs)$/,
                use: {
                    loader: "handlebars-loader"
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    }
}