/*
This file holds all modifications that apply to both
dev and production compilations. Applies babel to all
.js files excluding node_modules, allows the use of 
SASS for css and extracts all css into its own bundled
file separate from the bundled js files.
*/

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
        pixelApp: './public/js/pixelApp.js',
        canvasGrid: './public/js/canvasGrid.js'
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
