'use strict';

angular.module('berlinerSchulenApp')
	.controller('SchoolCtrl', ['$scope', '$stateParams', 'schoolFactory', 'LxProgressService',
		function ($scope, $stateParams, schoolFactory, LxProgressService) {

		$scope.loaded = false;
		$scope.err = false;

			/* This is our Map setup.
			 *
			 * It uses the OSM tiles and is set to zoom 15.
			 * The map is centered to Berlin and zooming with the mouse
			 * is disabled. It is disabled because it made navigation on the
			 * page difficult.
			 */
			angular.extend($scope, {
				defaults: {
					tileLayer: 'http://api.tiles.mapbox.com/v4/obstschale.kp8hf045/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoib2JzdHNjaGFsZSIsImEiOiJvSFdVbmRRIn0.2aQ9TaMbMbyrAuFQh_icXg',
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
				icons: {
					blue_icon: {
						iconUrl: 'assets/img/circle_blue.svg',
						iconSize: [20, 20],
						iconAnchor: [7, 7],
						popupAnchor: [0, -5]
					},
					orange_icon: {
						iconUrl: 'assets/img/circle_orange.svg',
						iconSize: [20, 20],
						iconAnchor: [7, 7],
						popupAnchor: [0, -5]
					},
					bluegrey_icon: {
						iconUrl: 'assets/img/circle_bluegrey.svg',
						iconSize: [20, 20],
						iconAnchor: [7, 7],
						popupAnchor: [0, -5]
					},
					cyan_icon: {
						iconUrl: 'assets/img/circle_cyan.svg',
						iconSize: [20, 20],
						iconAnchor: [7, 7],
						popupAnchor: [0, -5]
					},
					green_icon: {
						iconUrl: 'assets/img/circle_green.svg',
						iconSize: [20, 20],
						iconAnchor: [7, 7],
						popupAnchor: [0, -5]
					},
					red_icon: {
						iconUrl: 'assets/img/circle_red.svg',
						iconSize: [20, 20],
						iconAnchor: [7, 7],
						popupAnchor: [0, -5]
					}
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
							message: 'Das ist Berlin. Für den Fall, dass<br>du das noch nicht wusstest :)',
							icon: {}
						}
					}
				},
			});

			$scope.school = {};

		$scope.loadSchool = function(school) {

			if (school.bsn === undefined ) {
				LxProgressService.circular.hide();
				$scope.school.bsn = $stateParams.BSN;
				$scope.err = true;
				return 0;
			}

			$scope.loaded = true;
			LxProgressService.circular.hide();

			$scope.school = school;

				// Prefix Phone with (030)
				$scope.school.Telefon = '(030) ' + school.Telefon;

				// Build addresse
				$scope.school.Adresse = school.Strasse + ', ' + school.PLZ + ' Berlin';

				var latitude;
				var longitude;
				if (school.lat !== undefined || school.lon !== undefined) {
					latitude = parseFloat(school.lat);
					longitude = parseFloat(school.lon);
					$scope.berlin.lat = latitude;
					$scope.berlin.lng = longitude;
					$scope.data.markers.m1.lat = latitude;
					$scope.data.markers.m1.lng = longitude;

					//choose the icon depending on schooltype

					var newIcon = null;
					switch(school.Schulart){
						case 'Grundschule':
							newIcon = $scope.icons.orange_icon;
							break;
						case 'Integrierte Sekundarschule':
							newIcon = $scope.icons.blue_icon;
							break;
						case 'Gymnasium':
							newIcon = $scope.icons.cyan_icon;
							break;
						case 'Berufsschule':
						case 'Berufsfachschule':
						case 'Berufsschule mit sonderpäd. Aufgaben':
						case 'Kombinierte berufliche Schule':
							newIcon = $scope.icons.green_icon;
							break;
						default:
							newIcon = $scope.icons.bluegrey_icon;
							break;
					}

				angular.extend($scope.data.markers.m1, {
					icon: newIcon
				});
			}
		};


		this.addCallback = function() {
			$scope.school = {};
			var bsn = $stateParams.BSN;
			schoolFactory.addSchoolCallback(bsn, $scope.loadSchool);
		};

		LxProgressService.circular.show('#5fa2db', '#feedback');
		this.addCallback();
		schoolFactory.populateSchoolDetails();
	}]);
