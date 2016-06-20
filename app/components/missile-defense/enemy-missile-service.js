'use strict';

angular.module('missileDefense.enemyMissileService', [])
  .factory('EnemyMissileService', ['ScoringService', 'GroundService', 'ImageService', 'CityService', 'ExplosionService', 'UtilService',
  function(ScoringService, GroundService, ImageService, CityService, ExplosionService, UtilService) {
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
      var cities = CityService.getCities(),
        city,
        xFrom = Math.random() * context.width;
      if (cities.length > 1) {
        city = cities[Math.floor(Math.random()*cities.length)]; 
        // console.log('Target city coordinates are ' + city.x + 'x' + city.y);
      } else {
        city = {x: Math.random() * context.width, y: 1};
      }
      
      missiles.push({
        tLaunch: new Date().getTime(),
        x: xFrom,
        y: 0,
        angle: -(Math.atan2(city.x - xFrom,
            city.y - 0) - Math.PI/2),
        radius: 4,
        speed: 80
      });
    }
    function startMissiles () {
      interval = setInterval(createMissile, 1500);
    }

    return {
      init: function (ctxWidth, ctxHeight, level) {
        var levelData = window.gameData[level];
        tCreated = new Date().getTime();
        context.width = ctxWidth;
        context.height = ctxHeight;
        missiles = [];
        if (levelData.missileImage) {
          ImageService.loadImage(levelData.missileImage)
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
        var cityDestroyed;
        missiles = missiles.filter(function(missile) {
          if (missile.destroyed) {
            ScoringService.destroyedMissile(10);
            return false;
          } else if ( 
            missile.x < -missile.radius || 
            missile.x > context.width + missile.radius ||
            missile.y < -missile.radius || 
            missile.y > context.height + missile.radius) {
              return false;
          } else if (GroundService.pointInGround({x: missile.x, y: missile.y})) {
            ExplosionService.create(missile.x, missile.y, 40, '#00dddd');
            return false;
          } else {
            cityDestroyed = CityService.getCities()
              .find(function(city) {
                return UtilService.distance(city.x - missile.x, city.y - missile.y) < 25;
              });
            if (cityDestroyed) {
              ExplosionService.create(cityDestroyed.x, cityDestroyed.y, 50, 'red');
              cityDestroyed.destroyed = true;
              return false;
            } else {
              if (ExplosionService.getExplosions()
                .find(function(explosion) {
                  return UtilService.isWithin(
                      explosion.x - missile.x, 
                      explosion.y - missile.y, 
                      explosion.radiusCur);
                })) {
                ScoringService.destroyedMissile(10);
                return false;
              }
              missile.x += Math.cos(missile.angle) * missile.speed * dt;
              missile.y += Math.sin(missile.angle) * missile.speed * dt;
              return true;
            }
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
