'use strict';

angular.module('berlinerSchulenApp')
	.controller('MapCtrl', ['$scope', 'schoolFactory', function($scope, schoolFactory){
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
			data: {markers: {}}
		});

		$scope.data.markers = {};
		angular.extend($scope.data, {
			markers: {
				m1: {
					lat: 52.5153601,
					lng: 13.3833154,
					compileMessage: false,
					message: 'I\'m a static marker',
				}
			}
		});

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

				if ( schools.length - i > 100) {
					break;
				}
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

/** *********** */
/** OLD VERSION */
/** *********** */

// angular.module('berlinerSchulenApp')
//     .controller('MapCtrl', ['$scope', '$http', '$interpolate', '$timeout', 'mapService', function ($scope, $http, $interpolate, $timeout, mapService) {
//         var center = new OpenLayers.Geometry.Point(13.383333, 52.516667)
//             .transform('EPSG:4326', 'EPSG:3857');

//         var mapbox = new OpenLayers.Layer.XYZ("Berliner Schulen Karte",
//             ["http://a.tiles.mapbox.com/v4/obstschale.kp8hf045/${z}/${x}/${y}.png?access_token=pk.eyJ1Ijoib2JzdHNjaGFsZSIsImEiOiJvSFdVbmRRIn0.2aQ9TaMbMbyrAuFQh_icXg"], {
//             sphericalMercator: true,
//         });

//         $scope.map = new OpenLayers.Map('map', {
//             projection: 'EPSG:3857',
//             layers: [mapbox],
//             center: center.getBounds().getCenterLonLat(),
//             zoom: 10,
//         });

//         var popupTemplate;
//         $http({
//                 method: 'GET',
//                 url: sp.config.map.feature_bubble,
//                 cache: true
//             }).
//             success(function(data) {
//                 popupTemplate = $interpolate(data);
//             }).
//             error(function() {
//                 popupTemplate = $interpolate('<div data-alert class="alert-box alert">Template not found!</div>');
//         });

//         var overlay = new OpenLayers.Layer.Vector('Overlay', {
//             eventListeners: {
//                 featureselected: function(evt){
//                     var feature = evt.feature;
//                     var popup = new OpenLayers.Popup.FramedCloud('popup',
//                         OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
//                         null,
//                         popupTemplate(feature.data),
//                         null,
//                         true,
//                         null
//                     );
//                     popup.autoSize = true;
//                     popup.maxSize = new OpenLayers.Size(400,800);
//                     popup.fixedRelativePosition = true;
//                     feature.popup = popup;
//                     $scope.map.addPopup(popup);
//                 },
//                 featureunselected: function(evt){
//                     var feature = evt.feature;
//                     $scope.map.removePopup(feature.popup);
//                     feature.popup.destroy();
//                     feature.popup = null;
//                 }
//             }
//         });

//         var selector = new OpenLayers.Control.SelectFeature(overlay, {
//             autoActivate: true,
//             hover: false,
//             toggle: true,
//         });
//         $scope.map.addControl(new OpenLayers.Control.LayerSwitcher());
//         $scope.map.addControl(selector);
//         // $scope.map.addLayer(mapnik);
//         $scope.map.addLayer(overlay);

//         $scope.display_done = true;

//         $scope.$on('updateMapMarkers', function() {
//             overlay.removeAllFeatures();
//             if (mapService.markers.length > 0) {
//                 $scope.display_done = false;
//                 var cnt = 0.0;
//                 angular.forEach(mapService.markers, function(marker) {
//                     $timeout(function(){
//                         overlay.addFeatures([marker]);
//                         cnt += 1.0;
//                         if (cnt >= mapService.markers.length) {
//                             $scope.display_done = true;
//                         }
//                     }, 1);
//                 });
//             }
//         });
//     }]);
