class Button {
    constructor(x, y, text, onClick) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.onClick = onClick;

        this.radiusX = 100;
        this.radiusY = 25;
    }

    render() {
        CTX.fillStyle = '#b12a34';
        CTX.fillRect(this.x - this.radiusX, this.y - this.radiusY, this.radiusX * 2, this.radiusY * 2);

        CTX.fillStyle = '#fff';
        CTX.textBaseline = 'middle';
        CTX.textAlign = 'center';
        CTX.font = '24pt Courier';
        CTX.fillText(this.text, this.x, this.y);
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

        this.buttons.forEach(b => b.render());
    }
}
