'use strict';

angular.module('berlinerSchulenApp', [
	'leaflet-directive',
	'ngRoute']);

angular.module('berlinerSchulenApp')
	.config(['$routeProvider', function ($routeProvider) {

		$routeProvider
			.when('/', {templateUrl: 'views/main.html', reloadOnSearch: false})
			.when('/impressum', {templateUrl: 'views/about.html'})
			.when('/schools/:schoolId', {templateUrl: 'views/school.html'})
			.when('/statistics', {templateUrl: 'views/statistics.html'})
			.otherwise({redirectTo: '/'});

	}]);

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
angular.module('berlinerSchulenApp')
	.filter('startFrom', function() {
		return function(input, start) {
			start = +start; //parse to int
			return input.slice(start);
		}
	});
