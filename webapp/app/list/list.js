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

		$scope.headers = [
			{
				name:'',
				field:'thumb'
			},{
				name: 'Name',
				field: 'b_district'
			},{
				name:'Description',
				field: 'c_id'
			},{
				name: 'Last Modified',
				field: 'd_url'
			},{
				name: 'moin',
				field: 'e_field'
			}
		];

		$scope.custom = {name: 'bold', description:'grey',last_modified: 'grey'};
		$scope.sortable = ['a_name', 'b_district', 'd_url'];
		$scope.thumbs = 'thumb';
		$scope.count = 10;
		/** ------ */

		$scope.schools       = [];
		$scope.numberOfPages = function() {
			return Math.ceil($scope.schools.length/$scope.pageSize);
		};

		$scope.$on('updateSchools', function() {
			var schools = schoolFactory.content;
			$scope.schools = [];
			$scope.currentPage = 0;
			if (schools.length > 0) {

				for (var i = schools.length - 1; i >= 0; i--) {
					var school = {
						'thumb': 'http://lorempixel.com/46/46',
						'a_name': schools[i].bsn,
						'b_district': schools[i].district,
						'c_id': schools[i].plz,
						'd_url': schools[i].street,
						'e_field': schools[i].latitude
					};

					$scope.schools.push(school);
				}

			}
			console.log($scope.schools);
		});
	}]);

angular.module('berlinerSchulenApp')
	.directive('mdTable', function () {
		return {
			restrict: 'E',
			scope: {
				headers: '=',
				content: '=',
				sortable: '=',
				filters: '=',
				customClass: '=customClass',
				thumbs:'=',
				count: '='
			},
			controller: function ($scope,$filter,$window) {
				var orderBy = $filter('orderBy');
				$scope.tablePage = 0;
				$scope.nbOfPages = function () {
					return Math.ceil($scope.content.length / $scope.count);
				},
				$scope.handleSort = function (field) {
					if ($scope.sortable.indexOf(field) > -1) {
						return true;
					} else {
						return false;
					}
				};
				$scope.order = function(predicate, reverse) {
					$scope.content = orderBy($scope.content, predicate, reverse);
					$scope.predicate = predicate;
				};
				$scope.order($scope.sortable[0],false);
				$scope.getNumber = function (num) {
					return new Array(num);
				};
				$scope.goToPage = function (page) {
					$scope.tablePage = page;
				};
			},
			template: angular.element(document.querySelector('#md-table-template')).html()
		};
	});

angular.module('berlinerSchulenApp')
	.directive('mdColresize', function ($timeout) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				scope.$evalAsync(function () {
					$timeout(function(){ $(element).colResizable({
						liveDrag: true,
						fixed: true

					});},100);
				});
			}
		};
	});

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
angular.module('berlinerSchulenApp')
	.filter('startFrom', function() {
		return function(input, start) {
			if ( typeof input !== 'undefined' &&
				typeof start !== 'undefined' ) {
				start = +start; //parse to int
				return input.slice(start);
			} else {
				return null;
			}
		};
	});
