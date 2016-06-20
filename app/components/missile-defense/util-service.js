'use strict';

angular.module('missileDefense.utilService' , [])
  .factory('UtilService', [function() {
    function _doLinesIntersect(p1, p2, p3, p4) {
      // see http://www-cs.ccny.cuny.edu/~wolberg/capstone/intersection/Intersection%20point%20of%20two%20lines.html
      var a = p4.x - p3.x,
        b = p1.y - p3.y,
        c = p4.y - p3.y,
        d = p1.x - p3.x,
        e = p2.x - p1.x,
        f = p2.y - p1.y,
        g = p1.y - p3.y,
        denom = c * e - a * f,
        ua,
        ub;

      if (denom < 0.000001) {
        return false;
      }
      ua = (a * b - c * d) / denom;
      ub = (e * g - e * a) / denom;
      if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        return true;
      } else {
        return false;
      }
    }
    return {
      distance: function(dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
      },
      isWithin: function(dx, dy, distance) {
        return dx * dx + dy * dy < distance * distance;
      },
      doLinesIntersect: function(p1, p2, p3, p4) {
        return _doLinesIntersect(p1, p2, p3, p4);
      },
      isPointInPolygon: function(p1, polyp) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        var x = p1.x,
          y = p1.y;
        var inside = false;

        for (var i = 0, j = polyp.length - 1; i < polyp.length; j = i++) {
          var xi = polyp[i].x,
            yi = polyp[i].y,
            xj = polyp[j].x,
            yj = polyp[j].y;

          var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }

        return inside;
      }
    };
  }])  
  .factory('ImageService', ['$q', function($q) {
    var images = [];
    return {
      loadImage: function (filepath) {
        var deferred = $q.defer(),
          img = new Image(),
          iImage = images.length;
        img.onload = function(){
          images.push({
            src: filepath,
            img: img
          });
          deferred.resolve(img);
        };
        img.src = filepath;

        return deferred.promise;
      }
    };
  }]);
