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
					controller: 'FilterCtrl',
					templateUrl: 'filter/filter.html'
				},
				'view2': {
					controller: 'MapCtrl',
					templateUrl: 'map/map.html'
				},
				'view3': {
					controller: 'ListCtrl',
					templateUrl: 'list/list.html'
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
