const defaultConfig = {
    //name for prefix and library
    name: 'icons',

    dirs: [],
    
    outputDir: '',

    outputSvg: true,
    inlineSvg: false,

    outputJson: true,

    outputRuntimeLib: true,
    
    headers: {
        xmlns: 'http://www.w3.org/2000/svg'
    },

    //additional metadata
    metadata: {},

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