class Button {
    constructor(x, y, text, onClick) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.onClick = onClick;

        CTX.fillStyle = '#fff';
        CTX.textBaseline = 'middle';
        CTX.textAlign = 'center';
        CTX.font = '24pt Courier';
        const width = CTX.measureText(text).width;

        this.radiusX = Math.max(100, (width + 50) / 2);
        this.radiusY = 25;
    }

    render() {
        CTX.translate(this.x, this.y);

        CTX.rotate(Math.sin(Date.now() * Math.PI * 2 / 1000) * Math.PI / 128);

        if (this.contains(MOUSE_POSITION)) {
            CTX.scale(1.1, 1.1);
        }

        CTX.fillStyle = '#b12a34';
        CTX.fillRect(-this.radiusX, -this.radiusY, this.radiusX * 2, this.radiusY * 2);

        CTX.fillStyle = '#fff';
        CTX.textBaseline = 'middle';
        CTX.textAlign = 'center';
        CTX.font = '24pt Courier';
        CTX.fillText(this.text, 0, 0);
    }

    contains(position) {
        return Math.abs(this.x - position.x) < this.radiusX && Math.abs(this.y - position.y) < this.radiusY;
    }
}

class Menu {
    constructor() {
        this.buttons = [];
        this.fade(0, 1);
    }

    fade(fromValue, toValue) {
        this.fadeStartTime = Date.now();
        this.fadeEndTime = Date.now() + CONFIG.menuFadeDuration * 1000;
        this.fadeStartValue = fromValue;
        this.fadeEndValue = toValue;
    }

    get alpha() {
        let progress = (Date.now() - this.fadeStartTime) / (this.fadeEndTime - this.fadeStartTime);
        progress = Math.min(1, Math.max(0, progress));

        return progress * (this.fadeEndValue - this.fadeStartValue) + this.fadeStartValue;
    }

    dismiss() {
        if (!this.dismissed) {
            this.dismissed = true;
            this.fade(1, 0);
            setTimeout(() => MENU = null, CONFIG.menuFadeDuration * 1000);
        }
    }

    render() {
        CTX.globalAlpha = this.alpha;

        this.buttons.forEach(b => CTX.wrap(() => b.render()));
    }

    highlightedButton(position) {
        return this.buttons.filter((b) => b.contains(position))[0];
    }
}
