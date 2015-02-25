'use strict';

/**
 * @ngdoc function
 * @name schooldataApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the schooldataApp
 */
angular.module('berlinerSchulenApp')
	.controller('ListCtrl', ['$scope', '$timeout', 'schoolFactory', function ($scope, $timeout, schoolFactory) {

		$scope.currentPage   = 0;
		$scope.pageSize      = 10;
		$scope.schools       = [];
		$scope.numberOfPages = function() {
			return Math.ceil($scope.schools.length/$scope.pageSize);
		};

		$scope.$on('updateSchools', function() {
			var schools = schoolFactory.content;
			$scope.schools = [];
			$scope.currentPage = 0;
			if (schools.length > 0) {

				angular.forEach(schools, function(schools) {
					$timeout(function(){
						var school = {
							'a_name': schools.bsn,
							'b_district': schools.district,
							'c_id': schools.id,
							'd_url': schools.wwwaddress
						};
						$scope.schools.push(school);
					}, 1);
				});

			}

		});
	}]);
