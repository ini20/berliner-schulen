'use strict';

angular.module('berlinerSchulenApp')
	.factory('schoolFactory', ['$http', '$rootScope',
		function($http, $rootScope){

		var allSchools = {content:null};
		var schools = {content:null};
		var filter = {};

		/**
		 * set new filter properties but do not apply filter
		 * @param Obj filerProp new filter properties
		 * @return Obj this
		 */
		schools.setFilter = function(filterProp) {
			filter = filterProp;
			return schools;
		};

		/**
		 * start filtering and broadcast new school set
		 * @return Obj this
		 */
		schools.applyFilter = function() {
			// console.log(schools.content);
			var filteredJson = allSchools.content.filter(function (row) {
				console.log(row.district.indexOf(filter.main));
				if(row.district.indexOf(filter.main) > -1) {
					return true;
				} else {
					return false;
				}
			});
			console.log(filteredJson);
			schools.content = filteredJson;
			$rootScope.$broadcast('updateSchools');

			return schools;
		};

		schools.getJson = function() {

			$http.get('data/schools.json').success(function(data) {
				// you can do some processing here
				allSchools.content = data;
				schools.content    = data;
				$rootScope.$broadcast('updateSchools');
			});
		};

		schools.getJson();

		return schools;
	}]);
