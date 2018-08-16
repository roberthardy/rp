const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    nodeExternals = require('webpack-node-externals');

module.exports = function(env, argv) {
    const config = {
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
            publicPath: '/'
        },
        plugins: [
            new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'ui', 'index.html') })
        ],
        node: {
            __dirname: false
        }
    };

    if (env.platform === 'server') {
        config.target = 'node';
        config.externals = [nodeExternals()];
    }

    if (env.platform === 'client') {
        config.entry = './src/ui/index.tsx';
        config.output.filename = './ui/index.js';
    }

    return config;
}
