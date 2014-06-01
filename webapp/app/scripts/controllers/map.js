'use strict';

angular.module('schooldataApp')
  .controller('MapCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.map=new OpenLayers.Map('map');
    $scope.map.addControl(new OpenLayers.Control.LayerSwitcher());
    var a=new OpenLayers.Layer.OSM.Mapnik('Maplint');
    $scope.map.addLayer(a);
    $scope.map.zoomToMaxExtent();
    var markers=new OpenLayers.Layer.Markers('Markers');
    $scope.map.addLayer(markers);
    var b=new OpenLayers.LonLat(13.408056,52.518611).transform(new OpenLayers.Projection('EPSG:4326'), $scope.map.getProjectionObject());
    $scope.map.setCenter(b,12);
    
    $scope.loadMarkers = function() {
      $http.get().success(function(data) {
	
      });
    };
  }]);
