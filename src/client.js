'use strict';

var ROTATION_DAMPENING = 10;

var socket,
    player_info,
    flame_sound;

function setup() {
    socket = io();
    player_info = {};

    flame_sound = loadSound('assets/sounds/farts.mp3');

    createCanvas(windowWidth, windowHeight);

    socket.on('player:props', function (props) {
        player_info = props;
    });

    socket.on('player:better-luck-next-time', function () {
        alert('better luck next time, kiddo');
    });

    socket.on('player:control', function () {
        document.getElementById('start_game').style.display = 'block';
        document.getElementById('start_game').style.opacity = '1';

        document.getElementById('start_game').onclick = function () {
            socket.emit('game:state:ready');
            document.getElementById('start_game').style.display = 'none';
            document.getElementById('start_game').style.opacity = '0';
        };
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    var turn = {
        rotation_speed: rotationX * -1 * 0.0174533 / ROTATION_DAMPENING,
        boost: touchIsDown || mouseIsPressed
    };

    if (player_info.color) background(player_info.color);
    socket.emit('player:turn', turn);

    textSize(32);
    text("boost: " + JSON.stringify(turn.boost), 0, 130);
    text("rotation_speed: " + JSON.stringify(turn.rotation_speed), 0, 160);
    text("X: " + JSON.stringify(rotationX), 0, 190);
    text("Y: " + JSON.stringify(rotationY), 0, 220);
    text("Z: " + JSON.stringify(rotationZ), 0, 250);
}

function touchStarted() {
    flame_sound.play();
    flame_sound.loop(10);
}

function touchEnded() {
    flame_sound.stop();
}
