'use strict';

angular.module('schooldataApp')
    .controller('MapCtrl', ['$scope', '$http', 'mapService', function ($scope, $http, mapService) {
        console.log('mapService', mapService);

        var mapnik = new OpenLayers.Layer.OSM.Mapnik('Maplint');
        var overlay = new OpenLayers.Layer.Vector('Overlay');
        var center = new OpenLayers.Geometry.Point(13.383333, 52.516667)
            .transform('EPSG:4326', 'EPSG:3857');

        $scope.map = new OpenLayers.Map('map', {
            projection: "EPSG:3857",
            layers: [mapnik, overlay],
            center: center.getBounds().getCenterLonLat(),
            zoom: 10
        });
        $scope.map.addControl(new OpenLayers.Control.LayerSwitcher());
        $scope.map.addLayer(mapnik);
        $scope.map.addLayer(overlay);

        $scope.total = 0;

        $scope.$on('updateMapMarkers', function() {
            console.log(mapService.markers);
            overlay.removeAllFeatures();
            overlay.addFeatures(mapService.markers);
            $scope.total = mapService.total;
        });
    }]);
