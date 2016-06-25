'use strict';

angular.module('missileDefense.enemyMissileService', [])
  .factory('EnemyMissileService', ['ScoringService', 'GroundService', 'ImageService', 'CityService', 'ExplosionService', 'UtilService',
  function(ScoringService, GroundService, ImageService, CityService, ExplosionService, UtilService) {
    var missiles = [];
    var missileInLevel = 0;
    var context = {};
    var timeToNext;
    var dtime = 1.500;
    var missileImage;
    var missileImageCenter = {
      x: 0,
      y: 0
    };

    function createMissile() {
      var cities = CityService.getCities(),
        city,
        xFrom = Math.random() * context.width;
      cities = cities.filter(function(city) {
        return !city.destroyed;
      });
      if (cities.length > 1) {
        city = cities[Math.floor(Math.random()*cities.length)]; 
        // console.log('Target city coordinates are ' + city.x + 'x' + city.y);
      } else if (cities.length === 1) {
        city = {x: cities[0].x, y: cities[0].y};
      } else {
        city = {x: Math.random(), y: context.dy};
      }
      
      missiles.push({
        tLaunch: new Date().getTime(),
        x: xFrom,
        y: 0,
        angle: -(Math.atan2(city.x - xFrom,
            city.y - 0) - Math.PI/2),
        radius: 4,
        speed: 80 + Math.random() * 30
      });
    }
    
    function timePasses(dt) {
      timeToNext -= dt;
      if (timeToNext < 0) {
        createMissile();
        timeToNext = dtime;
      }
    }

    return {
      init: function (ctxWidth, ctxHeight, level) {
        var levelData = window.gameData[level];
        context.width = ctxWidth;
        context.height = ctxHeight;
        missiles = [];
        missileImage = undefined;
        timeToNext = 1.500;
        
        if (levelData.missileImage && levelData.missileImage.filepath) {
          ImageService.loadImage(levelData.missileImage.filepath)
            .then(function(image) {
              missileImage = image;
              if (levelData.missileImage.imageCenter) {
                missileImageCenter = levelData.missileImage.imageCenter;
              } else {
                missileImageCenter = {x:0, y:0};
              }
            })
            .catch(function() {
              console.error('missile image not loaded');
            });
        }
      },
      restart: function() {
        missiles = [];
      },
      physics: function (dt) {
        var cityDestroyed;
        timePasses(dt);
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
      },
      destroy: function() {
      }
    }
  }]);
