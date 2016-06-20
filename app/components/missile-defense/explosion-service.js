'use strict';

angular.module('missileDefense.explosionService', [])
  .factory('ExplosionService', [ 
  function() {
    var explosions = [];
    var options = {
      tLifetime: 1500,
      radiusDefault: 30,
      fillStyle: '#ddaa66'
    };

    return {
      create: function (x, y, radius, fillStyle) {
        explosions.push({
          x: x,
          y: y,
          tCreate: new Date().getTime(),
          radiusMax: radius || options.radiusDefault,
          radiusCur: 0,
          fillStyle: fillStyle || options.fillStyle,
          tLifetime: options.tLifetime
        });
      },
      physics: function (dt) {
        var now = new Date().getTime();
        explosions = explosions.filter(function(explosion) {
          var missiles;
          if (now - explosion.tCreate > explosion.tLifetime) {
            return false;
          } else {
            explosion.radiusCur = Math.sin(((now - explosion.tCreate) / explosion.tLifetime) * Math.PI) * explosion.radiusMax;
            // missiles = EnemyMissileService.getMissiles();
            // missiles.forEach(function(missile) {
            //   if (UtilService.isWithin(explosion.x - missile.x, explosion.y - missile.y, explosion.radiusCur + missile.radius)) {
            //     missile.destroyed = true;
            //   }
            // });
            return true;
          }
        });
      },
      draw: function(ctx) {
        explosions.forEach(function(explosion) {
          ctx.fillStyle = explosion.fillStyle;
          ctx.beginPath();
          ctx.arc(explosion.x, explosion.y, explosion.radiusCur, 0, Math.PI*2);
          ctx.closePath();
          ctx.fill();
        });
      },
      getExplosions: function () {
        return explosions;
      }
    };
  }]);