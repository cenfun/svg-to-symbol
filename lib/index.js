const fs = require('fs');
const os = require('os');
const path = require('path');
const EC = require('eight-colors');
const cheerio = require('cheerio');
const format = require('xml-formatter');
const compress = require('lz-utils/lib/compress.js');
const { optimize } = require('svgo');

const defaultConfig = require('./config.js');
const getSvgSymbolContent = require('./runtime/get-svg-symbol-content.js');

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

const generateSvgFiles = (config) => {
    let dirs = config.dirs;
    if (!Array.isArray(dirs)) {
        dirs = [dirs];
    }
    let files = [];
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
            logError(`ERROR: Not found dir: ${dir}`);
            continue;
        }
        const dfs = fs.readdirSync(dir);
        const ls = dfs.map(f => {
            return path.resolve(dir, f);
        });
        files = files.concat(ls);
    }
    return files;
};

const generateSvgList = (config) => {

    const files = generateSvgFiles(config);

    const svgList = [];

    let hasInvalidFilename = false;
    files.forEach(filePath => {
        const relPath = relativePath(filePath);
        if (path.extname(filePath) !== '.svg') {
            logWarn(`WARN: Ignore file which is not *.svg: ${relPath}`);
            return;
        }

        //file name check, filename will be icon id
        const filename = path.basename(filePath);
        const nameReg = /^[a-z0-9-.]+$/g;
        const nameTest = nameReg.test(filename);
        //console.log(nameTest);
        if (!nameTest) {
            logError(`ERROR: Invalid svg filename: ${relPath}`);
            hasInvalidFilename = true;
            return;
        }

        //content
        const content = readFileContentSync(filePath);
        if (!content) {
            logError(`ERROR: Invalid svg file content: ${relPath}`);
            return;
        }

        //get title for metadata
        //https://css-tricks.com/svg-symbol-good-choice-icons/
        const $svg = cheerio.load(content, {
            xmlMode: true
        })('svg');
        const title = $svg.find('title').text() || '';
        const desc = $svg.find('desc').text() || '';
        const viewBox = $svg.attr('viewBox') || '';

        //svgo
        const svgoConfig = {
            ... config.svgo,
            path: relPath
        };
        const result = optimize(content, svgoConfig);

        svgList.push({
            filePath: relPath,
            filename,
            title,
            desc,
            viewBox,
            content: result.data
        });
    });

    if (hasInvalidFilename) {
        logWarn('WARN: Expecting filename to be: lowercase-dashed/lowercase-dashed.svg');
    }

    //console.log(svgList);

    console.log(`Found svg files: ${EC.green(svgList.length)}`);
    config.svgList = svgList;

};


const generateSvgSymbol = (config) => {
    
    const list = [];

    config.svgList.forEach(item => {
        const $ = cheerio.load(item.content, {
            xmlMode: true
        });
        
        const $svg = $('svg');

        if ($svg.length === 0) {
            logError(`ERROR: Not found svg tag: ${item.filePath}`);
            return;
        }

        const id = path.basename(item.filename, '.svg');
        const content = $svg.html();

        list.push({
            id: id,
            title: item.title,
            desc: item.desc,
            viewBox: item.viewBox,
            content: content
        });

    });

    if (list.length) {
        config.metadata = {
            headers: config.headers,
            prefix: config.prefix,
            list
        };
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

    if (config.outputLib) {
        const runtimeLibPath = 'svg-to-symbol/lib/runtime/index.js';
        let compressedList = [
            `const svgToSymbolLib = require('${runtimeLibPath}');`,
            `const compressedStr = '${compress(JSON.stringify(config.metadata))}';`,
            'module.exports = svgToSymbolLib(compressedStr);'
        ];
        if (config.esModule) {
            compressedList = [
                `import svgToSymbolLib from '${runtimeLibPath}';`,
                `const compressedStr = '${compress(JSON.stringify(config.metadata))}';`,
                'export default svgToSymbolLib(compressedStr);'
            ];
        }

        const compressedPath = path.resolve(config.outputDir, config.outputLib);
        const compressedSaved = writeFileContentSync(compressedPath, compressedList.join(os.EOL));
        if (compressedSaved) {
            logSuccess(`Saved svg lib: ${relativePath(compressedPath)}`);
        }
    }
    
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

    if (config.metadata) {
        outputHandler(config);
    }
    
    return config;
};

module.exports = svgToSymbol;