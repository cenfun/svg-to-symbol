const path = require('path');
const EC = require('eight-colors');

const svgToSymbol = require('../lib');

['my-icons', 'digital-numbers'].forEach(item => {

    console.log('====================================================');
    console.log(`generating ${item} ...`);

    const result = svgToSymbol({
        name: item,
        dirs: [path.resolve(__dirname, `icons/${item}`)],
        outputDir: path.resolve(__dirname, 'dist'),
    
        // outputSvg: true,
        // inlineSvg: false,
        // outputJson: true,
        // outputRuntimeLib: true,

        onSVGDocument: function($svg) {
            //const fill = $svg.attr('fill');
            //if (!fill) {
            //$svg.attr('fill', 'currentColor');
            //}
        },
    
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


console.log('====================================================');
console.log('generating namespace icons ...');

const dirs = {
    ho: path.resolve(__dirname, '../node_modules/heroicons/outline'),
    hs: path.resolve(__dirname, '../node_modules/heroicons/solid'),
    t: path.resolve(__dirname, '../node_modules/@tabler/icons/icons')
};
 
const result = svgToSymbol({
    name: 'namespace',
    dirs: dirs,
    outputDir: path.resolve(__dirname, 'dist'),

    onSVGName: function(name, item) {
        const nameReg = /^[a-z0-9-.]+$/g;
        const nameTest = nameReg.test(name);
        if (!nameTest) {
            console.log(EC.red(`ERROR: svg name does not match "lowercase-dashed": ${item.filePath}`));
            return;
        }
        if (item.namespace) {
            name = `${item.namespace}-${name}`;
        }
        return name;
    },
    
    metadata: {
        name: 'namespace'
    }
        
});
    
if (result.metadata) {
    console.log(EC.green('done'));
} else {
    console.log(EC.red('ERROR: Failed to generate svg symbol file'));
}
