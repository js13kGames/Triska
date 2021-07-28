class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    collidesWithPlayer() {
        if (PLAYER.timeSinceSuperLucky < CONFIG.superLuckyRecoveryTime) {
            return false;
        }

        return Math.abs(PLAYER.x - this.x) < CONFIG.obstacleRadiusX &&
            Math.abs(PLAYER.y - this.y) < CONFIG.obstacleRadiusY
    }

    render() {
        if (CAMERA.bottomY < this.y - CONFIG.obstacleRadiusY || CAMERA.y > this.y + CONFIG.obstacleRadiusY) {
            return;
        }

        let addedX = 0;
        if (PLAYER.timeSinceSuperLucky < CONFIG.superLuckyRecoveryTime) {
            addedX = CONFIG.obstacleRadiusX * (CONFIG.superLuckyRecoveryTime - PLAYER.timeSinceSuperLucky) / CONFIG.superLuckyRecoveryTime;

            const period = 0.2;
            if (PLAYER.timeSinceSuperLucky % period > period / 2) {
                return;
            }
        }

        CTX.fillStyle = '#000';

        CTX.wrap(() => {
            CTX.translate(addedX * Math.sign(this.x - CONFIG.width / 2), 0);
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
        });
    }
}
