'use strict';

angular.module('missileDefense.explosionService', [])
  .factory('ExplosionService', [ 'EnemyMissileService', 'UtilService', function(enemyMissileService, utilService) {
    var explosions = [];
    var options = {
      tLifetime: 1500,
      radiusDefault: 30
    };

    return {
      create: function (x, y, radius) {
        if (!radius) {
          radius = options.radiusDefault;
        }
        explosions.push({
          x: x,
          y: y,
          tCreate: new Date().getTime(),
          radiusMax: radius,
          radiusCur: 0,
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
            missiles = enemyMissileService.getMissiles();
            missiles.forEach(function(missile) {
              if (utilService.isWithin(explosion.x - missile.x, explosion.y - missile.y, explosion.radiusCur + missile.radius)) {
                missile.destroyed = true;
              }
            });
            return true;
          }
        });
      },
      draw: function(ctx) {
        explosions.forEach(function(explosion) {
          ctx.fillStyle = 'orange';
          ctx.beginPath();
          ctx.arc(explosion.x, explosion.y, explosion.radiusCur, 0, Math.PI*2);
          ctx.closePath();
          ctx.fill();
        });
      }
    };
  }]);