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

BACKGROUND_PATTERN = createPattern(640, 400, (ctx) => {
    ctx.fillStyle = '#c8caca';
    ctx.fillRect(0, 0, 640, 400);

    ctx.fillStyle = '#bbbcbc';
    ctx.fillRect(100, 0, -10, 20);
    ctx.fillRect(100, 0, 30, 400);

    ctx.fillRect(200, 0, 20, 400);
    ctx.fillRect(220, 200, 10, 20);

    ctx.fillRect(300, 0, 40, 400);
    ctx.fillRect(300, 300, -10, 30);

    ctx.fillRect(400, 0, 20, 400);
    ctx.fillRect(400, 150, -10, 10);
})
