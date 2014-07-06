'use strict';

var sp = sp || {};

angular.module('schooldataApp')
    .controller('MainCtrl', ['$scope', '$http', '$location', '$window', 'es', 'mapService', function ($scope, $http, $location, $window, es, mapService) {

        es.search({
            index: sp.config.elasticsearch.index,
            type: 'school',
            body: {
                size: 0,
                aggs: {
                    nested: {
                        nested: {
                            path: 'address'
                        },
                        aggs: {
                            districts: {
                                terms: {
                                    field: 'address.district',
                                    size: 0,
                                    order: {
                                      _term: 'asc'
                                    }
                                }
                            }
                        }
                    },
                    schooltypes: {
                        terms: {
                            field: 'schooltype',
                            size: 0,
                            order: {
                              _term: 'asc'
                            }
                        }
                    },
                    branches: {
                        terms: {
                            field: 'branches',
                            size: 0,
                            order: {
                              _term: 'asc'
                            }
                        }
                    },
                    languages: {
                        terms: {
                            field: 'languages',
                            size: 0,
                            order: {
                              _term: 'asc'
                            }
                        }
                    },
                    equipments: {
                        terms: {
                            field: 'equipments',
                            size: 0,
                            order: {
                              _term: 'asc'
                            }
                        }
                    }
                }
            }
        }).then(function (body) {
            var districts = [];
            var schooltypes = [];
            var branches = [];
            var languages = [];
            var equipments = [];
            angular.forEach(body.aggregations.nested.districts.buckets, function(v){
                districts.push(v.key);
            });
            $scope.districts = districts;
            angular.forEach(body.aggregations.schooltypes.buckets, function(v){
                schooltypes.push(v.key);
            });
            $scope.schoolTypes = schooltypes;
            angular.forEach(body.aggregations.branches.buckets, function(v){
                branches.push(v.key);
            });
            $scope.branches = branches;
            angular.forEach(body.aggregations.languages.buckets, function(v){
                languages.push(v.key);
            });
            $scope.languages = languages;
            angular.forEach(body.aggregations.equipments.buckets, function(v){
                equipments.push(v.key);
            });
            $scope.equipments = equipments;
        }, function (error) {
            console.log(error.message);
        });

        $scope.allLanguages = true;
        $scope.allEquipments = false;

        $scope.$watch('selectedDistricts', function(n, o) {
            if (n !== o) {
                $location.path($location.search('d', n));
            }
        });

        $scope.$watch('selectedSchoolTypes', function(n, o) {
            if (n !== o) {
                $location.path($location.search('s', n));
            }
        });

        $scope.$watch('selectedBranches', function(n, o) {
            if (n !== o) {
                $location.path($location.search('b', n));
            }
        });

        $scope.$watch('selectedLanguages', function(n, o) {
            if (n !== o) {
                $location.path($location.search('l', n));
            }
        });

        $scope.$watch('allLanguages', function(n, o) {
            if (n !== o) {
                $location.path($location.search('al', n));
            }
        });

        $scope.$watch('selectedEquipments', function(n, o) {
            if (n !== o) {
                $location.path($location.search('e', n));
            }
        });

        $scope.$watch('allEquipments', function(n, o) {
            if (n !== o) {
                $location.path($location.search('ae', n));
            }
        });

        $scope.updateFilter = function(data) {
            if (data === undefined) {
                data = {
                    districts: this.selectedDistricts,
                    schooltypes: this.selectedSchoolTypes,
                    branches: this.selectedBranches,
                    languages: this.selectedLanguages,
                    allLanguages: this.allLanguages,
                    equipments: this.selectedEquipments,
                    allEquipments: this.allEquipments
                };
            }
            mapService.updateFilter(data);
        };

        $scope.filterAsLink = function() {
            $scope.shareLink = $location.absUrl();
        };

        var so = $location.search();
        var empty = true;
        if (so.d !== undefined) {
            if (typeof(so.d) === 'string') {
                $scope.selectedDistricts = [so.d];
            } else {
                $scope.selectedDistricts = so.d;
            }
            empty = false;
        }

        if (so.s !== undefined) {
            if (typeof(so.s) === 'string') {
                $scope.selectedSchoolTypes = [so.s];
            } else {
                $scope.selectedSchoolTypes = so.s;
            }
            empty = false;
        }

        if (so.b !== undefined) {
            if (typeof(so.b) === 'string') {
                $scope.selectedBranches = [so.b];
            } else {
                $scope.selectedBranches = so.b;
            }
            empty = false;
        }

        if (so.l !== undefined) {
            if (typeof(so.l) === 'string') {
                $scope.selectedLanguages = [so.l];
            } else {
                $scope.selectedLanguages = so.l;
            }
            empty = false;
        }

        if (so.al !== undefined) {
            $scope.allLanguages = so.al;
            empty = false;
        }

        if (so.e !== undefined) {
            if (typeof(so.e) === 'string') {
                $scope.selectedEquipments = [so.e];
            } else {
                $scope.selectedEquipments = so.e;
            }
            empty = false;
        }

        if (so.ae !== undefined) {
            $scope.allEquipments = so.ae;
            empty = false;
        }

        if (!empty) {
            $scope.updateFilter();
        }
    }]);
