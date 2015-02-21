'use strict';

angular.module('schooldataApp')
    .controller('MapCtrl', ['$scope', '$http', '$interpolate', '$timeout', 'mapService', function ($scope, $http, $interpolate, $timeout, mapService) {
        var center = new OpenLayers.Geometry.Point(13.383333, 52.516667)
            .transform('EPSG:4326', 'EPSG:3857');

        var mapbox = new OpenLayers.Layer.XYZ("Berliner Schulen Karte",
            ["http://a.tiles.mapbox.com/v4/obstschale.kp8hf045/${z}/${x}/${y}.png?access_token=pk.eyJ1Ijoib2JzdHNjaGFsZSIsImEiOiJvSFdVbmRRIn0.2aQ9TaMbMbyrAuFQh_icXg"], {
            sphericalMercator: true,
        });

        $scope.map = new OpenLayers.Map('map', {
            projection: 'EPSG:3857',
            layers: [mapbox],
            center: center.getBounds().getCenterLonLat(),
            zoom: 10,
        });

        var popupTemplate;
        $http({
                method: 'GET',
                url: sp.config.map.feature_bubble,
                cache: true
            }).
            success(function(data) {
                popupTemplate = $interpolate(data);
            }).
            error(function() {
                popupTemplate = $interpolate('<div data-alert class="alert-box alert">Template not found!</div>');
        });

        var overlay = new OpenLayers.Layer.Vector('Overlay', {
            eventListeners: {
                featureselected: function(evt){
                    var feature = evt.feature;
                    var popup = new OpenLayers.Popup.FramedCloud('popup',
                        OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                        null,
                        popupTemplate(feature.data),
                        null,
                        true,
                        null
                    );
                    popup.autoSize = true;
                    popup.maxSize = new OpenLayers.Size(400,800);
                    popup.fixedRelativePosition = true;
                    feature.popup = popup;
                    $scope.map.addPopup(popup);
                },
                featureunselected: function(evt){
                    var feature = evt.feature;
                    $scope.map.removePopup(feature.popup);
                    feature.popup.destroy();
                    feature.popup = null;
                }
            }
        });

        var selector = new OpenLayers.Control.SelectFeature(overlay, {
            autoActivate: true,
            hover: false,
            toggle: true,
        });
        $scope.map.addControl(new OpenLayers.Control.LayerSwitcher());
        $scope.map.addControl(selector);
        // $scope.map.addLayer(mapnik);
        $scope.map.addLayer(overlay);

        $scope.display_done = true;

        $scope.$on('updateMapMarkers', function() {
            overlay.removeAllFeatures();
            if (mapService.markers.length > 0) {
                $scope.display_done = false;
                var cnt = 0.0;
                angular.forEach(mapService.markers, function(marker) {
                    $timeout(function(){
                        overlay.addFeatures([marker]);
                        cnt += 1.0;
                        if (cnt >= mapService.markers.length) {
                            $scope.display_done = true;
                        }
                    }, 1);
                });
            }
        });
    }]);
