class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    collidesWithPlayer() {
        return Math.abs(PLAYER.x - this.x) < CONFIG.obstacleRadiusX &&
            Math.abs(PLAYER.y - this.y) < CONFIG.obstacleRadiusY
    }

    render() {
        CTX.fillStyle = '#f00';
        CTX.fillRect(
            this.x - CONFIG.obstacleRadiusX,
            this.y - CONFIG.obstacleRadiusY,
            CONFIG.obstacleRadiusX * 2,
            CONFIG.obstacleRadiusY * 2,
        );
    }
}
