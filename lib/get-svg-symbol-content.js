
const getAttrs = function(attrs) {
    if (!attrs) {
        return '';
    }
    return Object.keys(attrs).map(function(k) {
        return `${k}="${attrs[k]}"`;
    }).join(' ');
};

const getSvgSymbolContent = function(metadata, inlineSvg) {

    const ls = [];
    if (!inlineSvg) {
        ls.push('<?xml version="1.0" encoding="UTF-8"?>');
        ls.push('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
    }

    const svgAttrs = getAttrs(metadata.headers);
    ls.push(`<svg ${svgAttrs}>`);
    metadata.list.forEach(function(item) {
        const attrs = {
            id: metadata.prefix + item.id
        };
        if (item.viewBox) {
            attrs.viewBox = item.viewBox;
        }
        const symbolAttrs = getAttrs(attrs);
        ls.push(`<symbol ${symbolAttrs}>`);
        ls.push(item.content);
        ls.push('</symbol>');
    });

    ls.push('</svg>');
    
    return ls.join('');
};

module.exports = getSvgSymbolContent;