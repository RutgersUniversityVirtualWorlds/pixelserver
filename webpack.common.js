const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let extractPlugin = new ExtractTextPlugin({
    filename: '[name].bundle.css'
})

module.exports = {
    entry: {
        main: './public/js/main.js',
        index: './public/js/index.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist') //need absolute path
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                    loader: 'babel-loader',
                    options: { presets: ['env'] }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: extractPlugin.extract({ use: ['css-loader'] })
            },
            {
                test: /\.scss$/,
                use: extractPlugin.extract({ use: ['css-loader', 'sass-loader']})
            }
        ]
    },
    plugins: [
        extractPlugin,
        new CleanWebpackPlugin(['dist'])
    ]
};
