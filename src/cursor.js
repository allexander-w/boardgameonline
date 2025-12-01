
document.addEventListener("mousemove", e => {
    const cursor = document.querySelector(".custom-cursor");
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

const changeCursor = (path) => {
    const cursor = document.querySelector(".custom-cursor");
    cursor.innerHTML = "";
    cursor.insertAdjacentHTML("afterbegin", `
        <img src="${path}" />
    `)
}

document.addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey) {
        changeCursor('/cursors/take.svg');
    }

    if ( e.altKey ) {
        changeCursor('/cursors/put.svg');
    }

    if ( e.shiftKey ) {
        changeCursor('/cursors/takeHalf.svg');
    }

    if ( e.shiftKey && (e.ctrlKey || e.metaKey) ) {
        changeCursor('/cursors/takeAll.svg');
    }
});


document.addEventListener("keyup", e => {
    const cursor = document.querySelector(".custom-cursor");
    cursor.innerHTML = "";
});