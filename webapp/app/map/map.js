'use strict';

angular.module('berlinerSchulenApp')
	.controller('MapCtrl', ['$scope', '$rootScope', 'schoolFactory', '$window', function ($scope, $rootScope, schoolFactory, $window) {

		/* This is our Map setup.
		 *
		 * It uses the OSM tiles and is set to zoom 14.
		 * The map is centered to Berlin and zooming with the mouse
		 * is disabled. It is disabled because it made navigation on the
		 * page difficult.
		 */
		angular.extend($scope, {
			defaults: {
				tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
				maxZoom: 14,
				path: {
					weight: 10,
					color: '#800000',
					opacity: 1
				},
				scrollWheelZoom: false
			},
			berlin: {
				lat: 52.5153601,
				lng: 13.3833154,
				zoom: 10
			},
			data: {
				markers: {}
			},
			icons: {
				blue_icon: {
					iconUrl: 'assets/img/circle_blue_borderless.svg',
					iconSize: [15, 15],
					iconAnchor: [7, 7],
					popupAnchor: [0, -5]
				},
				orange_icon: {
					iconUrl: 'assets/img/circle_orange_borderless.svg',
					iconSize: [15, 15],
					iconAnchor: [7, 7],
					popupAnchor: [0, -5]
				},
				bluegrey_icon: {
					iconUrl: 'assets/img/circle_bluegrey_borderless.svg',
					iconSize: [15, 15],
					iconAnchor: [7, 7],
					popupAnchor: [0, -5]
				},
				cyan_icon: {
					iconUrl: 'assets/img/circle_cyan_borderless.svg',
					iconSize: [15, 15],
					iconAnchor: [7, 7],
					popupAnchor: [0, -5]
				},
				green_icon: {
					iconUrl: 'assets/img/circle_green_borderless.svg',
					iconSize: [15, 15],
					iconAnchor: [7, 7],
					popupAnchor: [0, -5]
				},
				red_icon: {
					iconUrl: 'assets/img/circle_red_borderless.svg',
					iconSize: [15, 15],
					iconAnchor: [7, 7],
					popupAnchor: [0, -5]
				}
			}
		});

		/* This $on method is called if the factory has a new dataset
		 * available and broadcasts it to all controllers which subscribed
		 * to this name `updateSchools`.
		 * -> This is kind of an Event-Driven-Design
		 */
		$scope.$on('updateSchools', function () {

			/* Simple function to check if a value is a float */
			function isFloat(n) {
				return n === +n && n !== (n | 0);
			}

			var tmpMarkersArr = [];
			var schools = schoolFactory.content;

			for (var i = schools.length - 1; i >= 0; i--) {

				/* ---Validation---
				 * We have to check if lat and long are set. If no
				 * lat and long numbers are given the whole update method
				 * would break and no marker after this corrupt one will
				 * be set
				 */
				var lat = parseFloat(schools[i].lat);
				var lon = parseFloat(schools[i].lon);
				if (isFloat(lat) &&
					isFloat(lon)) {

					// Create Marker Tooltip
					var tooltip = '<strong>' + schools[i].Schulname + '</strong><br>';
					tooltip += schools[i].Strasse + ', ' + schools[i].PLZ + '<br><br>';
					tooltip += '<em>' + schools[i].Schulart + '</em><br>';
					tooltip += '<a href=#/school/' + schools[i].bsn + '>Details</a>';

					// Using an array here b/c with push() it is easy to
					// add new markers (object) to the array.
					var marker = {
						lat: lat,
						lng: lon,
						compileMessage: false,
						message: tooltip,
						bsn: schools[i].bsn
					};

					//choose the icon depending on schooltype
					switch (schools[i].Schulart) {
						case 'Grundschule':
							marker.icon = $scope.icons.orange_icon;
							break;
						case 'Integrierte Sekundarschule':
							marker.icon = $scope.icons.blue_icon;
							break;
						case 'Gymnasium':
							marker.icon = $scope.icons.cyan_icon;
							break;
						case 'Berufsschule':
						case 'Berufsfachschule':
						case 'Berufsschule mit sonderpäd. Aufgaben':
						case 'Kombinierte berufliche Schule':
							marker.icon = $scope.icons.green_icon;
							break;
						default:
							marker.icon = $scope.icons.bluegrey_icon;
							break;
					}
					tmpMarkersArr.push(marker);
				}

				// if ( schools.length - i > 100) {
				// 	break;
				// }
			}

			// the markers object, which is used by the map does not want
			// an array but an object list. Therefore this simple reduce()
			// method converts our array into in object list.
			var tmpMarkersObj = tmpMarkersArr.reduce(function (o, v, i) {
				o[i] = v;
				return o;
			}, {});

			/* Set the new markers on to the map using angular.extend
			 * to update the markers object. Before we do that we empty
			 * all the object to remove old markers
			 */
			$scope.data.markers = {};
			angular.extend($scope.data, {
				markers: tmpMarkersObj
			});
		});

		/* This sets the height of the map according to the height of the
		 * window when the page is loaded. If the window is resized the
		 * height of the map stays as is.
		 */
		var w = angular.element($window);
		var cachedHeight = -1;

		$scope.getWindowHeight = function () {
			if (cachedHeight == -1)
				cachedHeight = w.height() * 0.7;
			return cachedHeight;
		};

		/*
		 * This centers the map to the provided coordinates and
		 * shows a pop over
		 */
		var mapCenterRequest = $scope.$on('mapCenterRequest', function (sender, lat, lon, bsn) {
			sender.currentScope.berlin.lat = lat;
			sender.currentScope.berlin.lng = lon;

			for(var i in sender.currentScope.data.markers)
			{
				var marker = sender.currentScope.data.markers[i];
				if(marker.bsn == bsn)
				{
					marker.focus = true;
					break;
				}
			}
		});
		$scope.$on('destroy', mapCenterRequest);
	}]);
