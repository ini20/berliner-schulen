'use strict';

angular.module('berlinerSchulenApp', [
	'leaflet-directive',
	'ui.router',
	'ngMaterial',
	'lumx']);

angular.module('berlinerSchulenApp')
	.config(function($stateProvider, $urlRouterProvider) {

		// For any unmatched url, redirect to /
		$urlRouterProvider.otherwise('/');

		$stateProvider
		.state('index', {
			url: '/',
			views: {
				'view1': {
					templateUrl: 'filterAndMap/filterAndMap.html'
				},
				'view2': {
					controller: 'ListCtrl',
					templateUrl: 'list/list.html'
				}
			}
		})
		.state('school', {
			url: '/school/{BSN:[0-9]{2}[A-Z][0-9]{2}}',
			views: {
				'view1': {
					controller: 'SchoolCtrl',
					templateUrl: 'school/school.html'
				}
			}
		})
		.state('statistics', {
			url: '/statistics',
			views: {
				'view1': {
					controller: 'StatisticsCtrl',
					templateUrl: 'statistics/statistics.html'
				}
			}
		})
		.state('imprint', {
			url: '/impressum',
			views: {
				'view1': {
					controller: 'AboutCtrl',
					templateUrl: 'about/about.html'
				}
			}
		});
	});
