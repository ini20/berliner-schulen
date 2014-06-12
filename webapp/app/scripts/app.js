'use strict';

var sp = sp || {};

(function(){
    var mod = angular
    .module('schooldataApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'localytics.directives',
        'elasticsearch'
    ]);

    mod.config(function ($routeProvider) {
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

    mod.service('es', function (esFactory) {
        return esFactory({
            host: sp.config.elasticsearch.host
        });
    });

    mod.factory('mapService', ['$rootScope', 'es', function($rootScope, es) {
        var mapService = {
            markers: [],
            total: 0
        };

        mapService.updateFilter = function(args) {
            var body = {size: 1000};
            if (args.districts !== undefined) {
                body.query = {};
                if (args.districts.length > 0) {
                    body.query.nested = {
                        path: 'address',
                        query: {
                            terms: {
                                'address.district': args.districts.map(function(value){
                                    return value.toLowerCase();
                                }),
                            }
                        }
                    };
                }
            }
            es.search({
                index: sp.config.elasticsearch.index,
                type: 'school',
                body: body
            }).then(function (body) {
                mapService.markers = [];
                angular.forEach(body.hits.hits, function(v){
                    if (v._source.address.location === undefined) {
                        return true;  // continue
                    }
                    var loc = new OpenLayers.Geometry.Point(
                        v._source.address.location.lon,
                        v._source.address.location.lat
                    ).transform('EPSG:4326', 'EPSG:3857');
                    mapService.markers.push(new OpenLayers.Feature.Vector(loc, {
                        id: v._id,
                        name: v._source.name,
                        street: v._source.address.street,
                        zip: v._source.address.plz,
                        district: v._source.address.district,
                    }));
                });
                mapService.total = body.hits.total;
                $rootScope.$broadcast('updateMapMarkers');
            }, function (error) {
                console.trace(error.message);
            });
        };

        return mapService;
    }]);
    return mod;
})();
