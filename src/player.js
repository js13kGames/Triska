class Trail {
    constructor() {
        this.startTime = Date.now();
        this.x = PLAYER.x;
        this.y = PLAYER.y;
        this.direction = PLAYER.direction || 1;
        this.rotation = PLAYER.rotation;
    }

    get alpha() {
        return 0.25 * (1 - ((Date.now() - this.startTime) / 1000) / CONFIG.trailFadeDuration);
    }
}

class Player {
    constructor() {
        this.x = CONFIG.width / 2;
        this.y = 0;
        this.vY = 0;
        this.direction = 0;
        this.dead = 0;
        this.rotation = 0;

        this.minY = this.y;

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
        } else if (MOUSE_DOWN) {
            gravity *= 0;
        }

        this.vY += gravity * elapsed;
        this.vY = Math.max(this.vY, -CONFIG.maxVY);

        this.y += this.vY * elapsed;
        this.y = Math.min(0, this.y);

        if (!MENU && MOUSE_DOWN && !WAIT_FOR_RELEASE && (this.onWall || !this.direction)) {
            this.jump();
            WAIT_FOR_RELEASE = true;
        }

        if (this.onWall) {
            this.rotation = 0;
        } else {
            this.rotation += elapsed * Math.PI * 8 * this.direction;
        }

        while (this.trails.length && this.trails[0].alpha <= 0) {
            this.trails.shift();
        }

        if (!this.dead && !this.onWall && this.y !== 0) {
            if (!this.trails.length || Date.now() - this.trails[this.trails.length - 1].startTime > 1000 / 30) {
                this.trails.push(new Trail());
            }
        }

        for (const obstacle of OBSTACLES) {
            if (obstacle.collidesWithPlayer()) {
                this.die();
            }
        }

        if (this.y >= CAMERA.bottomY) {
            this.die();
        }

        this.minY = Math.min(this.y, this.minY);
    }

    die() {
        if (this.dead) {
            return;
        }

        this.dead = true;
        this.vY = Math.max(this.vY, 0);
        this.direction = Math.sign((CONFIG.width / 2 - this.x));

        CAMERA_SHAKE_END = Date.now() + CONFIG.shakeDuration * 1000;

        DEATHS.push({'x': this.x, 'y': this.y, 'distance': this.distance})
        setTimeout(() => MENU = new MainMenu(), 1000);
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
        if (!this.direction) {
            CTX.wrap(() => {
                CTX.globalAlpha = Math.max(0, (GAME_DURATION - 1) / 0.3);
                CTX.fillStyle = '#888';
                CTX.textBaseline = 'middle';
                CTX.textAlign = 'center';
                CTX.font = '24pt Courier';
                CTX.fillText('CLICK TO JUMP', this.x, this.y - 300);
                CTX.fillText('HOLD TO GO HIGHER', this.x, this.y - 250);
            });
        }

        this.trails.forEach((trail) => {
            const alpha = trail.alpha;
            if (alpha > 0) {
                this.renderPlayer(
                    trail.x,
                    trail.y,
                    alpha,
                    trail.direction,
                    1,
                    trail.rotation,
                    false,
                    false,
                );
            }
        });

        let x = this.x;
        if (this.onWall) {
            x += Math.sign(CONFIG.width / 2 - this.x) * 18;
        }

        this.renderPlayer(
            x,
            this.y,
            1,
            this.direction || 1,
            this.dead ? -1 : 1,
            this.rotation,
            this.onWall,
            this.dead,
        );
    }

    renderPlayer(x, y, alpha, scaleX, scaleY, rotation, paws, dead) {
        CTX.wrap(() => {
            CTX.translate(x, y);
            CTX.rotate(rotation);
            CTX.scale(scaleX, scaleY);
            CTX.globalAlpha *= Math.max(0, Math.min(1, alpha));

            renderCat(CTX, paws, dead);
        });
    }

    get distance() {
        return Math.round(-this.minY / CONFIG.pxPerMeter);
    }
}
