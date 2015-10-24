'use strict';

var socket;
var player_info;

function setup() {
    socket = io();
    player_info = {};

    createCanvas(windowWidth, windowHeight);

    socket.on('player:props', function (props) {
        player_info = props;
    });

    socket.on('player:better-luck-next-time', function () {
        alert('better luck next time, kiddo');
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    var turn = {
        rotation_speed: pRotationZ - rotationZ,
        boost: touchIsDown || mouseIsPressed
    };

    if (player_info.color) background(player_info.color);
    socket.emit('player:turn', turn);

    textSize(32);
    text("boost: " + JSON.stringify(turn.boost), 10, 130);
    text("rotation_speed: " + JSON.stringify(turn.rotation_speed), 10, 160);
}

function asController() {
    socket.emit('game:control');
    socket.on('game:state', function (state) {
        console.log('game state', state);
    });
}
