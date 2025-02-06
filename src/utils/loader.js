function loadSVG(url, callback) {


    fetch(url)
        .then((response) => response.text())
        .then((svgText) => {
            const img = new Image();
            const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
            const url = URL.createObjectURL(svgBlob);
            img.src = url;

            img.onload = function () {
                callback(img);
                URL.revokeObjectURL(url); // Освобождаем память
            };
        });
}


export { loadSVG };