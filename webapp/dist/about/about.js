'use strict';

/**
 * @ngdoc function
 * @name schooldataApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the schooldataApp
 */
angular.module('berlinerSchulenApp')
	.controller('AboutCtrl', [
		'$scope', 'LxDialogService', 'LxNotificationService',
		function ($scope, LxDialogService, LxNotificationService) {

		$scope.opendDialog = function(dialogId) {
			LxDialogService.open(dialogId);
		};

		$scope.closingDialog = function() {
			LxNotificationService.info('Dialog closed!');
		};
	}]);
