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
        [-181.1,-92.5],
        [-55.5,-96.6],
        [70.5,-96.6],
        [194.5,-96.6],
        [320.5,-96.6],
        [445.5,-96.6],
        [571.5,-96.6],
        [687.5,-64.6],
        [731.5,43.4],
        [731.5,173.4],
        [731.5,294.4],
        [790.5,401.4],
        [909.5,407.4],
        [979.5,43.4],
        [1011.6,-56.7],
        [979.5,173.4],
        [979.5,294.4],
        [1126.6,-93.7],
        [1219.6,-18.7],
        [1228.5,105.4],
        [1228.5,235.4],
        [1228.5,356.4],
        [1228.5,481.4],
        [1208.5,601.4],
        [1101.5,659.4],
        [351.5,659.4],
        [477.5,659.4],
        [601.5,659.4],
        [727.5,659.4],
        [852.5,659.4],
        [978.5,659.4],
        [-143,659.4],
        [-254.4,607.6],
        [-276.5,487.6],
        [-17,659.4],
        [107,659.4],
        [233,659.4],
        [-276.5,-14.6],
        [-276.5,115.4],
        [-276.5,236.4],
        [-276.5,361.4]

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

if (typeof window === 'undefined') module.exports = Map;
