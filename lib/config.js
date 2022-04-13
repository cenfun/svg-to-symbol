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

    onSVGNameDefault: function(name, item) {
        if (item.namespace) {
            name = `${name}-${item.namespace}`;
        }

        const nameReg = /^[a-z0-9-.]+$/g;
        const nameTest = nameReg.test(name);
        if (!nameTest) {
            console.log(EC.red(`ERROR: "${name}" does not match "lowercase-dashed": ${item.filePath}`));
            return;
        }
        return name;
    },

    onSVGName: function(name, item) {
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg, item) {

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