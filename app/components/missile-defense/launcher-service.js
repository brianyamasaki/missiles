'use strict';

angular.module('missileDefense.launcherService', [])
  .factory('LauncherService', ['MouseService', 'ProjectileService', 'UtilService', 'ImageService', 
  function(MouseService, ProjectileService, UtilService, ImageService) {
    var launchers = [];
    var launcherRadius = 10;
    var launcherBarrelLength = 40;
    var launcherImage;
    var launcherImageCenter = {x:0, y:0};

    function drawDefaultLaunchers(ctx) {
      var lineWidth = ctx.lineWidth;
      var fillStyle = ctx.fillStyle;
      ctx.lineWidth = 3;
      ctx.fillStyle = 'black';
      launchers.forEach(function(launcher) {
        ctx.beginPath();
        ctx.arc(launcher.x, launcher.y, launcherRadius, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();

        // draw gun barrel
        ctx.beginPath();
        ctx.moveTo(launcher.x, launcher.y);
        ctx.lineTo(launcher.muzzle.x, launcher.muzzle.y);
        ctx.closePath();
        ctx.stroke();

      });
      ctx.lineWidth = lineWidth;
      ctx.fillStyle = fillStyle;
    }

    return {
      init: function(ctxWidth, ctxHeight, level) {
        var levelData = window.gameData[level];
        levelData.launchers.forEach(function(launcher) {
          launchers.push({
            x: launcher.x * ctxWidth,
            y: launcher.y * ctxHeight,
            angle: 0,
            cMissiles: 50,
            muzzle: {}
          });
        });
        if (levelData.launcherImage) {
          ImageService.loadImage(levelData.launcherImage)
            .then(function(image) {
              launcherImage = image;
              if (levelData.launcherImageCenter) {
                launcherImageCenter = levelData.launcherImageCenter;
              }
            })
            .catch(function() {
              console.error('launcher image file ' + levelData.launcherImage + ' not loaded');
            });
        }
      },
      physics: function (dt) {
        var mousePos = MouseService.getPos();
        launchers.forEach(function(launcher) {

          launcher.angle = - (Math.atan2(mousePos.x - launcher.x, mousePos.y - launcher.y) - Math.PI/2);
          launcher.muzzle.x = launcher.x + Math.cos(launcher.angle)*launcherBarrelLength;
          launcher.muzzle.y = launcher.y + Math.sin(launcher.angle)*launcherBarrelLength;
        });
      },
      fireProjectile: function () {
        var mousePos = MouseService.getPos();
        launchers.forEach(function(launcher) {

          ProjectileService.create(launcher.muzzle.x, launcher.muzzle.y, launcher.angle,
            UtilService.distance(launcher.muzzle.x - mousePos.x, launcher.muzzle.y - mousePos.y));
        });
      },
      draw: function (ctx) {
        if (!launcherImage) {
          drawDefaultLaunchers(ctx);
        } else {
          launchers.forEach(function(launcher) {
            ctx.save();

            ctx.translate(launcher.x, launcher.y);
            ctx.rotate(launcher.angle);
            ctx.drawImage(launcherImage, launcherImageCenter.x, launcherImageCenter.y);
            ctx.restore();
          });
        }

      }
    };
  }]);
