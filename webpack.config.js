const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    nodeExternals = require('webpack-node-externals');

module.exports = function(env, argv) {
    const base = {
        mode: 'development',
        entry : './src/server.ts',
        devtool: 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
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
        base.target = 'node';
        base.externals = [nodeExternals()];
    }

    if (env.platform === 'client') {
        base.entry = './src/ui/App.tsx';
        base.output.filename = './ui/client.js';
    }

    return base;
}
