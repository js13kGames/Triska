onload = () => {
    console.log('loaded ya');

    CANVAS = can;
    CANVAS.width = CONFIG.width;
    CANVAS.height = CONFIG.height;

    CTX = CANVAS.getContext('2d');

    onresize();

    renderFrame();
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

renderFrame = () => {
    CTX.fillStyle = '#fff';
    CTX.fillRect(0, 0, CONFIG.width, CONFIG.height);

    CTX.fillStyle = '#000';
    CTX.fillRect(0, 0, CONFIG.wallX, CONFIG.height);
    CTX.fillRect(CONFIG.width, 0, -CONFIG.wallX, CONFIG.height);
};
