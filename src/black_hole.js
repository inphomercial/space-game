
var black_holes = [];

function BlackHole(x, y) {
   this.x = x;
   this.y = y;
   this.image = black_hole_image;
   this.timer = 300;
   this.size = 0;
}

BlackHole.prototype.update = function() {
    image(this.image, this.x, this.y, this.size, this.size);
    this.timer--;
    if(this.timer < 100) {
        this.size--;
    } else {
        this.size++;
    }
}

function canSpawnBlackHole() {
    return (random(0, 10000) > 9990);
}

function spawnBlackHole() {
    var black_hole = new BlackHole(randomWidthPosition(), randomHeightPosition());
    black_holes.push(black_hole);
}