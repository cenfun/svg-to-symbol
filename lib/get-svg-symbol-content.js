
const getAttrs = function(attrs) {
    if (!attrs) {
        return '';
    }
    return Object.keys(attrs).map(function(k) {
        const v = attrs[k];
        if (!v) {
            return '';
        }
        return `${k}="${v}"`;
    }).filter(it => it).join(' ');
};

const getSvgSymbolContent = function(metadata, inlineSvg) {

    const ls = [];
    if (!inlineSvg) {
        ls.push('<?xml version="1.0" encoding="UTF-8"?>');
        ls.push('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
    }

    ls.push('<svg xmlns="http://www.w3.org/2000/svg">');
    metadata.list.forEach(function(item) {
        const attrs = {
            id: metadata.prefix + item.id,
            viewBox: item.viewBox,
            preserveAspectRatio: item.preserveAspectRatio
        };
        const symbolAttrs = getAttrs(attrs);
        ls.push(`<symbol ${symbolAttrs}>`);
        ls.push(metadata.contents[item.content]);
        ls.push('</symbol>');
    });

    ls.push('</svg>');
    
    return ls.join('');
};

module.exports = getSvgSymbolContent;