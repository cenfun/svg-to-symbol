
const decompress = require('lz-utils/lib/decompress.js');
const getSvgSymbolContent = require('../../get-svg-symbol-content.js');

const injectIcons = (metadata, retry = 0) => {
    if (retry > 10) {
        return;
    }
    //console.log(metadata);
    let parent = document.head;
    if (!parent) {
        parent = document.body;
    }
    if (!parent) {
        setTimeout(() => {
            injectIcons(metadata, retry + 1);
        }, 100);
        return;
    }

    
    if (parent.querySelector(`.${metadata.containerId}`)) {
        //exist
        return;
    }
    
    const div = document.createElement('div');
    div.className = metadata.containerId;
    div.style.cssText = 'display: none; position: absolute; width: 0; height: 0; overflow:hidden;';
    div.innerHTML = metadata.svg;
    parent.appendChild(div);
};

const initId = function(id) {
    return id.replace(/-+/g, '-');
};

const init = function(metadata) {
    if (!metadata || !metadata.list) {
        return;
    }

    metadata.containerId = initId(`${metadata.library}-${metadata.prefix}-container`);
    metadata.svg = getSvgSymbolContent(metadata, true);

    //init list
    metadata.list.forEach(item => {
        const fullId = metadata.prefix + item.id;
        item.fullId = fullId;
        item.svg = `<svg><use xlink:href="#${fullId}"/></svg>`;
        item.fullSvg = `<svg id="${fullId}" viewBox="${item.viewBox}">${item.content}</svg>`;
    });

    injectIcons(metadata);

    return metadata;
};

const compressedStr = '{compressed_str_replace_holder}';
const metadataStr = decompress(compressedStr);
const metadata = JSON.parse(metadataStr);

module.exports = init(metadata);