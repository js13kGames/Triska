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

                const lastScore = DEATHS[DEATHS.length - 1].distance;
                if (lastScore >= highscore()) {
                    CTX.fillText(`NEW RECORD! ${lastScore}M`, 0, 0);

                    CTX.font = '8pt Courier';
                    CTX.translate(0, 25);
                    CTX.fillText(`(BUT REALLY, YOU COULD HAVE GONE HIGHER)`, 0, 0);
                } else {
                    CTX.fillText(`YOU CLIMBED ${lastScore}M!`, 0, 0);

                    CTX.font = '8pt Courier';
                    CTX.translate(0, 25);
                    CTX.fillText(`(YOU ONCE DID ${highscore()}M THOUGH)`, 0, 0);
                }
            }
        });

        CTX.wrap(() => {
            CTX.translate(CONFIG.width - 120, CONFIG.height - 50);
            CTX.translate(0, (1 - this.alpha) * 100);

            const dizzy = DEATHS.length > 0 && Date.now() - this.created < 4000;
            if (dizzy) {
                CTX.rotate(Math.sin(Date.now() / 1000 * Math.PI * 2 / 2) * Math.PI / 32);
            }

            CTX.wrap(() => {
                CTX.scale(3, 3);
                renderCat(CTX, false, dizzy);
            });

            if (dizzy) {
                const rng = createNumberGenerator(1);

                const count = 5;
                for (let i = 0 ; i < count ; i++) {
                    CTX.wrap(() => {
                        const ratio = i / count;
                        CTX.translate(0, -80);

                        const angle = ratio * Math.PI * 2 + Date.now() / 1000 * Math.PI;
                        CTX.translate(Math.cos(angle) * 40, Math.sin(angle) * 10);
                        renderSpark(CTX, 0, 0);
                    });
                }

            }
        });
    }
}
