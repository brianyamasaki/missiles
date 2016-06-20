'use strict';

angular.module('missileDefense.mouseService', [])
  .factory('MouseService', [function() {
    var mouseRadius = 30,
      clrMouse = 'red',
      mousePos = {};

    return {
      mouseMove: function (x,y) {
        mousePos.x = x;
        mousePos.y = y;
      },
      getPos: function() {
        return mousePos;
      },
      draw: function (ctx) {
        if (mousePos.x !== undefined) {
          var radius = mouseRadius;
          ctx.strokeStyle = clrMouse;
          ctx.beginPath();
          ctx.arc(mousePos.x, mousePos.y, radius, 0, 2*Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(mousePos.x - radius, mousePos.y);
          ctx.lineTo(mousePos.x + radius, mousePos.y);
          ctx.moveTo(mousePos.x, mousePos.y - radius);
          ctx.lineTo(mousePos.x, mousePos.y + radius);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }])
