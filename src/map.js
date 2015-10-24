'use strict';

function Map() {
    this.start_location = [
        [100, 100],
        [200, 100],
        [100, 200],
        [200, 200],
        [100, 300],
        [200, 300]
    ];

    this.track_points = [
        [418.2,143.1],
        [543.2,143.1],
        [668.2,143.1],
        [857.3,143.1],
        [955.8,143.1],
        [1141.7,143.1],
        [1269.8,143.1],
        [1418.2,143.1],
        [1594.8,175.9],
        [1647.9,280.6],
        [1651.1,393.1],
        [1654.2,569.7],
        [1654.2,718.1],
        [1646.4,860.3],
        [1624.5,944.7],
        [1502.6,980.6],
        [1346.4,982.2],
        [1174.5,985.3],
        [976.1,991.6],
        [747.9,968.1],
        [543.2,957.2],
        [333.9,941.6],
        [160.4,866.6],
        [149.5,715],
        [147.9,466.6],
        [140.1,346.2],
        [138.6,229.1],
        [201.1,143.1],
        [313.6,140]
    ];
}

Map.prototype.getProgress = function(coordinate) {
    var point_count = this.track_points.length;
    var closest_point = 0;
    var minimum_distance = width;
    for (var i = 0; i < this.track_points.length; i++) {
        var d = dist(coordinate.x, coordinate.y, this.track_points[i][0], this.track_points[i][1]);
        if( d <= minimum_distance){
            minimum_distance = d;
            closest_point = i;
        }
    }
    var progress = closest_point/(point_count-1);

    return progress;
};

Map.prototype.display = function( debug ) {
    if(debug) {
        strokeWeight(10);
        stroke(255, 120);
        noFill();
        beginShape();
        this.track_points.forEach(function (point){
            vertex(point[0], point[1]);
        });
        endShape();
    }
};