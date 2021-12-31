const path = require('path');
module.exports = {
    mode: 'production',
    //mode: "development",

    target: ['web', 'es5'],

    entry: path.resolve(__dirname, 'lib/runtime/src/index.js'),

    output: {
        path: path.resolve(__dirname, 'lib/runtime/dist'),
        filename: 'template.js',
        umdNamedDefine: true,
        library: '{replace_holder_runtime_lib_name}',
        libraryTarget: 'umd'
    },

    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
};