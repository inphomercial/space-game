var socket;

var ships = [],
bullets = [];

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

  socket.on('bullet_data', function(_bullets){
    bullets = _bullets;
    draw_bullets();
    console.log('bullets: ' + bullets);
  });

  socket.emit('display');

  textFont('Georgia');
  createCanvas(displayWidth, displayHeight);
  // fullscreen();

  background("#101f2e");
  drawStarField(200);
}

function drawStarField(stars) {

    var randomColor = function() {
        var colors = ["#d3c484", "#42445c", "#8683d4"];
        return colors[Math.floor(Math.random()*colors.length)];
    };

    while (stars--) {
        random_x = random(0, displayWidth);
        random_y = random(0, displayHeight);
        size = random(3, 5);
        fill(randomColor());
        noStroke();
        rect(Number(random_x), Number(random_y), size, size);
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

function draw_bullets() {
  stroke(255);
  noFill();
  bullets.forEach( function (bullet) {
    point(bullet.x, bullet.y);
  });
}
