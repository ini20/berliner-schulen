'use strict';

var sp = sp || {};

angular.module('schooldataApp')
    .controller('MainCtrl', ['$scope', '$http', 'es', 'mapService', function ($scope, $http, es, mapService) {
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

        $scope.updateFilter = function() {
            mapService.updateFilter({
                districts: this.selectedDistricts,
                schooltypes: this.selectedSchoolTypes
            });
        };
    }]);
