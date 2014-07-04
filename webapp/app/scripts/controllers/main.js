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
                                      _term: "asc"
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
                              _term: "asc"
                            }
                        }
                    },
                    branches: {
                        terms: {
                            field: 'branches',
                            size: 0,
                            order: {
                              _term: "asc"
                            }
                        }
                    },
                    languages: {
                        terms: {
                            field: 'languages',
                            size: 0,
                            order: {
                              _term: "asc"
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
        }, function (error) {
            console.log(error.message);
        });

        $scope.allLanguages = true;

        $scope.updateFilter = function(data) {
            if (data === undefined) {
                data = {
                    districts: this.selectedDistricts,
                    schooltypes: this.selectedSchoolTypes,
                    branches: this.selectedBranches,
                    languages: this.selectedLanguages,
                    allLanguages: this.allLanguages
                };
            }
            mapService.updateFilter(data);
        };

        $scope.filterAsLink = function() {
            var data = {
                districts : this.selectedDistricts,
                schooltypes: this.selectedSchoolTypes,
                branches: this.selectedBranches,
                languages: this.selectedLanguages,
                allLanguages: this.allLanguages
            };
            console.log($window.location);
            $scope.shareLink = $window.location.origin+'/'+$window.location.hash+'?filter='+encodeURIComponent(JSON.stringify(data));
        };

        var searchObject = $location.search();
        if (searchObject.filter !== undefined) {
            var data = JSON.parse(decodeURIComponent(searchObject.filter));
            console.log(data);
            var empty = true;
            if (data.districts !== undefined) {
                empty = false;
                $scope.selectedDistricts = data.districts;
            }
            if (data.schooltypes !== undefined) {
                empty = false;
                $scope.selectedSchoolTypes = data.schooltypes;
            }
            if (data.branches !== undefined) {
                empty = false;
                $scope.branches = data.branches;
            }
            if (data.languages !== undefined) {
                empty = false;
                $scope.selectedLanguages = data.languages;
            }
            if (data.allLanguages !== undefined) {
                empty = false;
                $scope.allLanguages = data.allLanguages;
            }

            if (!empty) {
                $scope.updateFilter(data);
            }
        }
    }]);
