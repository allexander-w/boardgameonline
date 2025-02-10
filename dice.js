const dice_eight = document.querySelector(".diceeight");
const dice_six = document.querySelector(".dicesix");
const double = document.querySelector(".double");

const rollButton = document.querySelector(".roll");
const rollLeftButton = document.querySelector(".rollLeft");
const rollRightButton = document.querySelector(".rollRight");

let interval = null;

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function rollIntervalFunction() {
    if ( dice_eight.dataset['write'] === "true" ) dice_eight.innerHTML = randomInteger(1, 8);
    if ( dice_six.dataset['write'] === "true" ) dice_six.innerHTML = randomInteger(1, 6);

    double.innerHTML = `${ dice_six.innerHTML }  ${ dice_eight.innerHTML }`;
}

function rollDice() {
    if ( interval ) return false;

    interval = setInterval(rollIntervalFunction, 40);
    setTimeout(() => {
        clearInterval(interval);
        interval = null;

        dice_eight.setAttribute("data-write", "true");
        dice_six.setAttribute("data-write", "true");
    }, 2000)
}

rollButton.addEventListener("click", rollDice);

rollLeftButton.addEventListener("click", () => {
    dice_eight.setAttribute("data-write", "false");
    rollDice();
});

rollRightButton.addEventListener("click", () => {
    dice_six.setAttribute("data-write", "false");
    rollDice();
});
