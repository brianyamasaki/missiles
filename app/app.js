'use strict';

// Declare app level module which depends on views, and components
angular.module('missileDefense', [
  'ngRoute',
  'missileDefense.main',
  'missileDefense.cityService',
  'missileDefense.enemyMissileService',
  'missileDefense.explosionService',
  'missileDefense.groundService',
  'missileDefense.launcherService',
  'missileDefense.main',
  'missileDefense.mouseService',
  'missileDefense.projectileService',
  'missileDefense.scoringService',
  'missileDefense.utilService',
  'missileDefense.fileInput',
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/'});
}]);
