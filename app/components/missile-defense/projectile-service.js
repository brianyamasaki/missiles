'use strict';

angular.module('missileDefense.projectileService', [])
  .factory('ProjectileService', ['MouseService', 'ExplosionService', 'GroundService', 'ImageService', 
  function (mouseService, explosionService, groundService, imageService) {
    var projectiles = [],
      projectileImage,
      projectileImageCenter = {x:0, y: 0},
      speed = 500;
    return {
      init: function(contextDx, contextDy, level) {
        var levelData = window.gameData[level];
        if (levelData.projectileImage) {
          imageService.loadImage(levelData.projectileImage)
            .then(function(image) {
              projectileImage = image;
              if (levelData.projectileImageCenter) {
                projectileImageCenter = levelData.projectileImageCenter;
              }
            });
        }
      },
      create: function(x, y, angle, distance) {
        var now = new Date().getTime(),
          dx = Math.cos(angle) * speed,
          dy = Math.sin(angle) * speed,
          dtToDistance = distance / speed * 1000;
        projectiles.push({
          x: x,
          y: y,
          angle: angle,
          dx: dx,
          dy: dy,
          tDie: now + dtToDistance
        });
        // console.log(' projectile created x: ' + x + '  y: ' + y  + '  dx: ' + dx + '  dy: ' + dy + ' dt:' + dtToDistance);
      },
      physics: function(dt) {
        var now = new Date().getTime();
        projectiles = projectiles.filter(function(projectile) {
          if (now > projectile.tDie || projectile.destroyed) {
            explosionService.create(projectile.x, projectile.y);
            return false;
          } else if (groundService.pointInGround({x: projectile.x, y: projectile.y})){
            explosionService.create(projectile.x, projectile.y);
            return false;
          }
          // console.log('dt: ' + dt + ' Dx: ' + (projectile.dx * dt) + ' Dy: ' + (projectile.dy * dt));
          projectile.x += projectile.dx * dt;
          projectile.y += projectile.dy * dt;
          return true;
        });
      },
      draw: function(ctx) {
        if (projectileImage) {
          projectiles.forEach(function(projectile) {
            ctx.save();

            ctx.translate(projectile.x, projectile.y);
            ctx.rotate(projectile.angle);
            ctx.drawImage(projectileImage, projectileImageCenter.x, projectileImageCenter.y);
            ctx.restore();
          });
        } else {
          projectiles.forEach(function(projectile) {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(projectile.x, projectile.y, 3, 0, 6.28);
            ctx.closePath();
            ctx.fill();
          });
        }
      },
      get: function() {
        return projectiles;
      }
    };
  }]);
