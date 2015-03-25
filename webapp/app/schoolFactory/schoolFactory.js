'use strict';

angular.module('berlinerSchulenApp')
	.factory('schoolFactory', ['$http', '$rootScope',
		function($http, $rootScope){

		var allSchools = {content:null};
		var schools = {content:null};
		var filter = {};

		schools.initFilter = function(filterProp) {
			return {
				main: 'Seminar',
				street: '',
				districts: [],
				supporter: [],
				allDayCare: false
			};
		};

		/**
		 * set new filter properties but do not apply filter
		 * @param Obj filterProp new filter properties
		 * @return Obj this
		 */
		schools.setFilter = function(filterProp) {

			for( var field in filterProp ) {
				switch(field) {
					case 'main':
						filter.main = filterProp.main;
						break;

					case 'street':
						filter.street = filterProp.street;
						break;

					case 'districts':
						filter.districts = filterProp.districts;
						break;

					case 'supporter':
						filter.supporter = filterProp.supporter;
						break;

					case 'allDayCare':
						filter.allDayCare = filterProp.allDayCare;
						break;
				}

			}

			console.log('---Filter---');
			console.log(filterProp);
			console.log(filter);
			return schools;
		};

		/**
		 * start filtering and broadcast new school set
		 * @return Obj this
		 */
		schools.applyFilter = function() {

			var filteredJson = allSchools.content
			// Filter Schulname
			.filter(function(row) {
				if( row.Schulname !== undefined &&
					row.Schulname.indexOf(filter.main) > -1 ) {
					return true;
				} else {
					return false;
				}
			})
			// Filter Straße
			.filter(function(row) {
				if( row.Strasse !== undefined &&
					row.Strasse.indexOf(filter.street) > -1 ) {
					return true;
				} else {
					return false;
				}
			})
			// Filter Bezirk (Region)
			.filter(function(row) {
				if( filter.districts.length > 0 ){
					for( var dist in filter.districts ) {
						var distName = filter.districts[dist].name;
						if ( row.Region.indexOf(distName) > -1 ) {
							return true;
						}
					}
					return false;
				} else {
					return true;
				}
			})
			// Filter Schulträger (öffentlich|privat)
			.filter(function(row) {
				if( filter.supporter.length > 0 ){
					for( var sup in filter.supporter ) {
						var supName = filter.supporter[sup].name;
						if ( row.Schultraeger.toLowerCase().indexOf(supName.toLowerCase()) > -1 ) {
							return true;
						}
					}
					return false;
				} else {
					return true;
				}
			})
			// Filter Ganztagsbetrieb
			.filter(function(row) {
				if( filter.allDayCare === true ){
					if ( row.Ganztagsbetrieb !== undefined ||
						(row.spez_Angebote !== undefined && row.spez_Angebote.toLowerCase().indexOf("ganztagsschule") > -1)) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			})
			;

			schools.content = filteredJson;

			schools.publishData();

			return schools;
		};

		schools.publishData = function() {
			console.log("---publishData---");
			console.log(schools.content);
			$rootScope.$broadcast('updateSchools');
		};

		schools.getJson = function() {

			$http.get('data/schools2.json').success(function(data) {
				allSchools.content = data;
				schools.content    = data;

				schools.setFilter({});
				schools.applyFilter();
			});
		};

		filter = schools.initFilter();
		schools.getJson();

		return schools;
	}]);
