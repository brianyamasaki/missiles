'use strict';

angular.module('missileDefense.cityService', [])
  .factory('CityService', ['ImageService', '$rootScope', function(ImageService, $rootScope) {
    var cityImage,
      cityImageCenter = {x:0, y:0},
      cities;

    return {
      init: function(contextWidth, contextHeight, level) {
        var levelData = window.gameData[level];
        cityImage = undefined;
        cities = [];
        if (levelData.cityImage) {
          ImageService.loadImage(levelData.cityImage.filepath)
            .then(function(image) {
              cityImage = image;
              if (levelData.cityImage.imageCenter) {
                cityImageCenter = levelData.cityImage.imageCenter;
              } else {
                cityImageCenter = {x:0, y:0};
              }
            })
            .catch(function() {
              console.error('city image not loaded');
            });
        }
        if (levelData.cities) {
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
        cities = cities.filter(function(city) {
          return !city.destroyed;
        });
        if (cities.length === 0) {
          setTimeout(function() {
            $rootScope.$broadcast('gameOver', 'Your Cities are all destroyed');
          }, 5000);
        }
      },
      draw: function(ctx) {
        if (cityImage) {
          cities.forEach(function(city) {
            ctx.save();
            ctx.translate(city.x, city.y);
            ctx.drawImage(cityImage, cityImageCenter.x, cityImageCenter.y);
            // ctx.strokeRect(cityImageCenter.x, cityImageCenter.y, cityImage.naturalWidth, cityImage.naturalHeight);
            ctx.restore();
          });
        } else {
          cities.forEach(function(city) {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(city.x, city.y, 50, Math.PI, Math.PI*2);
            ctx.fill();
            ctx.closePath();
          });
        }
      }
    };
  }]);
