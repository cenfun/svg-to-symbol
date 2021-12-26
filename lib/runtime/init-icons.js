
const initIcons = (metadata) => {
    if (!metadata || !metadata.list) {
        return;
    }
    metadata.list.forEach(item => {
        const fullId = metadata.prefix + item.id;
        item.fullId = fullId;
        item.svg = `<svg><use xlink:href="#${fullId}"/></svg>`;
        item.fullSvg = `<svg id="${fullId}" viewBox="${item.viewBox}">${item.content}</svg>`;
    });
};

module.exports = initIcons;