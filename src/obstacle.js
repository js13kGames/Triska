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
        CTX.fillStyle = '#000';

        CTX.beginPath();

        const halfSpikeHeight = CONFIG.obstacleRadiusY / CONFIG.obstacleSpikeCount;
        for (let y = this.y - CONFIG.obstacleRadiusY ; y < this.y + CONFIG.obstacleRadiusY ; y += halfSpikeHeight * 2) {
            CTX.lineTo(
                this.x,
                y,
            );
            CTX.lineTo(
                this.x + CONFIG.obstacleRadiusX * Math.sign(CONFIG.width / 2 - this.x),
                y + halfSpikeHeight,
            );
        }

        CTX.lineTo(this.x, this.y + CONFIG.obstacleRadiusY);

        CTX.fill();
    }
}
