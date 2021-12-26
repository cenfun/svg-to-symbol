const defaultConfig = {
    dirs: [],
    prefix: 'icons-',
    
    outputDir: '',

    outputSvg: 'icons.svg',
    inlineSvg: false,

    outputJson: 'icons.json',

    outputRuntimeLib: 'icons.js',
    library: 'icons-lib',
    
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