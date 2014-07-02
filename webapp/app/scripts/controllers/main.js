'use strict';

var sp = sp || {};

angular.module('schooldataApp')
    .controller('MainCtrl', ['$scope', '$http', '$location', '$window', 'es', 'mapService', function ($scope, $http, $location, $window, es, mapService) {

        es.search({
            index: sp.config.elasticsearch.index,
            type: 'district',
            body: {
                size: 0,
                aggs: {
                    district: {
                        terms: {
                            field: 'name',
                            size: 0
                        }
                    }
                }
            }
        }).then(function (body) {
            var districts = [];
            angular.forEach(body.aggregations.district.buckets, function(v){
                districts.push(v.key);
            });
            $scope.districts = districts;
        }, function (error) {
            console.trace(error.message);
        });

        es.search({
            index: sp.config.elasticsearch.index,
            type: 'school',
            body: {
                size: 0,
                aggs: {
                    branches: {
                        terms: {
                            field: 'branches',
                            size: 0
                        }
                    }
                } 
            }
        }).then(function (body) {
            var branches = [];
            angular.forEach(body.aggregations.branches.buckets, function(v){
                branches.push(v.key);
            });
            $scope.schoolTypes = branches;
        }, function (error) {
            console.log(error.message);
        });

        es.search({
            index: sp.config.elasticsearch.index,
            type: 'school',
            body: {
                size: 0,
                aggs: {
                    languages: {
                        terms: {
                            field: 'languages',
                            size: 0
                        }
                    }
                }
            }
        }).then(function (body) {
            var languages = [];
            angular.forEach(body.aggregations.languages.buckets, function(v){
                languages.push(v.key);
            });
            $scope.languages = languages;
        }, function (error) {
            console.log(error.message);
        });

        $scope.updateFilter = function(data) {
            if (data === undefined) {
                data = {
                    districts: this.selectedDistricts,
                    schooltypes: this.selectedSchoolTypes,
                    languages: this.selectedLanguages
                };
            }
            mapService.updateFilter(data);
        };

        $scope.filterAsLink = function() {
            var data = {
                districts : this.selectedDistricts,
                schooltypes: this.selectedSchoolTypes,
                languages: this.selectedLanguages
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
            if (data.languages !== undefined) {
                empty = false;
                $scope.selectedLanguages = data.languages;
            }

            if (!empty) {
                $scope.updateFilter(data);
            }
        }
    }]);
