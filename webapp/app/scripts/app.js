'use strict';

(function(){
    var mod = angular
    .module('schooldataApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'localytics.directives',
        'elasticsearch',
        'ngClipboard',
        'angularCharts'
    ]);

    mod.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            reloadOnSearch: false
            })
        .when('/impressum', {
            templateUrl: 'views/about.html'
        })
        .when('/schools/:schoolId', {
            templateUrl: 'views/school.html'
        })
        .when('/statistics', {
            templateUrl: 'views/statistics.html'
        })
        .otherwise({
            redirectTo: '/'
        });
    }]);

    mod.service('es', function (esFactory) {
        return esFactory({
            host: sp.config.elasticsearch.host
        });
    });

    mod.factory('mapService', ['$rootScope', 'es', function($rootScope, es) {
        var mapService = {
            markers: [],
            total: 0,
            took: 0
        };

        mapService.updateFilter = function(args) {
            var body = {size: 1100};
            body.query = {};

            if (args.query !== undefined && args.query.length > 0) {
                if (body.query.bool === undefined) {
                    body.query.bool = {'must': []};
                }
                body.query.bool.must.push({
                    query_string: {
                        default_field: 'name',
                        query: args.query
                    }
                });
            }

            if (args.districts !== undefined) {
                if (args.districts.length > 0) {
                    if (body.query.bool === undefined) {
                        body.query.bool = {'must' : []};
                    }
                    body.query.bool.must.push({
                        nested: {
                            path: 'address',
                            query: {
                                terms: {
                                    'address.district': args.districts,
                                    minimum_should_match: 1
                                }
                            }
                        }
                  });
                }
            }

            if (args.schooltypes !== undefined) {
                if (args.schooltypes.length > 0) {
                    if (body.query.bool === undefined) {
                        body.query.bool = {'must' : []};
                    }

                    body.query.bool.must.push({
                        terms: {
                            schooltype : args.schooltypes,
                            minimum_should_match: 1
                        }
                    });
                }
            }

            if (args.branches !== undefined) {
                if (args.branches.length > 0) {
                    if (body.query.bool === undefined) {
                        body.query.bool = {'must' : []};
                    }

                    body.query.bool.must.push({
                        terms: {
                            branches : args.branches,
                            minimum_should_match: 1
                        }
                    });
                }
            }

            if (args.languages !== undefined) {
                var allL = (args.allLanguages === true);
                if (args.languages.length > 0) {
                    if (body.query.bool === undefined) {
                        body.query.bool = {'must' : []};
                    }

                    body.query.bool.must.push({
                        terms: {
                            languages : args.languages,
                            minimum_should_match: (allL === true) ? args.languages.length : 1
                        }
                    });
                }
            }

            if (args.equipments !== undefined) {
                var allE = (args.allEquipments === true);
                if (args.equipments.length > 0) {
                    if (body.query.bool === undefined) {
                        body.query.bool = {'must' : []};
                    }

                    body.query.bool.must.push({
                        terms: {
                            equipments : args.equipments,
                            minimum_should_match: (allE === true) ? args.equipments.length : 1
                        }
                    });
                }
            }

            if (args.accessibility !== undefined) {
                var allA = (args.allAccessibility === true);
                if (args.accessibility.length > 0) {
                    if (body.query.bool === undefined) {
                        body.query.bool = {'must' : []};
                    }

                    body.query.bool.must.push({
                        terms: {
                            accessibility : args.accessibility,
                            minimum_should_match: (allA === true) ? args.accessibility.length : 1
                        }
                    });
                }
            }

            if (body.query.bool === undefined) {
                body.query.match_all = {};
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
                        wwwaddress: v._source.wwwaddress,
                        phonenumber: v._source.phonenumber
                    }));
                });
                mapService.total = body.hits.total;
                mapService.took = body.took;
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
            link: function(scope, element, attrs) {
                var clazz = 'active';
                if (attrs.activeLink !== '') {
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
