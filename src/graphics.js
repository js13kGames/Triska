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
    ctx.fillStyle = '#bbbcbc';
    ctx.fillRect(100, 0, -10, 20);
    ctx.fillRect(100, 0, 30, 400);

    ctx.fillRect(200, 0, 20, 400);
    ctx.fillRect(220, 200, 10, 20);

    ctx.fillRect(300, 0, 40, 400);
    ctx.fillRect(300, 300, -10, 30);

    ctx.fillRect(400, 0, 20, 400);
    ctx.fillRect(400, 150, -10, 10);
});

renderCat = (ctx, paws) => {
    const CAT_RADIUS_X = 15;
    const CAT_RADIUS_Y = 20;
    const BANDANA_HEIGHT = 15;
    const EYE_GAP = 8;
    const X_RADIUS = 5;
    const WHISKER_LENGTH = 24;

    // Body
    ctx.fillStyle = ctx.strokeStyle = '#000';
    ctx.fillRect(-CAT_RADIUS_X, -CAT_RADIUS_Y, CAT_RADIUS_X * 2, CAT_RADIUS_Y * 2);

    // Paws
    if (paws) {
        ctx.fillRect(0, 0, CAT_RADIUS_X + 5, 4);
        ctx.fillRect(0, 12, CAT_RADIUS_X + 5, 4);
    }

    // Ears
    ctx.beginPath();
    ctx.arc(0, -CAT_RADIUS_Y - CAT_RADIUS_X, CAT_RADIUS_X, Math.PI, 0, true);
    ctx.lineTo(CAT_RADIUS_X, -CAT_RADIUS_Y);
    ctx.lineTo(-CAT_RADIUS_X, -CAT_RADIUS_Y);
    ctx.fill();

    // Bandana
    ctx.fillStyle = ctx.strokeStyle = '#b12a34';
    ctx.fillRect(-CAT_RADIUS_X, -CAT_RADIUS_Y, CAT_RADIUS_X * 2, BANDANA_HEIGHT);

    // Medallion
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 7, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-CAT_RADIUS_X, 0);
    ctx.lineTo(0, 5);
    ctx.lineTo(CAT_RADIUS_X, 0);
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '4pt Courier';
    ctx.fillText('13', 0, 7.5);

    // Whiskers
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    [-1, 1].forEach((sign) => ctx.wrap(() => {
        ctx.translate(0, -CAT_RADIUS_Y + BANDANA_HEIGHT);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(sign * WHISKER_LENGTH, -2);

        ctx.moveTo(0, 0);
        ctx.lineTo(sign * WHISKER_LENGTH, 2);

        ctx.stroke();
    }));

    ctx.fillStyle = '#fff';

    // Eyes
    [-EYE_GAP, EYE_GAP].forEach((x) => ctx.wrap(() => {
        ctx.translate(x, -CAT_RADIUS_Y + BANDANA_HEIGHT / 2 + 2);

        if (Date.now() % 5000 < 100) {
            ctx.scale(1, 0.1);
        }

        // ctx.scale(0.5, 1);
        ctx.beginPath();
        ctx.arc(0, 0, BANDANA_HEIGHT / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.scale(0.3, 1);
        ctx.beginPath();
        ctx.arc(0, 0, BANDANA_HEIGHT / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
    }));

    // Snoot
    ctx.beginPath();
    ctx.arc(0, -CAT_RADIUS_Y + BANDANA_HEIGHT, 2, 0, Math.PI * 2, true);
    ctx.fill();

    // Tail
    const tipX = Math.sin(Date.now() / 1000 * Math.PI * 2 / 2) * 3;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, CAT_RADIUS_Y - ctx.lineWidth);
    ctx.bezierCurveTo(
        -25, CAT_RADIUS_Y + 2,
        -25, CAT_RADIUS_Y - 10,
        -25 + tipX, CAT_RADIUS_Y - 18,
    );

    ctx.stroke();
};

renderDeath = (ctx, x, y) => {
    ctx.fillStyle = '#b12a34';

    [Math.PI / 4, -Math.PI / 4].forEach((angle) => ctx.wrap(() => {
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillRect(-15, -4, 30, 8);
    }));
};
