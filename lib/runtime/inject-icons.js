
const getSvgSymbolContent = require('./get-svg-symbol-content.js');

const injectIcons = (metadata, retry = 0) => {
    if (!metadata || !metadata.list) {
        return;
    }
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

    const classId = `svg-symbol-${metadata.prefix}-container`;
    if (parent.querySelector(`.${classId}`)) {
        //exist
        return;
    }

    const content = getSvgSymbolContent(metadata);

    const div = document.createElement('div');
    div.innerHTML = content;
    div.className = classId;
    div.style.cssText = 'display: none; position: absolute; width: 0; height: 0; overflow:hidden;';
    parent.appendChild(div);
};

module.exports = injectIcons;