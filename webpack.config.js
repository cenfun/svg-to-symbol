const path = require('path');
module.exports = {
    mode: 'production',
    //mode: "development",

    entry: path.resolve(__dirname, 'lib/runtime/src/index.js'),

    output: {
        path: path.resolve(__dirname, 'lib/runtime/dist'),
        filename: 'template.js',
        umdNamedDefine: true,
        library: '{svg_to_symbol_lib_replace_holder}',
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
                    presets: [['@babel/preset-env', {
                        'targets': [
                            'defaults',
                            'not IE 11',
                            'maintained node versions'
                        ]
                    }]]
                }
            }
        }]
    }
};