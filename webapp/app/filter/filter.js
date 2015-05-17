'use strict';

angular.module('berlinerSchulenApp')
	.controller('FilterCtrl', ['$scope', '$timeout', '$mdSidenav', 'schoolFactory', '$filter',
		function ($scope, $timeout, $mdSidenav, schoolFactory, $filter) {

			var orderBy = $filter('orderBy');
			// Initialize Filter in Front-End
			$scope.searchFilter = {
				main: '',
				street: '',
				districts: [],
				schooltypes: [],
				supporter: [],
				languages: [],
				accessibilities: [],
				courses: [],
				allDayCare: false,
				dual: false,
				secEdu: false
			};

			$scope.loading = false;

			$scope.filter = function () {
				$scope.loading = true;
				$timeout(function () {
					schoolFactory
						.setFilter($scope.searchFilter)
						.applyFilter();
					$scope.loading = false;
				}, 600);
			};

			$scope.resetFilter = function() {

				$scope.cbDistricts.selectedDistricts = [];
				$scope.cbSchooltypes.selectedTypes = [];
				$scope.cbSchoolSupporter.selectedSupporter = [];
				$scope.cbLanguages.selectedLang = [];
				$scope.cbAccessibility.selectedAccessibilities = [];
				$scope.cbCourses.selectedCourses = [];

				$scope.searchFilter = {
					main: '',
					street: '',
					districts: [],
					schooltypes: [],
					supporter: [],
					languages: [],
					accessibilities: [],
					courses: [],
					allDayCare: false,
					dual: false,
					secEdu: false
				};
				$scope.filter();
			};

			$scope.cbDistricts = {
				districts: [],

				selectedDistricts: [],

				loading: false,

				exec: function (values) {
					$scope.searchFilter.districts = values.newValue;
					$scope.filter();
				},

				populate: function (set) {
					var list = [];
					for (var s in set) {
						list.push({name: set[s]});
					}
					$scope.cbDistricts.districts = orderBy(list, 'name', false);					
					$scope.cbDistricts.loading = false;
				},

				addCallback: function () {
					$scope.cbDistricts.loading = true;

					schoolFactory.addFilterCallback('Region', this.populate);
				}
			};

			$scope.cbSchooltypes = {
				schooltypes: [],

				selectedTypes: [],

				loading: false,

				exec: function (values) {
					$scope.searchFilter.schooltypes = values.newValue;
					$scope.filter();
				},

				populate: function (set) {
					var list = [];
					for (var s in set) {
						list.push({name: set[s]});
					}
					$scope.cbSchooltypes.schooltypes = orderBy(list, 'name', false);
					$scope.cbSchooltypes.loading = false;
				},

				addCallback: function () {
					$scope.cbSchooltypes.loading = true;

					schoolFactory.addFilterCallback('Schulart', this.populate);
				}
			};

			$scope.cbSchoolSupporter = {
				supporter: [],

				selectedSupporter: [],

				loading: false,

				exec: function (values) {
					$scope.searchFilter.supporter = values.newValue;
					$scope.filter();
				},

				populate: function (set) {
					var list = [];
					for (var s in set) {
						list.push({name: set[s]});
					}
					$scope.cbSchoolSupporter.supporter = orderBy(list, 'name', false);
					$scope.cbSchoolSupporter.loading = false;
				},

				addCallback: function () {
					$scope.cbSchoolSupporter.loading = true;

					schoolFactory.addFilterCallback('Schultraeger', this.populate);
				}
			};

			$scope.cbLanguages = {
				languages: [
					{name: 'Arabisch'},
					{name: 'Chinesisch'},
					{name: 'Englisch'},
					{name: 'Französisch'},
					{name: 'Griechisch'},
					{name: 'Hebräisch'},
					{name: 'Italienisch'},
					{name: 'Japanisch'},
					{name: 'Latein'},
					{name: 'Niederländisch'},
					{name: 'Polnisch'},
					{name: 'Portugiesisch'},
					{name: 'Russisch'},
					{name: 'Spanisch'},
					{name: 'Türkisch'}
				],

				selectedLang: [],

				loading: false,

				exec: function (values) {
					$scope.searchFilter.languages = values.newValue;
					$scope.filter();
				},

				populate: function (set) {
					var list = [];
					for (var s in set) {
						list.push({name: set[s]});
					}
					$scope.cbLanguages.languages = orderBy(list, 'name', false);
					$scope.cbLanguages.loading = false;
				},

				addCallback: function () {
					$scope.cbLanguages.loading = true;

					schoolFactory.addFilterCallback('Fremdsprachen', this.populate);
				}
			};

			$scope.cbAccessibility = {
				accessibilities: [],

				selectedAccessibilities: [],

				loading: false,

				exec: function (values) {
					$scope.searchFilter.accessibilities = values.newValue;
					$scope.filter();
				},

				populate: function (set) {
					var list = [];
					for (var s in set) {
						if (set[s] !== '') {
							list.push({name: set[s]});
						}
					}

					$scope.cbAccessibility.accessibilities = orderBy(list, 'name', false);
					$scope.cbAccessibility.loading = false;
				},

				addCallback: function () {
					$scope.cbAccessibility.loading = true;

					schoolFactory.addFilterCallback('Bauten', this.populate);
				}
			};

			$scope.cbCourses = {
				courses: [],

				selectedCourses: [],

				loading: false,

				exec: function (values) {
					$scope.searchFilter.courses = values.newValue;
					$scope.filter();
				},

				populate: function (set) {
					var list = [];
					for (var s in set) {
						if (set[s] !== '') {
							list.push({name: set[s]});
						}
					}

					$scope.cbCourses.courses = orderBy(list, 'name', false);
					$scope.cbCourses.loading = false;
				},

				addCallback: function () {
					$scope.cbCourses.loading = true;

					schoolFactory.addFilterCallback('Leistungskurse', this.populate);
				}
			};

			this.setSearchFilter = function( filter ) {
				$scope.searchFilter = filter;

				$scope.cbDistricts.selectedDistricts = filter.districts;
				$scope.cbSchooltypes.selectedTypes = filter.schooltypes;
				$scope.cbSchoolSupporter.selectedSupporter = filter.supporter;
				$scope.cbLanguages.selectedLang = filter.languages;
				$scope.cbAccessibility.selectedAccessibilities = filter.accessibilities;
				$scope.cbCourses.selectedCourses = filter.courses;
			};


			this.runFilter = function () {
				// First catch filter from factory and set it to
				// old value
				this.setSearchFilter(schoolFactory.getFilter());

				if (schoolFactory.hasData()) {
					// Get Select Box Choices
					var set = schoolFactory.getChoiceByName('Region');
					$scope.cbDistricts.populate(set);

					set = schoolFactory.getChoiceByName('Schultraeger');
					$scope.cbSchoolSupporter.populate(set);

					set = schoolFactory.getChoiceByName('Bauten');
					$scope.cbAccessibility.populate(set);

					set = schoolFactory.getChoiceByName('Leistungskurse');
					$scope.cbCourses.populate(set);

					set = schoolFactory.getChoiceByName('Schulart');
					$scope.cbSchooltypes.populate(set);

					//If school data is already loaded just apply filter
					$scope.filter();
				} else {
					$scope.cbDistricts.addCallback();
					$scope.cbSchoolSupporter.addCallback();
					$scope.cbAccessibility.addCallback();
					$scope.cbCourses.addCallback();
					$scope.cbSchooltypes.addCallback();
					// else set the filter and wait. The schoolFactory will load
					// the data and then apply the filter

					schoolFactory.setFilter($scope.searchFilter);
				}
			};

			// Run or set filter depending if data is available
			this.runFilter();

		}]);
