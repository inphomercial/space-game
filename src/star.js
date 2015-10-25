
var stars = [],
    shooting_stars = [];

function Star(x, y, color, size) {
    // console.log(color);
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.timer = random(0, .3);
}

Star.prototype.update = function() {
    rectMode(CENTER);
    fill(this.color);
    noStroke();
    size = noise(frameCount * this.timer, this.x, this.y) * 5;
    rect(this.x, this.y, size, size);
};

Star.prototype.shoot = function() {
    this.x = lerp(this.x, this.end_x, .01);
    this.y = lerp(this.y, this.end_y, .01);
    this.size -= .04;
    this.life--;
    fill(this.color, this.life/2);
    rect(this.x, this.y, this.size, this.size);
};

function checkForShootingStar() {
    if(Math.random() > .99) createShootingStar();
};

function createShootingStar() {
    var star = new Star(randomWidthPosition(), randomHeightPosition(), randomColor(), random(1, 8));
    star.life = random(20, 150);
    star.end_x = randomWidthPosition();
    star.end_y = randomHeightPosition();
    shooting_stars.push(star);
};

function randomColor() {
    // "#d3c484", "#42445c", "#8683d4"];
    var a = color('rgb(211, 196, 132)');
    var b = color('rgb(66, 68, 92)');
    var c = color('rgb(134, 131, 212)');
    var colors = [a, b, c];

    return colors[Math.floor(Math.random() * colors.length)];
};


function initStarField(num) {
    while (num--) {
        size = random(1, 8);
        var star = new Star(randomWidthPosition(), randomHeightPosition(), randomColor(), size);
        stars.push(star);
    }
};
