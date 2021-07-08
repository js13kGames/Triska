class MainMenu extends Menu {
    constructor() {
        super();

        this.buttons.push(new Button(
            CONFIG.width / 2,
            CONFIG.height / 2 + 50,
            'PLAY',
            () => {
                MENU.dismiss();
                resetPlayer();
            },
        ));
    }

    render() {
        super.render();

        // CTX.globalAlpha = Math.max(0, (GAME_DURATION - 1) / 0.3);
        const title = 'TRISKA';
        CTX.fillStyle = '#000';
        CTX.textBaseline = 'middle';
        CTX.textAlign = 'center';
        CTX.font = 'bold 72pt Courier';
        CTX.fillText(title, CONFIG.width / 2, CONFIG.height / 3 - 50);

        const titleWidth = CTX.measureText(title);

        CTX.textAlign = 'right';
        CTX.font = '30pt Courier';
        CTX.fillText('RELOADED', CONFIG.width / 2 + titleWidth.width / 2, CONFIG.height / 3 - 5);

        CTX.wrap(() => {
            CTX.translate(CONFIG.width - 120, CONFIG.height - 50);
            CTX.scale(3, 3);
            renderCat(CTX);
        });
    }
}
