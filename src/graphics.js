createCanvas = (width, height, render) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    render(ctx, canvas);

    return canvas;
};

createPattern = (width, height, render) => {
    const canvas = createCanvas(width, height, render);
    const ctx = canvas.getContext('2d');
    return ctx.createPattern(canvas, 'repeat');
};

BACKGROUND_PATTERN = createPattern(100, 100, (ctx) => {
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, 100, 50);
})
