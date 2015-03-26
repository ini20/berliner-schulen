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

		$scope.schools       = [];
		$scope.numberOfPages = function() {
			return Math.ceil($scope.schools.length/$scope.pageSize);
		};

		$scope.$on('updateSchools', function() {
      var schools = schoolFactory.content;

      var icons = {
        blue:  {
          src: 'assets/img/circle_blue_borderless.svg'
        },
        red: {
          src: 'assets/img/circle_red_borderless.svg'
        },
        bluegrey: {
          src: 'assets/img/circle_bluegrey_borderless.svg'
        },
        cyan: {
          src: 'assets/img/circle_cyan_borderless.svg'
        },
        green: {
          src: 'assets/img/circle_green_borderless.svg'
        },
        orange: {
          src: 'assets/img/circle_orange_borderless.svg'
        }
      };

			$scope.schools = [];
			$scope.currentPage = 0;
			if (schools.length > 0) {

				for (var i = schools.length - 1; i >= 0; i--) {
					var school = {
						'name': schools[i].Schulname,
						'district': schools[i].Region,
						'street': schools[i].Strasse  ,
            'zip': schools[i].PLZ + ' Berlin',
						'url': schools[i].Internet,
						'type': schools[i].Schulart
					};

          switch(schools[i].Schulart){
            case 'Grundschule':
              school.icon = icons.orange;
              break;
            case 'Integrierte Sekundarschule':
              school.icon = icons.blue;
              break;
            case 'Gymnasium':
              school.icon = icons.cyan;
              break;
            case "Berufsschule" || 'Berufsfachschule' || 'Berufsschule mit sonderpäd. Aufgaben' || 'Kombinierte berufliche Schule':
              school.icon = icons.green;
              break;
            default:
              school.icon = icons.bluegrey;
              break;
          }
					$scope.schools.push(school);
				}
			}
		});
	}]);

/*
Do we even need pagination? looks cool without

 */
/*
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
			// template: angular.element(document.querySelector('#md-table-template')).html()
			templateUrl: 'list/table.html'
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
//dfg
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
*/
