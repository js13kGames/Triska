onload = () => {
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

onmousedown = onkeydown = () => MOUSE_DOWN = true;
onmouseup = ontouchcancel = onkeyup = () => MOUSE_DOWN = false;

ontouchstart = (e) => {
    onmousemove(e.touches[0]);
    onmousedown(e);
};

ontouchend = (e) => onclick(e.touches[0]);

onmousemove = (e) => {
    const rect = CANVAS.getBoundingClientRect();
    MOUSE_POSITION = {
        'x': (e.pageX - rect.left) / rect.width * CONFIG.width,
        'y': (e.pageY - rect.top) / rect.height * CONFIG.height,
    };

    if (MENU && MENU.highlightedButton(MOUSE_POSITION)) {
        CANVAS.style.cursor = 'pointer';
    } else {
        CANVAS.style.cursor = 'default';
    }
};

onclick = (e) => {
    if (MENU) {
        const button = MENU.highlightedButton(MOUSE_POSITION);
        if (button) button.onClick();
    } else {
        // if (!WAIT_FOR_RELEASE) {
        //     // PLAYER.jump();
        //     WAIT_FOR_RELEASE = true;
        // }
    }
};

renderFrame = () => {
    CTX.fillStyle = '#000';
    CTX.fillRect(0, 0, CONFIG.width, CONFIG.height);

    CTX.wrap(() => {
        if (Date.now() < CAMERA_SHAKE_END) {
            CTX.translate(
                Math.random() * CONFIG.shakeFactor * 2 + CONFIG.shakeFactor,
                Math.random() * CONFIG.shakeFactor * 2 + CONFIG.shakeFactor,
            );
        }

        // Walls
        CTX.fillStyle = '#000';
        CTX.fillRect(0, CAMERA.topY, CONFIG.wallX, CONFIG.height);
        CTX.fillRect(CONFIG.width, 0, -CONFIG.wallX, CONFIG.height);

        // Background color
        CTX.fillStyle = Date.now() < CAMERA_SHAKE_END ? '#900' : '#c8caca';
        CTX.fillRect(CONFIG.wallX, 0, CONFIG.width - CONFIG.wallX * 2, CONFIG.height);

        // Background trees
        BACKGROUND_PATTERNS.forEach((pattern, i) => {
            CTX.fillStyle = pattern;

            const distance = Math.abs(Math.sin(1 + i * 2));

            const offset = CAMERA.topY * 0.8 * (1 - distance / 4);
            CTX.wrap(() => {
                CTX.globalAlpha = 1 - distance / 2;
                CTX.translate(0, -offset);
                CTX.fillRect(CONFIG.wallX, offset, CONFIG.width - CONFIG.wallX * 2, CONFIG.height);
            });
        });

        CTX.translate(0, -CAMERA.topY);

        // Obstacles
        OBSTACLES.forEach((o) => o.render());
        ITEMS.forEach((i) => i.render());

        DEATHS.forEach(death => renderDeath(CTX, death.x, death.y));

        if (MENU) CTX.globalAlpha = 1 - MENU.alpha;
        if (GAME_DURATION === 0) return;

        // Ground
        CTX.fillStyle = '#000';
        CTX.fillRect(0, CONFIG.playerRadius + 10, CONFIG.width, CONFIG.groundHeight);

        // Player
        PLAYER.render();
    });

    if (!MENU && PLAYER.distance) {
        CTX.fillStyle = '#b12a34'
        CTX.textBaseline = 'top';
        CTX.textAlign = 'left';
        CTX.font = '18pt Courier';
        CTX.fillText(`${PLAYER.distance}M`, CONFIG.wallX + 15, 15);

        CTX.wrap(() => {
            CTX.translate(CONFIG.width / 2, 25);

            const scale = 1 + Math.min(0.1, Math.abs(RENDERED_POWER - PLAYER.power));

            if (RENDERED_POWER < PLAYER.power) {
                CTX.scale(scale, scale);
            }

            renderGauge(CTX, RENDERED_POWER);
        });
    }

    if (MENU) CTX.wrap(() => MENU.render());
};

resetGame = () => {
    resetPlayer();
    MENU = new MainMenu();
};

resetPlayer = () => {
    RNG = createNumberGenerator(1);
    PLAYER = new Player();
    CAMERA = new Camera();
    OBSTACLES = [];
    ITEMS = [];
};

cycle = (elapsed) => {
    if (!MENU || MENU.dismissed) {
        GAME_DURATION += elapsed;
    } else {
        GAME_DURATION = 0;
    }

    if (!MOUSE_DOWN) {
        WAIT_FOR_RELEASE = false;
    }

    PLAYER.cycle(elapsed);
    CAMERA.cycle(elapsed);
    ITEMS.forEach(i => i.cycle(elapsed));

    const appliedDiff = Math.max(-elapsed * 0.5, Math.min(elapsed * 0.5, PLAYER.power - RENDERED_POWER));
    RENDERED_POWER += appliedDiff;

    if (!OBSTACLES.length || OBSTACLES[OBSTACLES.length - 1].y >= CAMERA.topY) {
        generateNewObstacle();
    }
};

generateNewObstacle = () => {
    const lastObstacleY = OBSTACLES.length ? OBSTACLES[OBSTACLES.length - 1].y : CONFIG.obstaclesStartY;

    const difficulty = Math.min(1, OBSTACLES.length / 20);
    const minSpacing = CONFIG.obstacleRadiusY * 2 + 200 + (1 - difficulty) * 400;
    const extraSpacing = (1 - difficulty) * 500;

    const doubleProbability = difficulty * 0.2;

    const xRng = RNG() < 0.5;

    const obstacle = new Obstacle(
        xRng ? CONFIG.wallX : CONFIG.width - CONFIG.wallX,
        lastObstacleY - (RNG() * extraSpacing + minSpacing),
    );
    OBSTACLES.push(obstacle);

    if (RNG() < doubleProbability) {
        OBSTACLES.push(new Obstacle(
            !xRng ? CONFIG.wallX : CONFIG.width - CONFIG.wallX,
            obstacle.y,
        ));
    }

    if (RNG() < 0.5) {
        ITEMS.push(new Item(
            CONFIG.wallX * 2 + RNG() * (CONFIG.width - CONFIG.wallX * 4),
            obstacle.y + RNG() * 100,
        ));
    }
};

updateHighscore = (score) => {
    localStorage['hs'] = Math.max(highscore(), score);
};

highscore = () => {
    return parseInt(localStorage['hs']) || 0;
};
