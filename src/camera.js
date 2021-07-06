class Camera {
    constructor() {
        this.topY = PLAYER.y - CONFIG.height + CONFIG.groundHeight;
    }

    get bottomY() {
        return this.topY + CONFIG.height;
    }

    cycle(elapsed) {
        const targetTopY = Math.min(this.topY, PLAYER.y - CONFIG.height * 0.7);

        const diff = targetTopY - this.topY;

        const velocity = diff / 0.1;

        this.topY += velocity * elapsed;

        // this.topY = Math.min(this.topY, PLAYER.y - CONFIG.height * 0.5);
    }
}
