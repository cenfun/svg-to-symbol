const EC = require('eight-colors');

const defaultConfig = {
    //name for prefix and library
    name: 'icons',

    dirs: [],
    exclude: [],
    
    outputDir: '',

    outputSvg: true,
    inlineSvg: false,

    outputJson: true,

    outputRuntimeLib: true,

    onSVGName: function(name, item) {
        const nameReg = /^[a-z0-9-.]+$/g;
        const nameTest = nameReg.test(name);
        if (!nameTest) {
            console.log(EC.red(`ERROR: svg name does not match "lowercase-dashed": ${item.filePath}`));
            return;
        }
        if (item.namespace) {
            name = `${name}-${item.namespace}`;
        }
        return name;
    },

    onSVGAttribute: function($svg, item) {

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