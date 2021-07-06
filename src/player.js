class Trail {
    constructor() {
        this.startTime = Date.now();
        this.x = PLAYER.x;
        this.y = PLAYER.y;
    }

    get alpha() {
        return 1 - ((Date.now() - this.startTime) / 1000) / CONFIG.trailFadeDuration;
    }
}

class Player {
    constructor() {
        this.x = CONFIG.width / 2;
        this.y = 0;
        this.vY = 0;
        this.direction = 0;
        this.dead = 0;

        this.trails = [];
    }

    cycle(elapsed) {
        let velocityX = CONFIG.velocityX;
        if (this.dead) {
            velocityX *= 0.2;
        }

        this.x += this.direction * velocityX * elapsed;
        this.x = Math.max(CONFIG.wallX, this.x);
        this.x = Math.min(CONFIG.width - CONFIG.wallX, this.x);

        let gravity = CONFIG.gravity;
        if (this.vY < 0 && this.onWall) {
            gravity *= 4;
        } else if (this.onWall) {
            gravity *= 0.5;
        }

        this.vY += gravity * elapsed;
        this.y += this.vY * elapsed;
        this.y = Math.min(0, this.y);

        while (this.trails.length && this.trails[0].alpha <= 0) {
            this.trails.shift();
        }

        if (!this.dead && !this.onWall && this.y !== 0) {
            this.trails.push(new Trail());
        }

        for (const obstacle of OBSTACLES) {
            if (obstacle.collidesWithPlayer()) {
                this.die();
            }
        }

        if (this.y >= CAMERA.bottomY) {
            this.die();
        }
    }

    die() {
        if (this.dead) {
            return;
        }

        this.dead = true;
        this.vY = Math.max(this.vY, 0);
        this.direction = Math.sign((CONFIG.width / 2 - this.x));

        CAMERA_SHAKE_END = Date.now() + CONFIG.shakeDuration * 1000;
    }

    get onWall() {
        return this.x === CONFIG.wallX || this.x === CONFIG.width - CONFIG.wallX;
    }

    jump() {
        if (this.y !== 0 && !this.onWall) {
            return;
        }

        if (this.dead) {
            return;
        }

        this.direction = this.direction * -1 || 1;
        this.vY = -CONFIG.jumpVY + Math.min(this.vY, 0);
    }

    render() {
        this.trails.forEach((trail) => {
            const alpha = trail.alpha;
            if (alpha > 0) {
                this.renderPlayer(trail.x, trail.y, alpha);
            }
        });

        this.renderPlayer(this.x, this.y, 1);
    }

    renderPlayer(x, y, alpha) {
        CTX.wrap(() => {
            CTX.translate(x, y);
            CTX.globalAlpha = Math.max(0, Math.min(1, alpha));

            CTX.fillStyle = '#000';
            CTX.fillRect(
                -CONFIG.playerRadius,
                -CONFIG.playerRadius,
                CONFIG.playerRadius * 2,
                CONFIG.playerRadius * 2,
            );
        });
    }
}
