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
                    },
                    accessibility: {
                        terms: {
                            field: 'accessibility',
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
            var accessibility = [];
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
            angular.forEach(body.aggregations.accessibility.buckets, function(v){
                accessibility.push(v.key);
            });
            $scope.accessibility = accessibility;
        }, function (error) {
            console.log(error.message);
        });

        $scope.allLanguages = true;
        $scope.allEquipments = false;
        $scope.allAccessibility = false;

        $scope.$watch('query', function(n, o) {
            if (n !== o) {
                $location.path($location.search('q', n));
            }
        });

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

        $scope.$watch('selectedAccessibility', function(n, o) {
            if (n !== o) {
                $location.path($location.search('w', n));
            }
        });

        $scope.$watch('allAccessibility', function(n, o) {
            if (n !== o) {
                $location.path($location.search('aw', n));
            }
        });

        $scope.updateFilter = function(data) {
            if (data === undefined) {
                data = {
                    query: this.query,
                    districts: this.selectedDistricts,
                    schooltypes: this.selectedSchoolTypes,
                    branches: this.selectedBranches,
                    languages: this.selectedLanguages,
                    allLanguages: this.allLanguages,
                    equipments: this.selectedEquipments,
                    allEquipments: this.allEquipments,
                    accessibility: this.selectedAccessibility,
                    allAccessibility: this.allAccessibility
                };
            }
            mapService.updateFilter(data);
        };

        $scope.filterAsLink = function() {
            $scope.shareLink = $location.absUrl();
        };

        var so = $location.search();

        if (so.q !== undefined) {
            $scope.query = so.q;
        }

        if (so.d !== undefined) {
            if (typeof(so.d) === 'string') {
                $scope.selectedDistricts = [so.d];
            } else {
                $scope.selectedDistricts = so.d;
            }
        }

        if (so.s !== undefined) {
            if (typeof(so.s) === 'string') {
                $scope.selectedSchoolTypes = [so.s];
            } else {
                $scope.selectedSchoolTypes = so.s;
            }
        }

        if (so.b !== undefined) {
            if (typeof(so.b) === 'string') {
                $scope.selectedBranches = [so.b];
            } else {
                $scope.selectedBranches = so.b;
            }
        }

        if (so.l !== undefined) {
            if (typeof(so.l) === 'string') {
                $scope.selectedLanguages = [so.l];
            } else {
                $scope.selectedLanguages = so.l;
            }
        }

        if (so.al !== undefined) {
            $scope.allLanguages = so.al;
        }

        if (so.e !== undefined) {
            if (typeof(so.e) === 'string') {
                $scope.selectedEquipments = [so.e];
            } else {
                $scope.selectedEquipments = so.e;
            }
        }

        if (so.ae !== undefined) {
            $scope.allEquipments = so.ae;
        }

        if (so.w !== undefined) {
            if (typeof(so.w) === 'string') {
                $scope.selectedAccessibility = [so.w];
            } else {
                $scope.selectedAccessibility = so.w;
            }
        }

        if (so.aw !== undefined) {
            $scope.allAccessibility = so.aw;
        }

        $scope.updateFilter();
    }]);
