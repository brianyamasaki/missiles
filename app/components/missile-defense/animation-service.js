'use strict';

angular.module('missileDefense.animationService', [])
  .factory('ImageService', ['$q', function($q) {
    var images = [];
    return {
      loadImage: function (filepath) {
        var deferred = $q.defer(),
          img = new Image(),
          iImage = images.length;
        img.onload = function(){
          images.push({
            src: filepath,
            img: img
          });
          deferred.resolve(img);
        };
        img.onerror = function() {
          deferred.reject('image loading error for ' + filepath);
        };
        img.src = filepath;

        return deferred.promise;
      }
    };
  }])
  .factory('AnimationService', ['ImageService', '$q',
  function(ImageService, $q){
    var animations = [];
    return {
      init: function () {
        animation = [];
      },
      loadAnimation: function(animation) {
        var deferred = $q.defer();

        ImageService.loadImage(animation.filepath)
          .then(function(img) {
            var ianim;
            if (!animation.frames) {
              alert('animation ' + filepath + ' must include animation.frames')
            }
            animation.img = img;
            animation.dx = img.naturalWidth / animation.frames;
            animation.dy = img.naturalHeight;
            animation.dtFrame = 1 / animation.fps;
            animation.dtLength = animation.frames * animation.dtFrame;
            ianim = animations.length;
            animations.push(animation);
            deferred.resolve(ianim);
          });

        return deferred.promise;
      },
      drawAnimation: function(ctx, ianim, x, y, angle, xOffset, yOffset, dt) {
        var animation = animations[ianim];
        var iframe = Math.floor(dt % animation.dtLength / animation.dtFrame);
        var xFrameOffset = animation.dx * iframe;
        // console.log('animation frame #' + iframe + ' and xFrameOffset ' + xFrameOffset);

        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(animation.img, xFrameOffset, 0, animation.dx, animation.dy, xOffset, yOffset, animation.dx, animation.dy);
        ctx.restore();
      }
    };
  }])
  .factory('BackgroundService', ['ImageService', '$q', function(ImageService, $q) {
    var backgroundImage,
      dx,
      dy;
    return {
      init: function (ctxWidth, ctxHeight) {
        dx = ctxWidth;
        dy = ctxHeight;
      },
      loadBackground: function(filepath) {
        var deferred = $q.defer();

        ImageService.loadImage(filepath)
          .then(function(img) {
            backgroundImage = img;
            deferred.resolve();
          });

        return deferred.promise;
      },
      draw: function(ctx) {
        if (backgroundImage) {
          ctx.drawImage(backgroundImage, 0, 0, dx, dy);
        } else {
          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.fillRect(0,0,dx,dy);
          ctx.strokeRect(0,0,dx,dy);
        }
      }

    };
  }])
  ;