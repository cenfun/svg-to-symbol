const path = require('path');
const EC = require('eight-colors');

const svgToSymbol = require('../lib');

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


const dn = svgToSymbol({
    name: 'digital-numbers',
    dirs: [path.resolve(__dirname, 'digital-numbers')],
    outputDir: path.resolve(__dirname, 'dist'),

    outputSvg: 'digital-numbers.svg',
    // inlineSvg: false,

    outputJson: 'digital-numbers.json',

    outputRuntimeLib: 'digital-numbers.js'
    
});

if (dn.metadata) {
    console.log(EC.green('done'));
} else {
    console.log(EC.red('ERROR: Failed to generate svg symbol file'));
}