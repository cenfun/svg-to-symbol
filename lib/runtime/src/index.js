
const decompress = require('lz-utils/lib/decompress.js');
const getSvgSymbolContent = require('../../get-svg-symbol-content.js');

const injectIcons = function(metadata, retry = 0) {
    if (retry > 10) {
        return;
    }
    //console.log(metadata);
    let parent = document.head;
    if (!parent) {
        parent = document.body;
    }
    if (!parent) {
        setTimeout(function() {
            injectIcons(metadata, retry + 1);
        }, 100);
        return;
    }

    if (parent.querySelector(`.${metadata.containerId}`)) {
        //console.log(`container exist: ${metadata.containerId}`);
        return;
    }
    
    const div = document.createElement('div');
    div.className = metadata.containerId;
    div.style.cssText = 'display: none; position: absolute; width: 0; height: 0; overflow:hidden;';
    div.innerHTML = metadata.svg;
    parent.appendChild(div);
};

const getFullSvg = function(metadata, item) {

    const list = ['<svg pointer-events="none" width="100%" height="100%"'];

    if (item.viewBox) {
        list.push(` viewBox="${item.viewBox}"`);
    }

    if (item.preserveAspectRatio) {
        list.push(` preserveAspectRatio="${item.preserveAspectRatio}"`);
    }

    list.push(`>${metadata.contents[item.content]}</svg>`);

    return list.join('');
};


const init = function(metadata) {
    if (!metadata || !metadata.list) {
        return;
    }

    metadata.containerId = `${metadata.prefix}container`;
    metadata.svg = getSvgSymbolContent(metadata, true);

    //init list
    metadata.list.forEach(function(item) {
        const fullId = metadata.prefix + item.id;
        item.fullId = fullId;
        item.svg = `<svg pointer-events="none" width="100%" height="100%"><use xlink:href="#${fullId}" /></svg>`;
        item.fullSvg = getFullSvg(metadata, item);
    });

    injectIcons(metadata);

    return metadata;
};

const compressedStr = '{replace_holder_compressed_str}';
const metadataStr = decompress(compressedStr);
const metadata = JSON.parse(metadataStr);

module.exports = init(metadata);