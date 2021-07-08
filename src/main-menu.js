class MainMenu extends Menu {
    constructor() {
        super();

        this.buttons.push(new Button(
            CONFIG.width / 2,
            CONFIG.height / 2 + 50,
            DEATHS.length ? 'TRY AGAIN' : 'PLAY',
            () => {
                MENU.dismiss();
                resetPlayer();
            },
        ));

        this.created = Date.now();
    }

    render() {
        super.render();

        // CTX.globalAlpha = Math.max(0, (GAME_DURATION - 1) / 0.3);

        CTX.wrap(() => {
            CTX.translate(CONFIG.width / 2, CONFIG.height / 3 - 50);
            CTX.scale(this.alpha, this.alpha);

            const title = 'TRISKA';
            CTX.fillStyle = '#000';
            CTX.textBaseline = 'middle';
            CTX.textAlign = 'center';
            CTX.font = 'bold 72pt Courier';
            CTX.fillText(title, 0, 0);

            const titleWidth = CTX.measureText(title);

            CTX.textAlign = 'right';
            CTX.font = '30pt Courier';
            CTX.fillText('RELOADED', titleWidth.width / 2, 45);
        });

        CTX.wrap(() => {
            CTX.translate(CONFIG.width / 2, CONFIG.height / 2 - 40);
            CTX.scale(this.alpha, this.alpha);

            if (DEATHS.length) {
                CTX.fillStyle = '#b12a34';
                CTX.textBaseline = 'middle';
                CTX.textAlign = 'center';
                CTX.font = '24pt Courier';
                CTX.fillText(`SCORE: ${DEATHS[DEATHS.length - 1].distance}M`, 0, 0);
            }
        });

        CTX.wrap(() => {
            CTX.translate(CONFIG.width - 120, CONFIG.height - 50);
            CTX.scale(3, 3);

            CTX.translate(0, (1 - this.alpha) * 100);

            renderCat(CTX, false, DEATHS.length > 0 && Date.now() - this.created < 4000);
        });
    }
}
