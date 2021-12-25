const path = require('path');
const EC = require('eight-colors');

const svgToSymbol = require('../lib');
//console.log(item);
const config = svgToSymbol({
    dirs: [path.resolve(__dirname, 'icons')],
    prefix: 'my-icon-prefix-',
    outputDir: path.resolve(__dirname, 'dist'),

    outputSvg: 'icons.svg',
    outputJson: 'icons.json',
    outputCompressed: 'icons-compressed.js'
    
});

if (config.metadata) {
    console.log(EC.green('done'));
} else {
    console.log(EC.red('ERROR: Failed to generate svg symbol file'));
}