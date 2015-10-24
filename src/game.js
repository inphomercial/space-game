var socket;

<<<<<<< 91c7d8c82b9c9b67f33523f9a9e559739dcf1cd1
var ships = [];
=======
var ships = [],
bullets = [],
stars = [];
>>>>>>> updating starfield

function setup() {
  socket = io.connect('http://localhost:8080');

  socket.on('game_data', function(msg){
    console.log(msg);
  });

  socket.on('pregame', function( countdown ){
    background(100);
    textAlign(CENTER);
    noStroke();
    textStyle(ITALIC)
    textSize(30);
    text("JOIN THE NEXT ROUND", width/2, height/2 - 100);
    text("POINT YOUR MOBILE BROWSER TO:", width/2, height/2 - 50);
    textSize(50);
    text("192.168.1.6", width/2, height/2);
    textSize(70);
    text(countdown, width/2, height/2 + 70);
  });

  socket.on('postgame', function( winner ){
    background(100);
    textAlign(CENTER);
    noStroke();
    textStyle(ITALIC)
    textSize(30);
    text("GAME OVER", width/2, height/2 - 50);
    textSize(50);
    text(winner + " WINS!", width/2, height/2);
    textSize(70);
  });

  socket.on('ship_data', function(_ships){
    console.log('ships: ' + _ships);
    ships = _ships;
    draw_ships();
  });

  socket.emit('display');

  textFont('Georgia');
  createCanvas(displayWidth, displayHeight);
  // fullscreen();

  drawStarField(200);
}

function draw() {
    background("#101f2e");

    for (var i = 0; i < stars.length; i++) {
        stars[i].update();
    }
}

function Star(x, y, color, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
}

Star.prototype.update = function() {
    rectMode(CENTER);
    fill(this.color);
    noStroke();
    size = noise(frameCount * .1, this.x, this.y) * 5;
    rect(this.x, this.y, size, size);
};

function drawStarField(num) {

    var randomColor = function() {
        var colors = ["#d3c484", "#42445c", "#8683d4"];
        return colors[Math.floor(Math.random()*colors.length)];
    };

    while (num--) {
        random_x = random(0, displayWidth);
        random_y = random(0, displayHeight);
        size = random(3, 5);

        var star = new Star(random_x, random_y, randomColor(), size);
        stars.push(star);
    }
};

function draw_ships() {
  background(100);
  stroke(255);
  fill(100);
  ships.forEach( function (ship) {
    push();
    translate(ship.x, ship.y);
    rotate(ship.r);
    triangle(5, 0, -7, 5, -7, -5)
    pop();
  });
}