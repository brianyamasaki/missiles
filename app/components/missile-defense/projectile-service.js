'use strict';

angular.module('missileDefense.projectileService', [])
  .factory('ProjectileService', ['MouseService', 'ExplosionService', 'GroundService', 'ImageService', 'AnimationService',
  function (MouseService, ExplosionService, GroundService, ImageService, AnimationService) {
    var projectiles = [],
      projectileAnimationIndex,
      projectileAnimationCenter = {x:0, y: 0},
      projectileImage,
      projectileImageCenter = {x:0, y: 0},
      speed = 500;

      function _drawProjectile(projectile, ctx) {
        if (projectileAnimationIndex !== undefined) {
          AnimationService.drawAnimation(ctx, 
            projectileAnimationIndex, 
            projectile.x, 
            projectile.y, 
            projectile.angle, 
            projectileAnimationCenter.x, 
            projectileAnimationCenter.y, 
            projectile.dt);
        } else if (projectileImage) {
          ctx.save();

          ctx.translate(projectile.x, projectile.y);
          ctx.rotate(projectile.angle);
          ctx.drawImage(projectileImage, projectileImageCenter.x, projectileImageCenter.y);
          ctx.restore();
        } else {
          ctx.fillStyle = 'black';
          ctx.beginPath();
          ctx.arc(projectile.x, projectile.y, 3, 0, 6.28);
          ctx.closePath();
          ctx.fill();
        }

      }

    return {
      init: function(contextDx, contextDy, level) {
        var levelData = window.gameData[level];
        projectileImage = undefined;
        projectileAnimationIndex = undefined;
        if (levelData.projectileAnimation) {
          AnimationService.loadAnimation(levelData.projectileAnimation)
            .then(function(ianim) {
              projectileAnimationIndex = ianim;
              if (levelData.projectileAnimation.imageCenter) {
                projectileAnimationCenter = levelData.projectileAnimation.animationCenter;
              } else {
                projectileAnimationCenter = {x:0, y:0};
              }
            });
        } else if (levelData.projectileImage) {
          ImageService.loadImage(levelData.projectileImage.filepath)
            .then(function(image) {
              projectileImage = image;
              if (levelData.projectileImage.imageCenter) {
                projectileImageCenter = levelData.projectileImage.imageCenter;
              } else {
                projectileImageCenter = {x:0, y:0};
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
          tDie: now + dtToDistance,
          dt: 0
        });
        // console.log(' projectile created x: ' + x + '  y: ' + y  + '  dx: ' + dx + '  dy: ' + dy + ' dt:' + dtToDistance);
      },
      physics: function(dt) {
        var now = new Date().getTime();
        projectiles = projectiles.filter(function(projectile) {
          if (now > projectile.tDie || projectile.destroyed) {
            ExplosionService.create(projectile.x, projectile.y);
            return false;
          } else if (GroundService.pointInGround({x: projectile.x, y: projectile.y})){
            ExplosionService.create(projectile.x, projectile.y);
            return false;
          }
          projectile.x += projectile.dx * dt;
          projectile.y += projectile.dy * dt;
          if (projectileAnimationIndex !== undefined) {
            projectile.dt += dt;
          }
          return true;
        });
      },
      draw: function(ctx) {
        projectiles.forEach(function(projectile) {
          _drawProjectile(projectile, ctx);
        });
      },
      get: function() {
        return projectiles;
      }
    };
  }]);
