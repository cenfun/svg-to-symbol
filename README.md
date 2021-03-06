# SVG to Symbol
Tool for svg symbol, icons, compressed

# Install
```sh
npm i svg-to-symbol
```

# Usage
```js
const svgToSymbol = require('svg-to-symbol');
const result = svgToSymbol({
    name: 'my-icons',
    dirs: [path.resolve(__dirname, 'icons')],
    exclude: [],
    
    outputDir: path.resolve(__dirname, 'dist'),

    outputSvg: true,
    inlineSvg: false,
    outputJson: true,
    outputRuntimeLib: true,

    onSVGName: function(name, item) {
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg, item) {

    },
    
    //additional metadata
    metadata: {
        key: 'value'
    },

    svgo: {}

});

if (result.metadata) {
    console.log('done');
} else {
    console.log('ERROR: Failed to generate svg symbol file');
}
```
see [config](lib/config.js)
# With Namespace For Icon ID
```js
const result = svgToSymbol({
    name: 'my-icons',
    dirs: [{
        ns1: path.resolve(__dirname, 'icons1'),
        ns2: path.resolve(__dirname, 'icons2')
    }],
});
```

# Test
```
npm run test
```
see [test](test/test.js)

# Icon HTML
```html
<svg pointer-events="none" width="100%" height="100%">
    <use xlink:href="#${fullId}" />
</svg>
```
Mask for round icon:
```html
<svg pointer-events="none" width="100%" height="100%">
    <mask id="${fullId}-mask">
        <rect rx="${radius}" ry="${radius}" fill="#ffffff" x="0" y="0" width="100%" height="100%" />
    </mask>
    <g mask="url(#${fullId}-mask)">
        <rect rx="${radius}" ry="${radius}" fill="${color}" x="0" y="0" width="100%" height="100%" />
        <use xlink:href="#${fullId}" />
    </g>
</svg>
```

# Build Compressed Runtime Lib
```
npm run build
```
* Built a lib template from lib/runtime/src/index.js
* Compress metadata with lz-utils/compress and inject to template lib
* Self-decompressed with lz-utils/decompress on runtime

## Replace holder key
* replace_holder_compressed_str: for compressed string
* replace_holder_runtime_lib_name: for lib global name

## Icons compression
* svgo for single svg icon
* repeated svg contents will be removed
* lz-string compression
## Link
* [https://github.com/svg/svgo](https://github.com/svg/svgo)
* [https://css-tricks.com/svg-symbol-good-choice-icons/](https://css-tricks.com/svg-symbol-good-choice-icons/)
* [https://github.com/pieroxy/lz-string](https://github.com/pieroxy/lz-string)


## Changelog

* 1.0.15
    * fixed invalid svg tag

* 1.0.14
    * added onSVGNameDefault

* 1.0.13
    * remove ignore WARN
    * rename option onSVGDocument

* 1.0.11
    * fixed onSVGName for namespace

* 1.0.9
    * added option onSVGName

* 1.0.7
    * added option exclude

* 1.0.6 
    * added namespace 

* 1.0.5 
    * fixed svg attrs