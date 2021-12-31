const path = require('path');
const EC = require('eight-colors');

const svgToSymbol = require('../lib');
//console.log(item);
const result = svgToSymbol({
    name: 'my-icons',
    dirs: [path.resolve(__dirname, 'icons')],
    outputDir: path.resolve(__dirname, 'dist'),

    // outputSvg: 'icons.svg',
    // inlineSvg: false,

    // outputJson: 'icons.json',

    // outputRuntimeLib: 'icons.js',

    metadata: {
        key: 'value'
    }
    
});

if (result.metadata) {
    console.log(EC.green('done'));
} else {
    console.log(EC.red('ERROR: Failed to generate svg symbol file'));
}