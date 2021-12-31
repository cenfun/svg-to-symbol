
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
        item.fullSvg = `<svg pointer-events="none" width="100%" height="100%" viewBox="${item.viewBox}">${metadata.contents[item.content]}</svg>`;
    });

    injectIcons(metadata);

    return metadata;
};

const compressedStr = '{replace_holder_compressed_str}';
const metadataStr = decompress(compressedStr);
const metadata = JSON.parse(metadataStr);

module.exports = init(metadata);