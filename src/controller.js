var socket;

function setup() {
    // connect to socket
    socket = io();
    //createCanvas(windowWidth, windowHeight);
}

function draw() {
    // Get rotation speed by subtracting previous rotation from current rotation on Z axis
    var rotation_speed = pRotationZ - rotationZ;

    // Send command to turn your ship
    if(rotation_speed != 0) {
        socket.emit('turn', rotation_speed);
    }
}