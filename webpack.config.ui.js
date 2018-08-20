const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    nodeExternals = require('webpack-node-externals');

module.exports = {
    name: 'inspector',
    mode: 'development',
    entry : './src/ui/index.tsx',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist/ui'
    },
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
        filename: 'index.js',
        path: path.resolve(process.cwd(), 'dist', 'ui'),
        publicPath: '/ui'
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'ui', 'index.html') })
    ]
}
