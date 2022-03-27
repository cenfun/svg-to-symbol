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

    onSVGFilename: function(filename, item) {
        const filenameReg = /^[a-z0-9-.]+$/g;
        const nameTest = filenameReg.test(filename);
        if (!nameTest) {
            console.log(EC.red(`ERROR: filename does not match "lowercase-dashed.svg": ${item.filePath}`));
            return;
        }
        if (item.namespace) {
            filename = `${item.namespace}-${filename}`;
        }
        return filename;
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