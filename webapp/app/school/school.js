'use strict';

angular.module('berlinerSchulenApp')
	.controller('SchoolCtrl', ['$scope', '$stateParams', 'schoolFactory',
		function ($scope, $stateParams, schoolFactory) {

		/* This is our Map setup.
		 *
		 * It uses the OSM tiles and is set to zoom 15.
		 * The map is centered to Berlin and zooming with the mouse
		 * is disabled. It is disabled because it made navigation on the
		 * page difficult.
		 */
		angular.extend($scope, {
			defaults: {
				tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
				maxZoom: 15,
				path: {
					weight: 10,
					color: '#800000',
					opacity: 1
				},
				scrollWheelZoom: false,
				zoomControl: false,
				dragging: false,
				touchZoom: false,
				doubleClickZoom: false
			},
			berlin: {
				lat: 52.5153601,
				lng: 13.3833154,
				zoom: 15
			},
			data: {
				markers: {
					// The following is a sample marker and is only shown if
					// the JSON file with all schools cannot be fetched and
					// therefore no data is available to be shown.
					m1: {
						lat: 52.5153601,
						lng: 13.3833154,
						compileMessage: false,
						// message: 'Das ist Berlin. Für den Fall, dass<br>du das noch nicht wusstest :)'
					}
				}
			},
			icons: {
				blue_icon: {
					iconUrl: 'assets/img/circle_blue.svg',
					iconSize: [15,15],
					iconAnchor: [7,7],
					popupAnchor: [0,-5]
				},
				orange_icon: {
					iconUrl: 'assets/img/circle_orange.svg',
					iconSize: [15,15],
					iconAnchor: [7,7],
					popupAnchor: [0,-5]
				},
				bluegrey_icon: {
					iconUrl: 'assets/img/circle_bluegrey.svg',
					iconSize: [15,15],
					iconAnchor: [7,7],
					popupAnchor: [0,-5]
				},
				cyan_icon: {
					iconUrl: 'assets/img/circle_cyan.svg',
					iconSize: [15,15],
					iconAnchor: [7,7],
					popupAnchor: [0,-5]
				},
				green_icon: {
					iconUrl: 'assets/img/circle_green.svg',
					iconSize: [15,15],
					iconAnchor: [7,7],
					popupAnchor: [0,-5]
				},
				red_icon: {
					iconUrl: 'assets/img/circle_red.svg',
					iconSize: [15,15],
					iconAnchor: [7,7],
					popupAnchor: [0,-5]
				}
			}
		});

		$scope.school = {};
		$scope.text = $stateParams.BSN;

		this.loadSchool = function() {
			var bsn = $stateParams.BSN;
			$scope.school = schoolFactory.getSchoolByBSN(bsn);
		};

		this.loadSchool();
	}]);
