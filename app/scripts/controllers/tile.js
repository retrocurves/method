angular.module('Volusion.controllers')
		.controller('TileCtrl', ['$scope', 'themeSettings',
			function ($scope, themeSettings) {

				'use strict';

				$scope.themeSettings = null;

				themeSettings.getThemeSettings().then(function(response) {
					$scope.themeSettings = response;
				});

				/* Gridster code **************************************************************/

				$scope.alertTest = function(msg) {
					console.log((msg === undefined) ? $scope.themeSettings.pages.home.tiles.tiles.tile1.linkTo : msg);
				};

			}]);
