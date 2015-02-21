'use strict';

/**
 * @ngdoc function
 * @name schooldataApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the schooldataApp
 */
angular.module('schooldataApp')
    .controller('ListCtrl', ['$scope', '$timeout', 'mapService', function ($scope, $timeout, mapService) {

        $scope.currentPage   = 0;
        $scope.pageSize      = 10;
        $scope.schools       = [];
        $scope.numberOfPages = function() {
            return Math.ceil($scope.schools.length/$scope.pageSize);
        };

        $scope.$on('updateMapMarkers', function() {
            $scope.schools = [];
            $scope.currentPage = 0;
            if (mapService.markers.length > 0) {

                angular.forEach(mapService.markers, function(marker) {
                    $timeout(function(){
                        var school = {
                            'a_name': marker.data.name,
                            'b_district': marker.data.district,
                            'c_id': marker.data.id,
                            'd_url': marker.data.wwwaddress
                        };
                        $scope.schools.push(school);
                    }, 1);
                });

            }

        });
    }]);
