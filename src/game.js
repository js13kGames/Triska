onload = () => {
    console.log('loaded ya');

    CANVAS = can;
    CANVAS.width = CONFIG.width;
    CANVAS.height = CONFIG.height;

    CTX = CANVAS.getContext('2d');

    resetPlayer();

    onresize();

    animationFrame();
};

onresize = () => {
    const ratio = CONFIG.width / CONFIG.height;

    let width, height;
    if (innerWidth / innerHeight < ratio) {
        width = innerWidth;
        height = innerWidth / ratio;
    } else {
        height = innerHeight;
        width = innerHeight * ratio;
    }

    inner.style.width = `${width}px`;
    inner.style.height = `${height}px`;
};

animationFrame = () => {
    const now = performance.now();
    const elapsed = (now - LAST_FRAME) / 1000;
    LAST_FRAME = now;

    cycle(elapsed);
    renderFrame();

    requestAnimationFrame(animationFrame);
};

onclick = () => {
    PLAYER.jump();
};

renderFrame = () => {
    CTX.fillStyle = '#fff';
    CTX.fillRect(0, 0, CONFIG.width, CONFIG.height);

    CTX.fillStyle = '#000';
    CTX.fillRect(0, 0, CONFIG.wallX, CONFIG.height);
    CTX.fillRect(CONFIG.width, 0, -CONFIG.wallX, CONFIG.height);

    CTX.wrap(() => {
        CTX.translate(0, -CAMERA.topY);

        if (Date.now() < CAMERA_SHAKE_END) {
            CTX.translate(
                Math.random() * CONFIG.shakeFactor * 2 + CONFIG.shakeFactor,
                Math.random() * CONFIG.shakeFactor * 2 + CONFIG.shakeFactor,
            );
        }

        CTX.fillStyle = BACKGROUND_PATTERN;
        CTX.fillRect(CONFIG.wallX, CAMERA.topY, CONFIG.width - CONFIG.wallX * 2, CONFIG.height);

        // Ground
        CTX.fillStyle = '#000';
        CTX.fillRect(0, CONFIG.playerRadius, CONFIG.width, CONFIG.groundHeight);

        OBSTACLES.forEach((o) => o.render());

        PLAYER.render();
    });
};

resetPlayer = () => {
    PLAYER = new Player();
    CAMERA = new Camera();
    OBSTACLES = [];
};

cycle = (elapsed) => {
    PLAYER.cycle(elapsed);
    CAMERA.cycle(elapsed);

    if (!OBSTACLES.length || OBSTACLES[OBSTACLES.length - 1].y >= CAMERA.topY) {
        generateNewObstacles();
    }
};

generateNewObstacles = () => {
    let y = Math.min(
        CAMERA.topY - CONFIG.obstacleRadiusY,
        CONFIG.obstaclesStartY,
    );

    for (let i = 0 ; i < 10 ; i++) {
        OBSTACLES.push(new Obstacle(
            Math.random() < 0.5 ? CONFIG.wallX : CONFIG.width - CONFIG.wallX,
            y,
        ));

        y -= Math.random() * 300 + 100;
    }
};
