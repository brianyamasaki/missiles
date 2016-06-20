'use strict';

angular.module('missileDefense.cityService', [])
  .factory('CityService', ['ImageService', '$rootScope', function(ImageService, $rootScope) {
    var cityImage,
      cityImageCenter = {x:0, y:0},
      cities;

    return {
      init: function(contextWidth, contextHeight, level) {
        var levelData = window.gameData[level];
        if (levelData.cityImage) {
          ImageService.loadImage(levelData.cityImage)
            .then(function(image) {
              cityImage = image;
              if (levelData.cityImageCenter) {
                cityImageCenter = levelData.cityImageCenter;
              }
            })
            .catch(function() {
              console.error('city image not loaded');
            });
        }
        if (levelData.cities) {
          cities = [];
          levelData.cities.forEach(function(city) {
            cities.push({
              x: city.x * contextWidth,
              y: city.y * contextHeight
            });
          });
        }
      },
      getCities: function () {
        return cities;
      },
      physics: function(dt) {
        if (!cities.find(function(city) {
          return !city.destroyed
        })) {
          $rootScope.$broadcast('gameOver', 'Your Cities are all destroyed');
        }
      },
      draw: function(ctx) {
        if (cityImage) {
          cities.forEach(function(city) {
            if (city.destroyed) {
              return;
            }
            ctx.save();
            ctx.translate(city.x, city.y);
            ctx.drawImage(cityImage, cityImageCenter.x, cityImageCenter.y);
            // ctx.strokeRect(cityImageCenter.x, cityImageCenter.y, cityImage.naturalWidth, cityImage.naturalHeight);
            ctx.restore();
          });
        } else {
          cities.forEach(function(city) {
            if (city.destroyed) {
              return;
            }
            ctx.fillStyle = 'black';
            ctx.arc(city.x, city.y, 100, Math.PI, Math.PI*2);
          });
        }
      }
    };
  }]);
