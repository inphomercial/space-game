'use strict';

var socket;

var bg = color(255);

function setup() {
    socket = io();
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(bg);
    var rotation_speed = pRotationZ - rotationZ;

    if (rotation_speed != 0) {
        socket.emit('turn', rotation_speed);
    }

socket.on('color', funtion(d) { color = color(d);});