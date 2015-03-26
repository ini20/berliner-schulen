'use strict';

/**
 * @ngdoc function
 * @name schooldataApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the schooldataApp
 */
angular.module('schooldataApp')
    .controller('MapProgressBarCtrl', ['$scope', '$timeout', 'mapService', function ($scope, $timeout, mapService) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.total = 0;
        $scope.took = 0;
        $scope.display_progress = {'width': '0%'};
        $scope.display_done = true;

        $scope.$on('updateMapMarkers', function() {
            $scope.total = mapService.total;
            $scope.took = mapService.took;
            if (mapService.markers.length > 0) {
                $scope.display_done = false;
                var cnt = 0.0;
                angular.forEach(mapService.markers, function() {
                    $timeout(function(){
                        cnt += 1.0;
                        $scope.display_progress = {'width': (cnt / mapService.markers.length * 100.0) + '%'};
                        if (cnt >= mapService.markers.length) {
                            $scope.display_done = true;
                        }
                    }, 1);
                });
            }
        });
    }]);
