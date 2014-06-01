'use strict';

angular
  .module('schooldataApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'localytics.directives'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
