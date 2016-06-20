'use strict';

angular.module('missileDefense.cityService', [])
  .factory('CityService', ['ImageService', function(imageService) {
    var cityImage,
      cityImageCenter = {x:0, y:0},
      cities;

    return {
      init: function(contextWidth, contextHeight, level) {
        var levelData = window.gameData[level];
        if (levelData.cityImage) {
          imageService.loadImage(levelData.cityImage)
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
      draw: function(ctx) {
        if (cityImage) {
          cities.forEach(function(city) {
            ctx.save();
            ctx.translate(city.x, city.y);
            ctx.rotate(-Math.PI/2);
            ctx.drawImage(cityImage, cityImageCenter.x, cityImageCenter.y);
            ctx.restore();
          });
        } else {
          cities.forEach(function(city) {
            ctx.fillStyle = 'black';
            ctx.arc(city.x, city.y, 100, Math.PI, Math.PI*2);
          });
        }
      }
    };
  }]);
