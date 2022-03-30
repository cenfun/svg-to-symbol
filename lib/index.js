const fs = require('fs');
const path = require('path');
const EC = require('eight-colors');
const cheerio = require('cheerio');
const format = require('xml-formatter');
const compress = require('lz-utils/lib/compress.js');
const { optimize } = require('svgo');
const ignore = require('ignore');

const defaultConfig = require('./config.js');
const getSvgSymbolContent = require('./get-svg-symbol-content.js');

const logError = (str) => {
    console.log(EC.red(str));
};

const logSuccess = (str) => {
    console.log(EC.green(str));
};

const formatPath = function(str) {
    if (str) {
        str = str.replace(/\\/g, '/');
    }
    return str;
};

const replace = function(str, obj, defaultValue) {
    str = `${str}`;
    if (!obj) {
        return str;
    }
    str = str.replace(/\{([^}{]+)\}/g, function(match, key) {
        if (!obj.hasOwnProperty(key)) {
            if (typeof (defaultValue) !== 'undefined') {
                return defaultValue;
            }
            return match;
        }
        let val = obj[key];
        if (typeof (val) === 'function') {
            val = val(obj, key);
        }
        if (typeof (val) === 'undefined') {
            val = '';
        }
        return val;
    });
    return str;
};

const relativePath = (p) => {
    return formatPath(path.relative(process.cwd(), p));
};

const readFileContentSync = function(filePath) {
    let content = null;
    const isExists = fs.existsSync(filePath);
    if (isExists) {
        content = fs.readFileSync(filePath);
        if (Buffer.isBuffer(content)) {
            content = content.toString('utf8');
        }
    }
    return content;
};

const writeFileContentSync = function(filePath, content, force = true) {
    const isExists = fs.existsSync(filePath);
    if (force || isExists) {
        const p = path.dirname(filePath);
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p, {
                recursive: true
            });
        }
        fs.writeFileSync(filePath, content);
        return true;
    }
    return false;
};

const forEachSvg = function(dir, callback) {
    if (!fs.existsSync(dir)) {
        return;
    }
    const list = fs.readdirSync(dir);
    list.forEach(function(name) {
        const abs = path.resolve(dir, name);
        const info = fs.statSync(abs);
        if (info.isDirectory()) {
            forEachSvg(abs, callback);
        } else {
            const relPath = relativePath(abs);
            if (path.extname(name) === '.svg') {
                callback(relPath);
            }
        }
    });
};

const generateSvgFiles = (config) => {
    let dirs = config.dirs;
    if (!Array.isArray(dirs)) {
        dirs = [dirs];
    }

    const list = [];
    dirs.forEach(item => {
        if (typeof item === 'string') {
            list.push({
                dir: item,
                namespace: ''
            });
            return;
        }

        if (item && typeof item === 'object') {
            for (const namespace in item) {
                list.push({
                    dir: item[namespace],
                    namespace: namespace
                });

            }
        }
    });

    const files = [];
    list.forEach(item => {
        forEachSvg(item.dir, function(filePath) {
            files.push({
                filePath: filePath,
                namespace: item.namespace
            });
        });
    });

    return files;
};

const isExcludeFile = (ig, filePath) => {
    if (!ig) {
        return false;
    }
    if (ig.ignores(filePath) || ig.ignores(`${filePath}/`)) {
        return true;
    }
    return false;
};

const getIgnore = (config) => {
    let exclude = config.exclude || [];
    if (!Array.isArray(exclude)) {
        exclude = [exclude];
    }
    exclude = exclude.filter(item => item);
    //console.log('exclude', exclude);
    if (!exclude.length) {
        return;
    }

    const ig = ignore();
    exclude.forEach((line) => {
        line = line.trim();
        if (line) {
            ig.add(line);
        }
    });
    return ig;
};

const generateSvgList = (config) => {

    const files = generateSvgFiles(config);
    console.log(`[${config.name}] Found total svg files: ${files.length}`);

    const ig = getIgnore(config);

    const svgList = [];
    const ignoreList = [];
    files.forEach(item => {
        const namespace = item.namespace;
        const filePath = item.filePath;

        //exclude
        if (isExcludeFile(ig, filePath)) {
            ignoreList.push(item);
            return;
        }

        let name = path.basename(filePath, '.svg');

        //name check, name will be icon id
        if (typeof config.onSVGName === 'function') {
            name = config.onSVGName.call(config, name, item);
        }

        if (!name) {
            return;
        }

        //content
        const content = readFileContentSync(filePath);
        if (!content) {
            logError(`ERROR: Invalid svg file content: ${filePath}`);
            return;
        }

        svgList.push({
            filePath,
            namespace,
            name,
            content
        });
    });

    if (ignoreList.length) {
        console.log(`[${config.name}] Ignored svg files: ${EC.yellow(ignoreList.length)}`);
    }

    //console.log(`Filtered svg files: ${EC.green(svgList.length)}`);

    //console.log(svgList);
    config.svgList = svgList;

};


const getSvgAttrList = ($svg) => {

    const keys = [
        'style',
        'alignment-baseline',
        'baseline-shift',
        'clip',
        'clip-path',
        'clip-rule',
        'color',
        'color-interpolation',
        'color-interpolation-filters',
        'color-profile',
        'color-rendering',
        'cursor',
        'd',
        'direction',
        'display',
        'dominant-baseline',
        'enable-background',
        'fill',
        'fill-opacity',
        'fill-rule',
        'filter',
        'flood-color',
        'flood-opacity',
        'font-family',
        'font-size',
        'font-size-adjust',
        'font-stretch',
        'font-style',
        'font-variant',
        'font-weight',
        'glyph-orientation-horizontal',
        'glyph-orientation-vertical',
        'image-rendering',
        'kerning',
        'letter-spacing',
        'lighting-color',
        'marker-end',
        'marker-mid',
        'marker-start',
        'mask',
        'opacity',
        'overflow',
        'pointer-events',
        'shape-rendering',
        'solid-color',
        'solid-opacity',
        'stop-color',
        'stop-opacity',
        'stroke',
        'stroke-dasharray',
        'stroke-dashoffset',
        'stroke-linecap',
        'stroke-linejoin',
        'stroke-miterlimit',
        'stroke-opacity',
        'stroke-width',
        'text-anchor',
        'text-decoration',
        'text-rendering',
        'transform',
        'unicode-bidi',
        'vector-effect',
        'visibility',
        'word-spacing',
        'writing-mode'
    ];

    const attrs = $svg.attr();
    const attrList = [];
    Object.keys(attrs).forEach(k => {
        if (keys.includes(k)) {
            attrList.push(`${k}="${attrs[k]}"`);
        }
    });

    attrList.sort();

    return attrList;
};


const generateSvgSymbol = (config) => {
    
    const list = [];
    const contentSet = new Set();
    const idMap = {};

    config.svgList.forEach(item => {

        //svgo optimize
        const svgoConfig = {
            ... config.svgo,
            path: item.filePath
        };
        const result = optimize(item.content, svgoConfig);

        const $optimizedDoc = cheerio.load(result.data, {
            xmlMode: true
        });
        
        const $optimizedSvg = $optimizedDoc('svg');

        if ($optimizedSvg.length === 0) {
            logError(`ERROR: Not found svg tag: ${item.filePath}`);
            return;
        }
        
        const id = item.name;
        if (idMap[id]) {
            logError(`ERROR: Ignore file: ${item.filePath}, the same name already exists: ${idMap[id]}`);
            return;
        }
        idMap[id] = item.filePath;

        const optimizedContent = $optimizedSvg.html();
        
        //==================================================================
        //some attrs will be removed from optimized svg include viewBox
        //generate info from original svg
        const $originalDoc = cheerio.load(item.content, {
            xmlMode: true
        });

        const $originalSvg = $originalDoc('svg');

        if (typeof config.onSVGAttribute === 'function') {
            config.onSVGAttribute.call(config, $originalSvg, item);
        }

        const viewBox = $originalSvg.attr('viewBox');
        const preserveAspectRatio = $originalSvg.attr('preserveAspectRatio');
        const attrList = getSvgAttrList($originalSvg);

        //console.log(attrList);

        let content = optimizedContent;
        if (attrList.length) {
            content = `<g ${attrList.join(' ')}>${content}</g>`;
        }

        // if (!viewBox) {
        //     console.log(`before: ${id} no viewBox`);
        // }
        

        //==================================================================

        list.push({
            id,
            viewBox,
            preserveAspectRatio,
            content
        });

        contentSet.add(content);

    });

    //repeated content handler
    const contents = Array.from(contentSet);
    list.forEach(function(item) {
        item.content = contents.indexOf(item.content);
    });

    if (list.length) {
        console.log(`[${config.name}] Converted svg files: ${EC.green(list.length)}`);
    } else {
        logError('ERROR: Nothing to convert');
    }
    
    config.metadata = Object.assign(config.metadata, {
        name: config.name,
        //if need custom prefix but not same with name
        prefix: config.prefix || `${config.name}-`,
        list,
        contents
    });
    
};

const getOutputName = (v, name, ext) => {
    if (v === true) {
        return `${name}.${ext}`;
    }
    return v;
};


const outputRuntimeLibHandler = (config) => {

    const outputRuntimeLib = getOutputName(config.outputRuntimeLib, config.name, 'js');
    if (!outputRuntimeLib) {
        return;
    }

    //generate input temp file
    const compressedStr = compress(JSON.stringify(config.metadata));

    const libDist = readFileContentSync(path.resolve(__dirname, 'runtime/dist/template.js'));

    const libStr = replace(libDist, {
        replace_holder_runtime_lib_name: config.name,
        replace_holder_compressed_str: compressedStr
    });

    const libPath = path.resolve(config.outputDir, outputRuntimeLib);
    const libSaved = writeFileContentSync(libPath, libStr);
    if (libSaved) {
        logSuccess(`Saved svg lib file: ${relativePath(libPath)}`);
    }

};

const outputHandler = (config) => {

    const outputJson = getOutputName(config.outputJson, config.name, 'json');
    if (outputJson) {
        const jsonPath = path.resolve(config.outputDir, outputJson);
        const jsonSaved = writeFileContentSync(jsonPath, JSON.stringify(config.metadata, null, 4));
        if (jsonSaved) {
            logSuccess(`Saved svg metadata json: ${relativePath(jsonPath)}`);
        }
    }
    
    const outputSvg = getOutputName(config.outputSvg, config.name, 'svg');
    if (outputSvg) {
        const svgPath = path.resolve(config.outputDir, outputSvg);
        const svgSymbol = format(getSvgSymbolContent(config.metadata, config.inlineSvg));

        config.svgSymbol = svgSymbol;
        const svgSaved = writeFileContentSync(svgPath, svgSymbol);
        if (svgSaved) {
            logSuccess(`Saved svg symbol json: ${relativePath(svgPath)}`);
        }
    }

    outputRuntimeLibHandler(config);
    
};

const svgToSymbol = (_config) => {

    const config = {
        ... defaultConfig,
        ... _config
    };

    if (_config.svgo) {
        config.svgo = {
            ... defaultConfig.svgo,
            ... _config.svgo
        };
    }

    //console.log(config);
    generateSvgList(config);
    generateSvgSymbol(config);

    outputHandler(config);
    
    return config;
};

module.exports = svgToSymbol;