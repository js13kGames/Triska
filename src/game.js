onload = () => {
    console.log('loaded ya');

    CANVAS = can;
    CANVAS.width = CONFIG.width;
    CANVAS.height = CONFIG.height;

    CTX = CANVAS.getContext('2d');

    resetGame();

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

onclick = (e) => {
    if (MENU) {
        const rect = CANVAS.getBoundingClientRect();
        const x = (e.pageX - rect.left) / rect.width * CONFIG.width;
        const y = (e.pageY - rect.top) / rect.height * CONFIG.height;

        MENU.buttons.forEach((b) => {
            if (Math.abs(b.x - x) < b.radiusX && Math.abs(b.y - y) < b.radiusY) {
                b.onClick();
            }
        })
    } else {
        PLAYER.jump();
    }
};

renderFrame = () => {
    CTX.fillStyle = '#000';
    CTX.fillRect(0, 0, CONFIG.width, CONFIG.height);

    CTX.wrap(() => {
        CTX.translate(0, -CAMERA.topY);

        if (Date.now() < CAMERA_SHAKE_END) {
            CTX.translate(
                Math.random() * CONFIG.shakeFactor * 2 + CONFIG.shakeFactor,
                Math.random() * CONFIG.shakeFactor * 2 + CONFIG.shakeFactor,
            );
        }

        // Walls
        CTX.fillStyle = '#000';
        CTX.fillRect(0, CAMERA.topY, CONFIG.wallX, CONFIG.height);
        CTX.fillRect(CONFIG.width, CAMERA.topY, -CONFIG.wallX, CONFIG.height);

        // Background color
        CTX.fillStyle = Date.now() < CAMERA_SHAKE_END ? '#900' : '#c8caca';
        CTX.fillRect(CONFIG.wallX, CAMERA.topY, CONFIG.width - CONFIG.wallX * 2, CONFIG.height);

        // Background trees
        CTX.fillStyle = BACKGROUND_PATTERN;
        CTX.fillRect(CONFIG.wallX, CAMERA.topY, CONFIG.width - CONFIG.wallX * 2, CONFIG.height);

        // Obstacles
        OBSTACLES.forEach((o) => o.render());

        if (MENU) CTX.globalAlpha = 1 - MENU.alpha;

        // Ground
        CTX.fillStyle = '#000';
        CTX.fillRect(0, CONFIG.playerRadius, CONFIG.width, CONFIG.groundHeight);

        // Player
        PLAYER.render();
    });

    if (MENU) CTX.wrap(() => MENU.render());
};

resetGame = () => {
    resetPlayer();
    MENU = new MainMenu();
};

resetPlayer = () => {
    PLAYER = new Player();
    CAMERA = new Camera();
    OBSTACLES = [];
};

cycle = (elapsed) => {
    if (!MENU || MENU.dismissed) {
        GAME_DURATION += elapsed;
    } else {
        GAME_DURATION = 0;
    }

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
