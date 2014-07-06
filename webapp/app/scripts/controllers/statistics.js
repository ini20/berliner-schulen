'use strict';

/**
 * @ngdoc function
 * @name schooldataApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the schooldataApp
 */
angular.module('schooldataApp')
    .controller('StatisticsCtrl', ['$scope', '$http', function ($scope, $http) {
        var ctrl = this;

        var center = new OpenLayers.Geometry.Point(13.383333, 52.516667)
            .transform('EPSG:4326', 'EPSG:3857');

        var mapnik = new OpenLayers.Layer.OSM.Mapnik('Maplint');

        $scope.map = new OpenLayers.Map('map', {
            projection: 'EPSG:3857',
            layers: [mapnik],
            center: center.getBounds().getCenterLonLat(),
            zoom: 10
        });
        $scope.map.addControl(new OpenLayers.Control.LayerSwitcher());

        var heatmap = new OpenLayers.Layer.Heatmap('Betreuungsschlüssel', $scope.map, mapnik, {
            visible: true, radius: 15, "gradient": { 0.15: "rgb(0,255,0)", 0.35: "yellow", 0.75: "rgb(255,0,0)" }
        }, {isBaseLayer: false, opacity: 0.3, projection: new OpenLayers.Projection('EPSG:4326', 'EPSG:4326')});
        $scope.map.addLayer(heatmap);

        this.transformHeatmapData = function(data) {
            var transformedData = {max : data.max, data:[]};

            data.data.forEach(function(school) {
                transformedData.data.push({
                    lonlat: new OpenLayers.LonLat(school.lon, school.lat),
                    count: school.quot
                });
            });

            console.log(transformedData);
            heatmap.setDataSet(transformedData);
        };

        $http({method: 'GET', url: sp.config.heatmap.data, cache: true}).
            success(function(data, status, headers, config) {
                ctrl.transformHeatmapData(data);
            }).
            error(function(data, status, headers, config) {
                // ignore for now
            });
    }]);
