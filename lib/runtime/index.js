
const decompress = require('lz-utils/lib/decompress.js');
const injectIcons = require('./inject-icons.js');
const initIcons = require('./init-icons.js');

const iconsLib = function(compressedContent) {

    const metadata = JSON.parse(decompress(compressedContent));

    initIcons(metadata);
    injectIcons(metadata);

    return metadata;
};

module.exports = iconsLib;