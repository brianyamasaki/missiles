'use strict';

angular.module('missileDefense.main', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'components/missile-defense/missile-defense.html',
      controller: 'MissileDefenseCtrl'
    });
  }])

  .controller('MissileDefenseCtrl', ['$scope', function(scope ) {
    scope.gameState = 'notStarted';
    scope.isPaused = function() {
      return scope.gameState == 'paused';
    }
    scope.isRunning = function() {
      return scope.gameState == 'running';
    }
  }])

  .directive('missileDefense', ['$window', 'ProjectileService', 'LauncherService', 'MouseService', 'ExplosionService', 'EnemyMissileService', 'ScoringService', 'UtilService', 'GroundService', 'CityService',
    function(window, projectileService, launcherService, mouseService, explosionService, enemyMissileService, scoringService, utilService, groundService, cityService) {
    return {
      restrict: 'E',
      replace: true,
      template: '<canvas width="800" height="500"></canvas>',
      link: function (scope, element, attrs) {
        var ctx,
          ctxWidth = 800,
          ctxHeight = 500,
          options = {
            mouseSize: 40, // radius of mouse circle
            clrBackground: '#ffffff', // color for background
            clrRain: '#000000', // color for rain drop
            clrMouse: '#ff0000' // color for mouse marker
          },
          canvasOffset,
          timeLast,
          isStarted,
          level;

        ctx = scope.ctx = element[0].getContext('2d');

        scope.$on('fileInputReceived', function(event, jsonObject) {
          window.gameData = jsonObject;
          initWorld();
          scope.gameState = 'notStarted';
        });

        function drawScore(dt) {
          ctx.fillStyle = options.clrRain;
          ctx.font = "16pt Helvetica, Arial, sans serif";
          ctx.fillText(scoringService.getScore().toString(), 20, ctxHeight-20);
        }

        function drawStartScreen() {
          ctx.fillStyle = "darkred";
          ctx.font = "20pt Helvetica, Arial, sans serif";
          ctx.fillText("Click to Start", ctxWidth/2 - 30, ctxHeight/2);
        }

        function drawPausedScreen() {
          ctx.fillStyle = "darkred";
          ctx.font = "20pt Helvetica, Arial, sans serif";
          ctx.fillText("Paused - Click to restart", ctxWidth/2 - 140, ctxHeight/2);
        }

        function gameOver() {
          ctx.fillStyle = "red";
          ctx.font = '20pt Helvetica, Arial, sans serif';
          ctx.fillText('Game Over', ctxWidth/2 - 35, ctxHeight/2);
          scoringService.resetScore();
        }

        function physics(dt) {
          projectileService.physics(dt);
          launcherService.physics(dt);
          explosionService.physics(dt);
          enemyMissileService.physics(dt);
        }

        function drawBackground() {
          ctx.fillStyle = options.clrBackground;
          ctx.strokeStyle = options.clrRain;
          ctx.fillRect(0,0,ctxWidth,ctxHeight);
          ctx.strokeRect(0,0,ctxWidth,ctxHeight);
        }

        function drawGameFrame() {
          groundService.draw(ctx);
          cityService.draw(ctx);
          launcherService.draw(ctx);
          projectileService.draw(ctx);
          explosionService.draw(ctx);
          enemyMissileService.draw(ctx);
          mouseService.draw(ctx);
        }

        function animate(now) {
          var dt;
          drawBackground();

          switch(scope.gameState) {
            case 'notStarted':
              drawStartScreen();
              break;
            case 'paused': 
              drawPausedScreen();
              break;
            case 'running': 
              if (timeLast) {
                dt = (now - timeLast) / 1000;
              } else {
                dt = 0;
              }
              timeLast = now;  
              physics(dt);
              drawGameFrame();
              break;
          }
          drawScore();

          window.requestAnimationFrame(animate);
        }

        function startAnimation() {
          window.requestAnimationFrame(animate);
        }

        scope.pauseGame =  function() {
          stopAnimation();
        }

        scope.restartGame = function() {
          scope.gameState = 'running';
        }

        function stopAnimation() {
          scope.gameState = 'paused';
        }

        function initWorld() {
          level = 1;
          projectileService.init(ctxWidth, ctxHeight, level);
          launcherService.create(ctxWidth, ctxHeight, level);
          enemyMissileService.create(ctxWidth, ctxHeight, level);
          groundService.create(ctxWidth, ctxHeight, level);
          cityService.init(ctxWidth, ctxHeight, level);
        }

        function init() {
          canvasOffset = element.offset();
          initWorld();
        }

        init();
        startAnimation();

        element.on('click', function(event) {
          if (scope.gameState !== 'running') {
            scope.gameState = 'running';
          } else {
            launcherService.fireProjectile();   
          }
        });

        element.on('mouseover', function (event) {
          element.on('mousemove', function (event) {
            mouseService.mouseMove(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top);
          });
        });

        element.on('mouseout', function (event) {
          element.off('mousemove');
        });

        scope.$on('$destroy', function (event) {
          scope.gameState = 'paused';
          element.off('click');
          element.off('mouseout');
          element.off('mouseover');
          element.off('mousemove');
          enemyMissileService.pause();
        });
      }
    }
  }])