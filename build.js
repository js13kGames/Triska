const { minify } = require("terser");
const fs = require('fs');

const files = [
    'src/config.js',
    'src/globals.js',
    'src/game.js',
];

fs.copyFileSync('src/style.css', 'dist/style.css');
fs.copyFileSync('src/index.html', 'dist/index.html');

const total = files.map((file) => {
    return fs.readFileSync(file).toString();
}).join('\n');

minify(total)
    .then((res) => fs.writeFileSync('dist/index.js', res.code));
