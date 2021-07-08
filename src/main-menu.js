renderMainMenu = () => {
    CTX.wrap(() => {
        CTX.translate(CONFIG.width - 150, CONFIG.height - 50);
        CTX.scale(3, 3);
        renderCat(CTX);
    });
}
