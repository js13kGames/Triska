'use strict';

const { minify } = require("terser");
const { copyFile, mkdir, writeFile, readFile, stat } = require('fs/promises');
const fs = require('fs');
const archiver = require('archiver');
const del = require('del');

const files = [
    'src/config.js',
    'src/globals.js',
    'src/graphics.js',
    'src/utils.js',
    'src/game.js',
    'src/camera.js',
    'src/player.js',
    'src/obstacle.js',
    'src/menu.js',
    'src/main-menu.js',
];

(async () => {
    try {
        const allContents = await Promise.all(files.map((file) => {
            return readFile(file);
        }));

        await del('dist/');
        await del('game.zip');
        await mkdir('dist/');

        await copyFile('src/style.css', 'dist/style.css');
        await copyFile('src/index.html', 'dist/index.html');

        const minified = await minify(allContents.map((buffer) => {
            return buffer.toString();
        }).join('\n'));

        await writeFile('dist/index.js', minified.code);

        await new Promise((resolve, reject) => {
            const output = fs.createWriteStream('game.zip');
            output.on('error', reject);
            output.on('close', resolve);

            const archive = archiver('zip', {
                zlib: { level: 9 }
            });
            archive.directory('dist/', false);
            archive.pipe(output);
            archive.finalize();
        })

        const stats = await stat('game.zip');
        const maxSize = 13 * 1024;

        console.log(`${stats.size} / ${maxSize} (${Math.round(stats.size * 100 / maxSize)}%)`);
    } catch (err) {
        console.error(err);
    }
})();
