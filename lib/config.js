const defaultConfig = {
    //name for prefix and library
    name: 'icons',

    dirs: [],
    exclude: [],
    filenameReg: '^[a-z0-9-.]+$',
    
    outputDir: '',

    outputSvg: true,
    inlineSvg: false,

    outputJson: true,

    outputRuntimeLib: true,

    onSVGAttribute: function($svg) {

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