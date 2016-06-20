'use strict';

angular.module('missileDefense.scoringService', [])
  .factory('ScoringService', [function() {
    var score = 0;
    return {
      resetScore: function() {
        score = 0;
      },
      getScore: function() {
        return score;
      },
      destroyedMissile: function(points) {
        score += points;
      }
    };
  }]);
