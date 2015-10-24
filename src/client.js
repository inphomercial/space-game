'use strict';

var socket;
var bg;

function setup() {
    socket = io();

    createCanvas(windowWidth, windowHeight);

    socket.on('player:props', function (props) {
        bg = props.color;
    });

    socket.on('player:better-luck-next-time', function () {
        alert('better luck next time, kiddo');
    });
}

function draw() {
    var turn = {
        rotation_speed: pRotationZ - rotationZ,
        boost: touchIsDown || mouseIsPressed
    };

    if (bg) background(bg);
    socket.emit('player:turn', turn);

    textSize(32);
    text(JSON.stringify(turn, null, '  '), 10, 30);
}

function asController() {
    socket.emit('game:control');
    socket.on('game:state', function (state) {
        console.log('game state', state);
    });
}
