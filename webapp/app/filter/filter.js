'use strict';

angular.module('berlinerSchulenApp')
	.controller('FilterCtrl', ['$scope', '$timeout', '$mdSidenav', 'schoolFactory',
		function($scope, $timeout, $mdSidenav, schoolFactory) {

		$scope.searchFilter = {
			'main': 'hallo'
		};

		$scope.filter = function() {
			$timeout(function(){
				schoolFactory.setFilter($scope.searchFilter);
				schoolFactory.applyFilter();
			}, 600);
		};

		$scope.showFilter = false;

		$scope.toogleFilter = function() {
			$scope.showFilter = ( $scope.showFilter === true ) ? false : true;
		};

		$scope.search = 'Marie';

		$scope.updateFilter = function() {
			var tmp = $scope.search;
			console.log(tmp);
			schoolFactory.setFilter(tmp)
				.applyFilter();
		};

		// Multiple select with local data
		$scope.people = [
		    { name: 'Adam',      email: 'adam@email.com',      age: 10 },
		    { name: 'Amalie',    email: 'amalie@email.com',    age: 12 },
		    { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30 },
		    { name: 'Samantha',  email: 'samantha@email.com',  age: 31 },
		    { name: 'Estefanía', email: 'estefanía@email.com', age: 16 },
		    { name: 'Natasha',   email: 'natasha@email.com',   age: 54 },
		    { name: 'Nicole',    email: 'nicole@email.com',    age: 43 },
		    { name: 'Adrian',    email: 'adrian@email.com',    age: 21 }
		];

		$scope.selectedPersons = [$scope.people[2], $scope.people[4]];


	}]);

// angular.module('schooldataApp')
// 	.controller('FilterCtrl', ['$scope', '$http', '$location', '$window', 'es', 'mapService', function ($scope, $http, $location, $window, es, mapService) {

// 		$scope.showFilterBox = false;
// 		$scope.toggleFilterBox = function() {
// 			$scope.showFilterBox = $scope.showFilterBox === false ? true: false;
// 		};

// 		es.search({
// 			index: sp.config.elasticsearch.index,
// 			type: 'school',
// 			body: {
// 				size: 0,
// 				aggs: {
// 					nested: {
// 						nested: {
// 							path: 'address'
// 						},
// 						aggs: {
// 							districts: {
// 								terms: {
// 									field: 'address.district',
// 									size: 0,
// 									order: {
// 									  _term: 'asc'
// 									}
// 								}
// 							}
// 						}
// 					},
// 					schooltypes: {
// 						terms: {
// 							field: 'schooltype',
// 							size: 0,
// 							order: {
// 							  _term: 'asc'
// 							}
// 						}
// 					},
// 					branches: {
// 						terms: {
// 							field: 'branches',
// 							size: 0,
// 							order: {
// 							  _term: 'asc'
// 							}
// 						}
// 					},
// 					languages: {
// 						terms: {
// 							field: 'languages',
// 							size: 0,
// 							order: {
// 							  _term: 'asc'
// 							}
// 						}
// 					},
// 					equipments: {
// 						terms: {
// 							field: 'equipments',
// 							size: 0,
// 							order: {
// 							  _term: 'asc'
// 							}
// 						}
// 					},
// 					accessibility: {
// 						terms: {
// 							field: 'accessibility',
// 							size: 0,
// 							order: {
// 							  _term: 'asc'
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}).then(function (body) {
// 			var districts = [];
// 			var schooltypes = [];
// 			var branches = [];
// 			var languages = [];
// 			var equipments = [];
// 			var accessibility = [];
// 			angular.forEach(body.aggregations.nested.districts.buckets, function(v){
// 				districts.push(v.key);
// 			});
// 			$scope.districts = districts;
// 			angular.forEach(body.aggregations.schooltypes.buckets, function(v){
// 				schooltypes.push(v.key);
// 			});
// 			$scope.schoolTypes = schooltypes;
// 			angular.forEach(body.aggregations.branches.buckets, function(v){
// 				branches.push(v.key);
// 			});
// 			$scope.branches = branches;
// 			angular.forEach(body.aggregations.languages.buckets, function(v){
// 				languages.push(v.key);
// 			});
// 			$scope.languages = languages;
// 			angular.forEach(body.aggregations.equipments.buckets, function(v){
// 				equipments.push(v.key);
// 			});
// 			$scope.equipments = equipments;
// 			angular.forEach(body.aggregations.accessibility.buckets, function(v){
// 				accessibility.push(v.key);
// 			});
// 			$scope.accessibility = accessibility;
// 		}, function (error) {
// 			console.log(error.message);
// 		});

// 		$scope.allLanguages = true;
// 		$scope.allEquipments = false;
// 		$scope.allAccessibility = false;

// 		$scope.$watch('query', function(n, o) {
// 			if (n !== o) {
// 				$location.search('q', n);
// 			}
// 		});

// 		$scope.$watch('selectedDistricts', function(n, o) {
// 			if (n !== o) {
// 				$location.search('d', n);
// 			}
// 		});

// 		$scope.$watch('selectedSchoolTypes', function(n, o) {
// 			if (n !== o) {
// 				$location.search('s', n);
// 			}
// 		});

// 		$scope.$watch('selectedBranches', function(n, o) {
// 			if (n !== o) {
// 				$location.search('b', n);
// 			}
// 		});

// 		$scope.$watch('selectedLanguages', function(n, o) {
// 			if (n !== o) {
// 				$location.search('l', n);
// 			}
// 		});

// 		$scope.$watch('allLanguages', function(n, o) {
// 			if (n !== o) {
// 				$location.search('al', n);
// 			}
// 		});

// 		$scope.$watch('selectedEquipments', function(n, o) {
// 			if (n !== o) {
// 				$location.search('e', n);
// 			}
// 		});

// 		$scope.$watch('allEquipments', function(n, o) {
// 			if (n !== o) {
// 				$location.search('ae', n);
// 			}
// 		});

// 		$scope.$watch('selectedAccessibility', function(n, o) {
// 			if (n !== o) {
// 				$location.search('w', n);
// 			}
// 		});

// 		$scope.$watch('allAccessibility', function(n, o) {
// 			if (n !== o) {
// 				$location.search('aw', n);
// 			}
// 		});

// 		$scope.updateFilter = function(data) {
// 			if (data === undefined) {
// 				data = {
// 					query: this.query,
// 					districts: this.selectedDistricts,
// 					schooltypes: this.selectedSchoolTypes,
// 					branches: this.selectedBranches,
// 					languages: this.selectedLanguages,
// 					allLanguages: this.allLanguages,
// 					equipments: this.selectedEquipments,
// 					allEquipments: this.allEquipments,
// 					accessibility: this.selectedAccessibility,
// 					allAccessibility: this.allAccessibility
// 				};
// 			}

// 			mapService.updateFilter(data);
// 		};

// 		$scope.filterAsLink = function() {
// 			$scope.shareLink = $location.absUrl();
// 			$scope.showShareLink = $scope.showShareLink == true ? false : true;
// 		};

// 		var so = $location.search();

// 		if (so.q !== undefined) {
// 			$scope.query = so.q;
// 		}

// 		if (so.d !== undefined) {
// 			if (typeof(so.d) === 'string') {
// 				$scope.selectedDistricts = [so.d];
// 			} else {
// 				$scope.selectedDistricts = so.d;
// 			}
// 		}

// 		if (so.s !== undefined) {
// 			if (typeof(so.s) === 'string') {
// 				$scope.selectedSchoolTypes = [so.s];
// 			} else {
// 				$scope.selectedSchoolTypes = so.s;
// 			}
// 		}

// 		if (so.b !== undefined) {
// 			if (typeof(so.b) === 'string') {
// 				$scope.selectedBranches = [so.b];
// 			} else {
// 				$scope.selectedBranches = so.b;
// 			}
// 		}

// 		if (so.l !== undefined) {
// 			if (typeof(so.l) === 'string') {
// 				$scope.selectedLanguages = [so.l];
// 			} else {
// 				$scope.selectedLanguages = so.l;
// 			}
// 		}

// 		if (so.al !== undefined) {
// 			$scope.allLanguages = so.al;
// 		}

// 		if (so.e !== undefined) {
// 			if (typeof(so.e) === 'string') {
// 				$scope.selectedEquipments = [so.e];
// 			} else {
// 				$scope.selectedEquipments = so.e;
// 			}
// 		}

// 		if (so.ae !== undefined) {
// 			$scope.allEquipments = so.ae;
// 		}

// 		if (so.w !== undefined) {
// 			if (typeof(so.w) === 'string') {
// 				$scope.selectedAccessibility = [so.w];
// 			} else {
// 				$scope.selectedAccessibility = so.w;
// 			}
// 		}

// 		if (so.aw !== undefined) {
// 			$scope.allAccessibility = so.aw;
// 		}

// 		$scope.updateFilter();

// 		/**
// 		 * Reset Filter Form and remove GET params
// 		 */
// 		$scope.resetFilter = function() {
// 			$scope.query                 = undefined;
// 			$scope.selectedDistricts     = undefined;
// 			$scope.selectedSchoolTypes   = undefined;
// 			$scope.selectedBranches      = undefined;
// 			$scope.selectedLanguages     = undefined;
// 			$scope.allLanguages          = undefined;
// 			$scope.selectedEquipments    = undefined;
// 			$scope.allEquipments         = undefined;
// 			$scope.selectedAccessibility = undefined;
// 			$scope.allAccessibility      = undefined;

// 			$location.search({});
// 			$scope.updateFilter();
// 		};
// 	}]);
