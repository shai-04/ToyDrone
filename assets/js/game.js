const game = document.querySelector("#game"); // main container for game

// GUI components
let txtStatus = document.getElementById("tank_status");
let compass = document.getElementById("compass");
let compass_text = document.getElementById("compass_text");
let report_text = document.getElementById("report_text");

// Audio effects for the game
let sfxMusic = new Audio("assets/sfx/bg.mp3"); 
let sfxExplosion = new Audio("assets/sfx/explosion.wav"); 
let sfxMove = new Audio("assets/sfx/move.mp3"); 
let sfxNegative = new Audio("assets/sfx/negative.mp3"); 
let sfxPlace = new Audio("assets/sfx/place.mp3"); 
let sfxRotate = new Audio("assets/sfx/rotate.mp3"); 
let sfxReport = new Audio("assets/sfx/report.wav");

sfxMusic.loop = true;
sfxMusic.play();

const dir = ["North", "East", "South", "West"]; // direction constants for report
const MAX = 10; //nth-dimension of matrix e.g. 3 = 3x3
let grid = ""; // will hold the div elements that'll make up the matrix
let cur_pos = null; // represents the x & y position of the tank
let direction = 0; // from right to left, North is 0 and West is 3;

// Create the grid of divs with onclick listener and unique id
for (let i = 0; i < MAX; ++i) {
    grid += '<div class = "blocks">\n';

    for (let j = 0; j < MAX; ++j) {
        grid += `\t<div id = "block${i}${j}" class = "block" onclick = "place(${i},${j},direction);"></div>\n`;   
    }

    grid += "</div>\n";
}

game.innerHTML = grid; // insert the grid into the game container

// place tank at specified position on the grid
function place(x, y, f) {
    // resets previous block to remove image and rotation factor
    if (cur_pos != null) {
        document.querySelector(`#block${cur_pos[0]}${cur_pos[1]}`).classList.remove("animate_rotation");
        document.querySelector(`#block${cur_pos[0]}${cur_pos[1]}`).classList.remove("current_pos");
        reset_rotation();
        sfxMove.play();
        txtStatus.innerHTML = "Drone moved";

    }
    else {
        txtStatus.innerHTML = "Drone placed";
        sfxPlace.play();
    }

    if (x < 0) x = 0;
    else if (x > 9) x = 9;

    if (y < 0) y = 0;
    else if (y > 9) y = 9;
    
    cur_pos = [x, y];
    document.querySelector(`#block${x}${y}`).classList.add("current_pos");
    rotate(f, false);
}

// move tank 1 block in it's current direction
function move() {
    if (cur_pos != null) {
        txtStatus.innerHTML = "Advancing position";

        switch (direction) {
            case 0:
                if (cur_pos[0] > 0) place(cur_pos[0] - 1, cur_pos[1], direction);
                break;
            case 1:
                if (cur_pos[1] < 9) place(cur_pos[0], cur_pos[1] + 1, direction);
                break;
            case 2:
                if (cur_pos[0] < 9) place(cur_pos[0] + 1, cur_pos[1], direction);
                break;
            case 3:
                if (cur_pos[1] > 0) place(cur_pos[0], cur_pos[1] - 1, direction);
                break;
        }
    }
    else sfxNegative.play();
}

// rotate tank on the same block. 'f' is direction and 'a' is whether to animate
function rotate(f, a = true) {
    if (cur_pos != null) {
        if (a) {
            document.querySelector(`#block${cur_pos[0]}${cur_pos[1]}`).classList.add("animate_rotation");
            compass.classList.add("animate_rotation");
            sfxRotate.play();
            txtStatus.innerHTML = "Rotating tank";
        }
        else {
            document.querySelector(`#block${cur_pos[0]}${cur_pos[1]}`).classList.remove("animate_rotation");
            compass.classList.remove("animate_rotation");
        }
    
        reset_rotation();
    
        switch (f) {
            case 1:
                document.querySelector(`#block${cur_pos[0]}${cur_pos[1]}`).classList.toggle("rotate_east");
                compass.classList.toggle("rotate_east");
                break;
            case 2:
                document.querySelector(`#block${cur_pos[0]}${cur_pos[1]}`).classList.toggle("rotate_south");
                compass.classList.toggle("rotate_south");
                break;
            case 3:
                document.querySelector(`#block${cur_pos[0]}${cur_pos[1]}`).classList.toggle("rotate_west");
                compass.classList.toggle("rotate_west");
                break;
        }
    }
    else sfxNegative.play();
}

// reset rotation factor back to north facing
function reset_rotation() {
    document.querySelector(`#block${cur_pos[0]}${cur_pos[1]}`).classList.remove("rotate_east");
    document.querySelector(`#block${cur_pos[0]}${cur_pos[1]}`).classList.remove("rotate_south");
    document.querySelector(`#block${cur_pos[0]}${cur_pos[1]}`).classList.remove("rotate_west");

    compass.classList.remove("rotate_east");
    compass.classList.remove("rotate_south");
    compass.classList.remove("rotate_west");
}

// fire missile if 2 spaces free ahead from current direction
function fire() {
    if (cur_pos != null) {
        let pos = null;

        switch (direction) {
            case 0:
                if (cur_pos[0] - 2 >= 0) pos = [cur_pos[0] - 2, cur_pos[1]];
                break;
            case 1:
                if (cur_pos[1] + 2 <= 9) pos = [cur_pos[0], cur_pos[1] + 2];
                break;
            case 2:
                if (cur_pos[0] + 2 <= 9) pos = [cur_pos[0] + 2, cur_pos[1]];
                break;
            case 3:
                if (cur_pos[1] - 2 >= 0) pos = [cur_pos[0], cur_pos[1] - 2];
                break;
        }
    
        if (pos != null) {
            sfxExplosion.play();
            txtStatus.innerHTML = "Missile fired";
    
            document.querySelector(`#block${pos[0]}${pos[1]}`).classList.add("fire");
    
            let fireAnimation = setInterval(function () {
                document.querySelector(`#block${pos[0]}${pos[1]}`).classList.remove("fire");
                clearInterval(fireAnimation);
            }, 700);
        }
    }
    else sfxNegative.play();
}

function report() {
    if (cur_pos != null) {
        txtStatus.innerHTML = "Report requested";
        sfxReport.play();
        report_text.innerHTML = `{${cur_pos[0]}, ${cur_pos[1]}} facing ${dir[direction]}`;
    }
    else sfxNegative.play();
}

// Key event listener for tank. keyup used to prevent repetitive actions
// Cannot perform any actions if the tank / drone not placed on grid
document.addEventListener('keyup', (event) => {
    if (cur_pos != null) {
        switch (event.code) {
            case 'KeyZ':
                fire();
                break;
            case 'KeyX':
                move();
                break;
            case 'KeyC':
                report();
                break;
            case 'ArrowLeft':
                direction = --direction;
                if (direction < 0) direction = 3;
                rotate(direction);
                break;
            case 'ArrowRight':
                direction = ++direction % 4;
                rotate(direction);
                break;
        }
    }
    else sfxNegative.play();
    }, false
);

console.log("You shouldn't be peeking here... Made with ❤ by Shaiyur Dooken (2023)");