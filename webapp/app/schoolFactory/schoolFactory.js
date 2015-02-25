'use strict';

angular.module('berlinerSchulenApp')
	.factory('schoolFactory', ['$http', '$rootScope', function($http, $rootScope){
		var schools = {content:null};

		schools.updateFilter = function(val) {
			schools.content = [val];
			if (val === 'new' || val === '') {
				schools.getJson();
			}
		};

		schools.getJson = function() {

			$http.get('data/schools.json').success(function(data) {
				// you can do some processing here
				schools.content = data;
				$rootScope.$broadcast('updateViews');
			});
		};

		schools.getJson();

		return schools;
	}]);
