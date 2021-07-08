class MainMenu extends Menu {
    constructor() {
        super();

        this.buttons.push(new Button(
            CONFIG.width / 2,
            CONFIG.height / 2,
            'PLAY',
            () => {
                MENU.dismiss();
                resetPlayer();
            },
        ));
    }

    render() {
        super.render();

        CTX.wrap(() => {
            CTX.translate(CONFIG.width - 120, CONFIG.height - 50);
            CTX.scale(3, 3);
            renderCat(CTX);
        });
    }
}
