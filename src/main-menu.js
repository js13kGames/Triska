renderMainMenu = () => {
    CTX.wrap(() => {
        CTX.translate(CONFIG.width - 150, CONFIG.height - 100);
        CTX.scale(3, 3);
        renderCat(CTX);
    });
}
