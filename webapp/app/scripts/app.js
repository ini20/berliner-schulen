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
            body.query = {};
            if (args.districts !== undefined) {
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

            if (args.schooltypes !== undefined) {
                if (args.schooltypes.length > 0) {
                    if (body.query.bool === undefined) {
                        body.query.bool = {'must' : []};
                    }

                    body.query.bool.must.push({
                        'terms' : {
                            'branches' : args.schooltypes,
                            'minimum_should_match': 1
                        }
                    });
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
                console.log(error.message);
            });
        };

        return mapService;
    }]);

    mod.directive('activeLink', ['$location', function($location) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                var clazz = "active";
                if (attrs.activeLink != "") {
                    clazz = attrs.activeLink;
                }
                var path = attrs.href;
                path = path.substring(1); //hack because path does not return including hashbang
                scope.location = $location;
                scope.$watch('location.path()', function(newPath) {
                    if (path === newPath) {
                        element.parent().addClass(clazz);
                    } else {
                        element.parent().removeClass(clazz);
                    }
                });
            } 
        };
    }]);
    return mod;
})();
