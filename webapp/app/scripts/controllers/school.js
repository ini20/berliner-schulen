'use strict';

/**
 * @ngdoc function
 * @name schooldataApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the schooldataApp
 */
angular.module('schooldataApp')
  .controller('SchoolCtrl', ['$scope', '$routeParams', 'es', function ($scope, $routeParams, es) {
    $scope.schoolId = $routeParams.schoolId;

    $scope.schoolData = {};

    var body = {};
    body.query = {
    	bool: {
    		must : [{
	    	query_string: {
	            default_field: 'school.bsn',
	            query: $routeParams.schoolId
	        }}]
    }};

    body.size = 1;

    es.search({
	        index: sp.config.elasticsearch.index,
	        type: 'school',
	        body: body
	    }).then(function (returned) {
	    	$scope.schoolData = {}; // reset from possible previous value
	    	// we found the school
	    	if (returned.hits.total > 0) {
	    		$scope.schoolData = returned.hits.hits[0]._source;
	    		console.log($scope.schoolData);
	    	}
	    }, function(error) {
	    	console.log(error.message);
	    });
  }]);
