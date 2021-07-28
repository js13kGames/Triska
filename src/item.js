class Item {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    cycle(elapsed) {
        if (Math.abs(PLAYER.x - this.x) > 20 || Math.abs(PLAYER.y - this.y) > 20 || PLAYER.dead) {
            return;
        }

        const index = ITEMS.indexOf(this);
        if (index >= 0) {
            ITEMS.splice(index, 1);
        }

        PLAYER.power += 0.34;

        if (PLAYER.power >= 1) {
            PLAYER.power = 1;
            PLAYER.superLucky = true;
        }
    }

    render() {
        if (MENU) return;
        if (CAMERA.bottomY < this.y - 50 || CAMERA.y > this.y + 50) {
            return;
        }
        renderClover(CTX, this.x, this.y);
    }
}
