const fs = require('fs');
const path = require('path');
const EC = require('eight-colors');
const cheerio = require('cheerio');
const format = require('xml-formatter');
const compress = require('lz-utils/lib/compress.js');
const { optimize } = require('svgo');

const defaultConfig = require('./config.js');
const getSvgSymbolContent = require('./get-svg-symbol-content.js');

const logError = (str) => {
    console.log(EC.red(str));
};

const logWarn = (str) => {
    console.log(EC.yellow(str));
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
        logError(`ERROR: Not found dir: ${dir}`);
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
            } else {
                logWarn(`WARN: Ignore file which is not *.svg: ${relPath}`);
            }
        }
    });
};

const generateSvgFiles = (config) => {
    let dirs = config.dirs;
    if (!Array.isArray(dirs)) {
        dirs = [dirs];
    }
    const files = [];
    for (const dir of dirs) {
        forEachSvg(dir, function(svgPath) {
            files.push(svgPath);
        });
    }
    return files;
};

const generateSvgList = (config) => {

    const files = generateSvgFiles(config);
    console.log(`Found svg files: ${EC.green(files.length)}`);

    const svgList = [];

    files.forEach(filePath => {
        //file name check, filename will be icon id
        const filename = path.basename(filePath);
        const nameReg = /^[a-z0-9-.]+$/g;
        const nameTest = nameReg.test(filename);
        //console.log(nameTest);
        if (!nameTest) {
            logError(`ERROR: Expecting filename to be "lowercase-dashed.svg": ${filePath}`);
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
            filename,
            content
        });
    });

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

        const id = path.basename(item.filename, '.svg');
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

        const viewBox = $originalSvg.attr('viewBox');
        const preserveAspectRatio = $originalSvg.attr('preserveAspectRatio');
        const attrList = getSvgAttrList($originalSvg);

        //console.log(attrList);

        let content = optimizedContent;
        if (attrList.length) {
            content = `<g ${attrList.join(' ')}>${content}</g>`;
        }

        // if (!viewBox) {
        //     console.log(`before: ${item.filename} no viewBox`);
        // }
        

        //==================================================================

        list.push({
            id: id,
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
        console.log(`Converted svg files: ${EC.green(list.length)}`);
    } else {
        logError('ERROR: Nothing to convert');
    }
    
    config.metadata = Object.assign(config.metadata, {
        name: config.name,
        //if need custom prefix but not same with name
        prefix: config.prefix || `${config.name}-`,
        headers: config.headers,
        list,
        contents
    });
    
};

const outputRuntimeLibHandler = (config) => {

    if (!config.outputRuntimeLib) {
        return;
    }

    //generate input temp file
    const compressedStr = compress(JSON.stringify(config.metadata));

    const libDist = readFileContentSync(path.resolve(__dirname, 'runtime/dist/template.js'));

    const libStr = replace(libDist, {
        replace_holder_runtime_lib_name: config.name,
        replace_holder_compressed_str: compressedStr
    });

    const libPath = path.resolve(config.outputDir, config.outputRuntimeLib);
    const libSaved = writeFileContentSync(libPath, libStr);
    if (libSaved) {
        logSuccess(`Saved svg lib file: ${relativePath(libPath)}`);
    }

};


const outputHandler = (config) => {

    if (config.outputJson) {
        const jsonPath = path.resolve(config.outputDir, config.outputJson);
        const jsonSaved = writeFileContentSync(jsonPath, JSON.stringify(config.metadata, null, 4));
        if (jsonSaved) {
            logSuccess(`Saved svg metadata json: ${relativePath(jsonPath)}`);
        }
    }
    
    if (config.outputSvg) {
        const svgPath = path.resolve(config.outputDir, config.outputSvg);
        const svgSymbol = format(getSvgSymbolContent(config.metadata, config.inlineSvg));

        config.svgSymbol = svgSymbol;
        const svgSaved = writeFileContentSync(svgPath, svgSymbol);
        if (svgSaved) {
            logSuccess(`Saved svg symbol json: ${relativePath(svgPath)}`);
        }
    }

    outputRuntimeLibHandler(config);
    
};

const svgToSymbol = (config) => {
    const svgoConfig = {
        ... defaultConfig.svgo,
        ... config.svgo
    };
    config = {
        ... defaultConfig,
        ... config,
        svgo: svgoConfig
    };

    //console.log(config);
    generateSvgList(config);
    generateSvgSymbol(config);

    outputHandler(config);
    
    return config;
};

module.exports = svgToSymbol;