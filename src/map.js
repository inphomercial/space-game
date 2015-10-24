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
        [300.9,1248.5],
        [426.5,1244.4],
        [552.5,1244.4],
        [676.5,1244.4],
        [802.5,1244.4],
        [927.5,1244.4],
        [1053.5,1244.4],
        [1169.5,1276.4],
        [1213.5,1384.4],
        [1213.5,1514.4],
        [1213.5,1635.4],
        [1272.5,1742.4],
        [1391.5,1748.4],
        [1461.5,1384.4],
        [1493.6,1284.3],
        [1461.5,1514.4],
        [1461.5,1635.4],
        [1608.6,1247.3],
        [1701.6,1322.3],
        [1710.5,1446.4],
        [1710.5,1576.4],
        [1710.5,1697.4],
        [1710.5,1822.4],
        [1690.5,1942.4],
        [1583.5,2000.4],
        [833.5,2000.4],
        [959.5,2000.4],
        [1083.5,2000.4],
        [1209.5,2000.4],
        [1334.5,2000.4],
        [1460.5,2000.4],
        [339,2000.4],
        [227.6,1948.6],
        [205.5,1828.6],
        [465,2000.4],
        [589,2000.4],
        [715,2000.4],
        [205.5,1326.4],
        [205.5,1456.4],
        [205.5,1577.4],
        [205.5,1702.4]

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
