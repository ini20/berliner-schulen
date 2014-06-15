'use strict';

var sp = sp || {};

angular.module('schooldataApp')
    .controller('MainCtrl', ['$scope', '$http', '$location', '$window', 'es', 'mapService', function ($scope, $http, $location, $window, es, mapService) {
        console.log('main', $scope);
        es.search({
            index: sp.config.elasticsearch.index,
            type: 'district',
            body: {
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
            var types = [];
            angular.forEach(body.aggregations.branches.buckets, function(v){
                types.push(v.key);
            });
            $scope.schoolTypes = types;
        }, function (error) {
            console.log(error.message);
        });

        $scope.languages = ['Deutsch', 'Englisch', 'Französisch'];

        $scope.updateFilter = function(data) {
            if (data === undefined) {
                var data = {
                    districts: this.selectedDistricts,
                    schooltypes: this.selectedSchoolTypes
                }  
            }
            mapService.updateFilter(data);
        };

        $scope.filterAsLink = function() {
            var data = {
                districts : this.selectedDistricts,
                schooltypes: this.selectedSchoolTypes
            };
            console.log($window.location);
            $scope.shareLink = $window.location.origin+'/'+$window.location.hash+'?filter='+encodeURIComponent(JSON.stringify(data));
        };

        var searchObject = $location.search();
        if (searchObject.filter !== undefined) {
            var data = JSON.parse(decodeURIComponent(searchObject.filter))
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

            if (!empty) {
                $scope.updateFilter(data);
            }
        }
    }]);
