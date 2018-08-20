const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    nodeExternals = require('webpack-node-externals');

module.exports = [
    {
        name: 'reverse-proxy',
        mode: 'development',
        entry : './src/server.ts',
        devtool: 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'awesome-typescript-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        },
        output: {
            filename: 'server.js',
            path: path.resolve(process.cwd(), 'dist'),
        },
        node: {
            __dirname: false
        },
        target: 'node',
        externals: [nodeExternals()]
    },
];