# svg-to-symbol
tools for svg symbol, icons, compressed

# Install
```sh
npm i svg-to-symbol
```

# Usage
```js
const svgToSymbol = require('svg-to-symbol');
const result = svgToSymbol({
    dirs: [path.resolve(__dirname, 'icons')],
    prefix: 'my-icon-prefix-',
    outputDir: path.resolve(__dirname, 'dist')

    // outputSvg: 'icons.svg',
    // inlineSvg: false,

    // outputJson: 'icons.json',

    // outputRuntimeLib: 'icons.js'
    
});

if (result.metadata) {
    console.log('done');
} else {
    console.log('ERROR: Failed to generate svg symbol file');
}
```
see [config](lib/config.js)

# Test
```
npm run test
```
see [test](test/test.js)

# Build Compressed Runtime Lib
```
npm run build
```
* Built a lib template from lib/runtime/src/index.js
* Compress metadata with lz-utils/compress and inject to template lib
* Self-decompressed with lz-utils/decompress on runtime

## Replace holder key
* compressed_str_replace_holder: for compressed string
* Lib svg_to_symbol_lib_replace_holder: for lib global name

## Icons compression
* svgo for single svg icon
* repeated svg contents will be removed
* lz-string compression
## Link
* [https://github.com/svg/svgo](https://github.com/svg/svgo)
* [https://css-tricks.com/svg-symbol-good-choice-icons/](https://css-tricks.com/svg-symbol-good-choice-icons/)
* [https://github.com/pieroxy/lz-string](https://github.com/pieroxy/lz-string)