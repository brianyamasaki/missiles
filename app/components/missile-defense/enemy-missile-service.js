'use strict';

angular.module('missileDefense.enemyMissileService', [])
  .factory('EnemyMissileService', ['ScoringService', 'GroundService', 'ImageService',
  function(scoringService, groundService, imageService) {
    var missiles = [];
    var tCreated;
    var missileInLevel = 0;
    var context = {};
    var interval;
    var missileImage;
    var missileImageCenter = {
      x: 0,
      y: 0
    };

    function createMissile() {
      missiles.push({
        tLaunch: new Date().getTime(),
        from: {
          x: Math.random(),
          y: 0
        },
        to: {
          x: Math.random(),
          y: 1
        },
        radius: 4,
        speed: 80
      });
    }
    function startMissiles () {
      interval = setInterval(createMissile, 1500);
    }

    return {
      create: function (ctxWidth, ctxHeight, level) {
        var levelData = window.gameData[level];
        tCreated = new Date().getTime();
        context.width = ctxWidth;
        context.height = ctxHeight;
        if (levelData.missileImage) {
          imageService.loadImage(levelData.missileImage)
            .then(function(image) {
              missileImage = image;
              if (levelData.missileImageCenter) {
                missileImageCenter = levelData.missileImageCenter;
              }
            })
            .catch(function() {
              console.error('missile image not loaded');
            });
        }
        missiles = [];
        startMissiles();
      },
      pause: function () {
        clearInterval(interval);
      },
      unpause: function () {
        startMissiles();
      },
      restart: function() {
        missiles = [];
        startMissiles();
      },
      physics: function (dt) {
        var tElapsed = new Date().getTime() - tCreated;
        missiles = missiles.filter(function(missile) {
          if (missile.destroyed) {
            scoringService.destroyedMissile(10);
            return false;
          } else if ( 
            missile.x < -missile.radius || 
            missile.x > context.width + missile.radius ||
            missile.y < -missile.radius || 
            missile.y > context.height + missile.radius ||
            groundService.pointInGround({x: missile.x, y: missile.y})) {
            return false;
          } else {
              if (missile.angle === undefined) {
                missile.x = missile.from.x * context.width;
                missile.y = missile.from.y * context.height;
                missile.angle = -(Math.atan2((missile.to.x - missile.from.x) * context.width,
                    (missile.to.y - missile.from.y) * context.height) - Math.PI/2);
              }
              missile.x += Math.cos(missile.angle) * missile.speed * dt;
              missile.y += Math.sin(missile.angle) * missile.speed * dt;
              return true;
          }
        });
      },
      draw: function(ctx) {
        if (missileImage) {
          missiles.forEach(function(missile) {
            ctx.save();

            ctx.translate(missile.x, missile.y);
            ctx.rotate(missile.angle);
            ctx.drawImage(missileImage, missileImageCenter.x, missileImageCenter.y);
            ctx.restore();
          });

        } else {
          ctx.fillStyle = 'green';
          missiles.forEach(function(missile) {
            ctx.fillRect(missile.x-missile.radius, missile.y-missile.radius, missile.radius*2, missile.radius*2);
          });
        }
      },
      getMissiles: function() {
        
        return missiles;
      }
    }
  }]);
