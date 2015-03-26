'use strict';

angular.module('berlinerSchulenApp')
	.factory('schoolFactory', ['$http', '$rootScope',
		function($http, $rootScope){

		var allSchools = {content:null};
		var schools = {content:null};
		var filter = {};
		var filterCallbacks = [];

		schools.initFilter = function(filterProp) {
			return {
				main: 'Marie',
				street: '',
				districts: [],
				supporter: [],
				allDayCare: false,
				secEdu: false,
				dual: false,
				languages: [],
				accessibilities: [],
				courses: [],
				schooltypes: [],
			};
		};

		schools.addCallback = function(field, callback) {
			filterCallbacks.push({ field: field, cb: callback });
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

					case 'secEdu':
						filter.secEdu = filterProp.secEdu;
						break;

					case 'dual':
						filter.dual = filterProp.dual;
						break;

					case 'languages':
						filter.languages = filterProp.languages;
						break;

					case 'accessibilities':
						filter.accessibilities = filterProp.accessibilities;
						break;

					case 'courses':
						filter.courses = filterProp.courses;
						break;

					case 'schooltypes':
						filter.schooltypes = filterProp.schooltypes;
						break;
				}

			}

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
						if ( distName !== '' && row.Region.indexOf(distName) > -1 ) {
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
						if ( supName !== '' && row.Schultraeger.toLowerCase().indexOf(supName.toLowerCase()) > -1 ) {
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
			// Filter zweiter Bildungsweg
			.filter(function(row) {
				if( filter.secEdu === true ){
					if (row.ZweiterBildungsweg !== undefined) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			})
			// Filter Duales Lernen
			.filter(function(row) {
				if( filter.dual === true ){
					if (row.DualesLernen !== undefined) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			})
			// Filter Fremdsprachen
			.filter(function(row) {
				if( filter.languages.length > 0 ){
					for( var sup in filter.languages ) {
						var supName = filter.languages[sup].name.toLowerCase();
						if (supName !== '' &&
							row.Fremdsprachen !== undefined) {
							for (var i = row.Fremdsprachen.length - 1; i >= 0; i--) {
								if(row.Fremdsprachen[i].toLowerCase().indexOf(supName) > -1 ) {
									return true;
								}
							}
						}
					}
					return false;
				} else {
					return true;
				}
			})
			// Filter Barrierefreiheit
			.filter(function(row) {
				if( filter.accessibilities.length > 0 ){
					for( var acc in filter.accessibilities ) {
						var accName = filter.accessibilities[acc].name.toLowerCase();
						if (accName !== '' &&
							row.Bauten !== undefined) {
							for (var i = row.Bauten.length - 1; i >= 0; i--) {
								if(row.Bauten[i].toLowerCase().indexOf(accName) > -1 ) {
									return true;
								}
							}
						}
					}
					return false;
				} else {
					return true;
				}
			})
			// Filter Leistungskurse
			.filter(function(row) {
				if( filter.courses.length > 0 ){
					for( var course in filter.courses ) {
						var courseName = filter.courses[course].name.toLowerCase();
						if (courseName !== '' &&
							row.Leistungskurse !== undefined) {
							for (var i = row.Leistungskurse.length - 1; i >= 0; i--) {
								if(row.Leistungskurse[i].toLowerCase().indexOf(courseName) > -1 ) {
									return true;
								}
							}
						}
					}
					return false;
				} else {
					return true;
				}
			})
			// Filter Schulart
			.filter(function(row) {
				if( filter.schooltypes.length > 0 ){
					for( var type in filter.schooltypes ) {
						var typeName = filter.schooltypes[type].name;
						if ( typeName !== '' && row.Schulart.indexOf(typeName) > -1 ) {
							return true;
						}
					}
					return false;
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
			$rootScope.$broadcast('updateSchools');
		};

		schools.getJson = function() {

			$http.get('data/data.json').success(function(data) {
				allSchools.content = data;
				schools.content    = data;

				schools.setFilter({});
				schools.applyFilter();
				schools.populateFilterChoices();
			});
		};

		schools.populateFilterChoices = function() {

			var tmp = [];
			for(var i = filterCallbacks.length - 1; i >= 0; i--) {
				tmp.push([]);
			}

			for(i = allSchools.content.length - 1; i >= 0; i--) {
				for (var j = filterCallbacks.length - 1; j >= 0; j--) {

					var value = '';
					var field = filterCallbacks[j].field;
					var school = allSchools.content[i];


					switch(field) {
						case 'Region':
							if(school.Region !== undefined) {
								value = school.Region;
							}
							break;

						case 'Schultraeger':
							if(school.Schultraeger !== undefined) {
								value = school.Schultraeger;
							}
							break;

						case 'Bauten':
							if(school.Bauten !== undefined) {
								value = school.Bauten;
							}
							break;

						case 'Leistungskurse':
							if(school.Leistungskurse !== undefined) {
								value = school.Leistungskurse;
							}
							break;

						case 'Schulart':
							if(school.Schulart !== undefined) {
								value = school.Schulart;
							}
							break;

						default:
							value = '';
							break;

						// case 'Fremdsprachen':
						// 	value = school.Fremdsprachen;
						// 	break;
					}

					if(value.constructor !== Array &&
						!tmp[j].contains(value)) {
						tmp[j].push(value);
					} else if (value.constructor === Array) {
						for (var g = value.length - 1; g >= 0; g--) {
							if(!tmp[j].contains(value[g])) {
								tmp[j].push(value[g]);
							}
						}
					}
				}
			}

			for(i = filterCallbacks.length - 1; i >= 0; i--) {
				filterCallbacks[i].cb.call(this, tmp[i]);
			}
		};

		schools.getSchoolByBSN = function(bsn) {
			return {name: 'Sample', type: 'asfd'};
		};

		filter = schools.initFilter();
		schools.getJson();

		return schools;
	}]);

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
};
