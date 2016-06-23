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
    scope.level = 1;
  }])

  .directive('missileDefense', ['$window', 'ProjectileService', 'LauncherService', 'MouseService', 'ExplosionService', 'EnemyMissileService', 'ScoringService', 'UtilService', 'GroundService', 'CityService', 'BackgroundService', 'AnimationService',
    function(window, ProjectileService, LauncherService, MouseService, ExplosionService, EnemyMissileService, ScoringService, UtilService, GroundService, CityService, BackgroundService, AnimationService) {
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
          setGameState('notStarted');
        });

        scope.levelChange = function () {
          initWorld();
          scope.gameState = 'notStarted';
        }

        function setGameState(state) {
          switch(scope.gameState) {
            case 'paused':
              timeLast = 0;
              break;
          }
          scope.gameState = state;
        }

        function drawScore(dt) {
          ctx.fillStyle = options.clrRain;
          ctx.font = "16pt Helvetica, Arial, sans serif";
          ctx.fillText(ScoringService.getScore().toString(), 20, ctxHeight-20);
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

        function drawGameOver() {
          ctx.fillStyle = "red";
          ctx.font = '20pt Helvetica, Arial, sans serif';
          ctx.fillText('Game Over', ctxWidth/2 - 35, ctxHeight/2);
        }

        function physics(dt) {
          ProjectileService.physics(dt);
          LauncherService.physics(dt);
          ExplosionService.physics(dt);
          EnemyMissileService.physics(dt);
          CityService.physics(dt);
          if (dt > .1) {
            console.log(dt);
          }
        }

        function drawBackground() {
          ctx.fillStyle = options.clrBackground;
          ctx.strokeStyle = options.clrRain;
          ctx.fillRect(0,0,ctxWidth,ctxHeight);
          ctx.strokeRect(0,0,ctxWidth,ctxHeight);
        }

        function drawGameFrame() {
          GroundService.draw(ctx);
          CityService.draw(ctx);
          LauncherService.draw(ctx);
          ProjectileService.draw(ctx);
          ExplosionService.draw(ctx);
          EnemyMissileService.draw(ctx);
          MouseService.draw(ctx);
        }

        function animate(now) {
          var dt;
          BackgroundService.draw(ctx);

          switch(scope.gameState) {
            case 'gameOver':
              drawGameOver();
              break;
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
        };

        scope.restartGame = function() {
          setGameState('running');
        };

        function stopAnimation() {
          setGameState('paused');
        }

        function initWorld() {
          var levelData;
          scope.levels = [];
          window.gameData.forEach(function(level, index) {
            scope.levels.push({
              name: level.levelName || ('Level' + index),
              index: index
            });
          });
          ScoringService.resetScore();
          CityService.init(ctxWidth, ctxHeight, scope.level);
          ProjectileService.init(ctxWidth, ctxHeight, scope.level);
          LauncherService.init(ctxWidth, ctxHeight, scope.level);
          EnemyMissileService.init(ctxWidth, ctxHeight, scope.level);
          GroundService.init(ctxWidth, ctxHeight, scope.level);
          BackgroundService.init(ctxWidth, ctxHeight);
          levelData = window.gameData[scope.level]; 
          if (levelData.backgroundImage) {
            BackgroundService.loadBackground(levelData.backgroundImage);
          }
        }

        function init() {
          canvasOffset = element.offset();
          initWorld();
        }

        init();
        startAnimation();

        scope.$on('gameOver', function (event, message) {
          setGameState('gameOver');
        });

        element.on('click', function(event) {
          switch(scope.gameState) {
            case 'gameOver':
              initWorld(); 
              setGameState('running');
              break;
            case 'running': 
              LauncherService.fireProjectile();
              break;
            case 'paused':
              setGameState('running');
              break;
            default:
              setGameState('running');
              EnemyMissileService.restart();
              break;
          }
        });

        element.on('mouseover', function (event) {
          element.on('mousemove', function (event) {
            MouseService.mouseMove(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top);
          });
        });

        element.on('mouseout', function (event) {
          element.off('mousemove');
        });

        scope.$on('$destroy', function (event) {
          setGameState('paused');
          element.off('click');
          element.off('mouseout');
          element.off('mouseover');
          element.off('mousemove');
          EnemyMissileService.destroy();
        });
      }
    };
  }]);