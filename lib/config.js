const defaultConfig = {
    dirs: [],
    prefix: '',

    outputDir: '',
    outputSvg: 'icons.svg',
    outputJson: 'icons.json',

    outputCompressed: 'icons-compressed.js',
    compressLib: 'lz-utils/lib/compress.js',
    decompressLib: 'lz-utils/lib/decompress.js',

    headers: {
        xmlns: 'http://www.w3.org/2000/svg'
    },

    //https://github.com/svg/svgo
    svgo: {
        multipass: true
        // plugins: [
        //     // {
        //     //     name: 'preset-default',
        //     //     params: {
        //     //         overrides: {
        //     //             //removeDoctype: false
        //     //         }
        //     //     }
        //     // },
        //     'removeStyleElement',
        //     'removeScriptElement'
        // ]
    }
};


module.exports = defaultConfig;