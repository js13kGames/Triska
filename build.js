const { minify } = require("terser");
const fs = require('fs');

const files = [
    'src/game.js',
];

const total = files.map((file) => {
    return fs.readFileSync(file).toString();
}).join('\n');

minify(total)
    .then((res) => fs.writeFileSync('dist/index.js', res.code));
