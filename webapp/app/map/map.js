'use strict';

angular.module('berlinerSchulenApp')
	.controller('MapCtrl', ['$scope', 'schoolFactory', function($scope, schoolFactory){

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
				markers: {
					// The following is a sample marker and is only shown if
					// the JSON file with all schools cannot be fetched and
					// therefore no data is available to be shown.
					m1: {
						lat: 52.5153601,
						lng: 13.3833154,
						compileMessage: false,
						message: 'Das ist Berlin. Für den Fall, dass<br>du das noch nicht wusstest :)',
					}
				}
			}
		});

		// Tell the schoolFactory to get the JSON file which contains
		// all the data.
		schoolFactory.getJson();

		/* This $on method is called if the factory has a new dataset
		 * available and broadcasts it to all controllers which subscribed
		 * to this name `updateSchools`.
		 * -> This is kind of an Event-Driven-Design
		 */
		$scope.$on('updateSchools', function() {

			/* Simple function to check if a value is a float */
			function isFloat(n) {
				return n === +n && n !== (n|0);
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
				if ( isFloat(schools[i].latitude) &&
					 isFloat(schools[i].longitude) ) {

					// Using an array here b/c with push() it is easy to
					// add new markers (object) to the array.
					tmpMarkersArr.push({
							lat: schools[i].latitude,
							lng: schools[i].longitude,
							compileMessage: false,
							message: schools[i].bsn
					});

				}

				// if ( schools.length - i > 100) {
				// 	break;
				// }
			}

			// the markers object, which is used by the map does not want
			// an array but an object list. Therefore this simple reduce()
			// method converts our array into in object list.
			var tmpMarkersObj = tmpMarkersArr.reduce(function(o, v, i) {
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

}]);
