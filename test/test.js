const path = require('path');
const EC = require('eight-colors');

const svgToSymbol = require('../lib');

const list = ['my-icons', 'digital-numbers', 'hero-icons', 'tabler-icons'];


list.forEach(item => {

    console.log('====================================================');
    console.log(`generating ${item} ...`);

    const result = svgToSymbol({
        name: item,
        dirs: [path.resolve(__dirname, `icons/${item}`)],
        outputDir: path.resolve(__dirname, 'dist'),
    
        outputSvg: `${item}.svg`,
        // inlineSvg: false,

        outputJson: `${item}.json`,

        outputRuntimeLib: `${item}.js`,
    
        metadata: {
            name: item
        }
        
    });
    
    if (result.metadata) {
        console.log(EC.green('done'));
    } else {
        console.log(EC.red('ERROR: Failed to generate svg symbol file'));
    }
    
});
