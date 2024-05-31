const path = require('path');
const { optimize, extendDefaultPlugins } = require('svgo');
const fsPromise = require('fs').promises;
const fs = require('fs');

const outputDir = path.join(__dirname, '../src/auto_gen');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const customPlugins = extendDefaultPlugins([
  { name: 'removeViewBox', active: false },
  // { name: 'removeDimensions', active: false },
  {
    name: 'cleanupIDs',
    params: {
      remove: false,
      minify: false,
      prefix: 'svg',
      force: true,
    },
  },
  {
    name: 'prefixIds',
    active: true,
  },
]);

async function run(srcPath, destPath) {
  try {
    const basePath = srcPath;
    const allfiles = await fsPromise.readdir(basePath);

    // read all svg files
    const svgStreams = await allfiles.map(async file => {
      const fileStream = await fsPromise
        .readFile(path.join(basePath, file))
        .catch(() => {
          // console.error(err);
          return true;
        });
      const fileName = file.replace('.svg', '');
      return {
        svgName: fileName,
        stream: await optimize(fileStream, {
          plugins: customPlugins,
        }),
      };
    });
    const svgContent = await Promise.all(
      svgStreams.map(a => a.catch(e => console.error(e)))
    );
    // Create a single svg file with svg html
    let str = `"use strict";\nvar svgs = {};\n`;
    svgContent.forEach((fc, index) => {
      if (fc && fc.stream && fc.stream.data)
        str += `svgs["${fc.svgName}"] =\n  '${fc.stream.data}';\n`;
      else console.error(`Error at ${index} with `, svgStreams[index]);
    });
    str += `module.exports = svgs;\n`;
    const writeFilePath = destPath;
    await fsPromise.writeFile(writeFilePath, str);
    console.log('SVGs generated at', destPath);
  } catch (err) {
    console.error(`Error while generating svgs ${destPath}`, err);
  }
}

// Generate common assets
const srcCommonAssetPath = path.join(__dirname, '../src/assets/svgs/');
const destCommonAssetPath = path.join(__dirname, '../src/assets/svgs.js');
run(srcCommonAssetPath, destCommonAssetPath);
