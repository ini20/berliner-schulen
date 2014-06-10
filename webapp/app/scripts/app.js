'use strict';

(function(){
    var app = angular
    .module('schooldataApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'localytics.directives',
        'elasticsearch'
    ]);

    app.config(function ($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
            })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
        })
        .when('/schools/:schoolId', {
            templateUrl: 'views/school.html',
            controller: 'SchoolCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    });

    app.service('es', function (esFactory) {
        console.log('es', esFactory);
        return esFactory({
            host: sp.config.elasticsearch.host
        });
    });
    return app;
})();
