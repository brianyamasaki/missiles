'use strict';

angular.module('missileDefense.groundService', [])
  .factory('GroundService', ['UtilService', function(UtilService) {
    var context = { };
    var grounds;
    return {
      init: function (ctxWidth, ctxHeight, level) {
        context.dx = ctxWidth;
        context.dy = ctxHeight;
        grounds = [];
        grounds = angular.copy(window.gameData[level].grounds);
        grounds.forEach(function(polygon) {
          var points = polygon.points,
            yMin,
            xMin,
            yMax,
            xMax;

          points.forEach(function(point, index) {
            point.x = point.x * context.dx; 
            point.y = point.y * context.dy;
            if (index === 0) {
              yMin = yMax = point.y;
              xMin = xMax = point.x;
            } else {
              yMin = Math.min(yMin, point.y);
              yMax = Math.max(yMax, point.y);
              xMin = Math.min(xMin, point.x);
              xMax = Math.max(xMax, point.x);
            }
          });
          polygon.bounds = {
            xMin: xMin,
            yMin: yMin,
            xMax: xMax,
            yMax: yMax
          }
        });
      },
      pointInGround: function (point) {
        var inside = false;
        var polygon;
        for (var i=0; i < grounds.length; i++) {
          polygon = grounds[i];
          if (point.x >= polygon.bounds.xMin &&
              point.x <= polygon.bounds.xMax && 
              point.y >= polygon.bounds.yMin &&
              point.y <= polygon.bounds.yMax) {
            inside = UtilService.isPointInPolygon(point, polygon.points);
          }
          if (inside) {
            break;
          }
        }
        return inside;
      },
      draw: function (ctx) {
        grounds.forEach(function(polygon) {
          ctx.fillStyle = polygon.fillStyle;
          polygon.points.forEach(function(point, index) {
            if (index === 0) {
              ctx.beginPath();
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.closePath();
          ctx.fill();
        });

      }
    };
  }])