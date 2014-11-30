angular.module('Volusion.controllers')
	.controller('MainCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'vnApi', 'themeSettings', 'vnSiteConfig', 'vnImagePreloader', '$http', 'socket',
		function ($scope, $rootScope, $location, $window, $timeout, vnApi, themeSettings, vnSiteConfig, vnImagePreloader, $http, socket) {

			'use strict';

			//----------------------------------------------
			//Sites (NEW model from phoenix)
			//TODO: Move this to a Sites factory
			$scope.sites = [];
			$http.get('http://localhost:3000/api/sites?filter={"where":{"subDomain":"monkeypants"}}').success(function(result) {
				$scope.sites = result;
				socket.syncUpdates('site', $scope.sites);
			});

			$scope.updateSites = function() {
				var jsonToSave = angular.fromJson(angular.toJson($scope.sites[0])); //strip off all the angular junk
				//delete jsonToSave.__v //strip off __v so that last sent wins. Without this, typing too fast will cause 500 error.
				console.log('jsonToSaveInUpdateSites',jsonToSave);
				$http.put('http://localhost:3000/api/sites/' + $scope.sites[0].id, jsonToSave);
			};

			//----------------------------------------------
			//Gridster Layout
			$scope.gridsterOpts = {
				columns: 3, // the width of the grid, in columns
				pushing: true, // whether to push other items out of the way on move or resize
				floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
				width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
				colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
				rowHeight: 120, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
				margins: [10, 10], // the pixel distance between each widget
				outerMargin: true, // whether margins apply to outer edges of the grid
				isMobile: false, // stacks the grid items if true
				mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
				mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
				minColumns: 1, // the minimum columns the grid must have
				minRows: 2, // the minimum height of the grid, in rows
				maxRows: 100,
				defaultSizeX: 1, // the default width of a gridster item, if not specifed
				defaultSizeY: 1, // the default height of a gridster item, if not specified
				resizable: {
					enabled: true,
					handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
					//start: function(event, $element, widget) {}, // optional callback fired when resize is started,
					//resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
					stop: function() {
						console.log('fired resizable stop');
						$scope.updateSites();
						//$scope.staticSites.$save(); // THIS NEEDS TO BE A FACTORY THAT WE CAN CALL - WON'T WORK LIKE THIS!
					} // optional callback fired when item is finished resizing
				},
				draggable: {
					enabled: true, // whether dragging items is supported
					handle: '.my-class', // optional selector for resize handle
					//start: function(event, $element, widget) {}, // optional callback fired when drag is started,
					//drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
					stop: function() {
						console.log('fired draggable stop');
						$scope.updateSites();
						//$scope.staticSites.$save(); // THIS NEEDS TO BE A FACTORY THAT WE CAN CALL - WON'T WORK LIKE THIS!
					} // optional callback fired when item is finished dragging
				}
			};

			//TODO: Gridster puts things in the wrong place on the browsers that are listening to changes. This hack attemped to fix it.
			//UPDATE: This hack doesn't work now that we're using track by
			// IMPORTANT: Items should be placed in the grid in the order in which they should appear. (per gridster documentation). In most cases the sorting should be by row ASC, col ASC.
			//$http.get('http://localhost:9000/api/sites?hostname=monkeypants').success(function(sites) {
			//	$scope.unBoundSites = sites;
			//	//FYI: syncUpdates will not work on an object; Needs to be an array. Or fix the syncUpdates factory to support objects.
			//	socket.syncUpdates('site', $scope.unBoundSites);
			//});
			//$scope.$watch('unBoundSites', function () {
			//	$timeout(function (){
			//		var tempPureJsonGridsterLayout = angular.toJson($scope.sites[0].pageTemplates[0].widgets);
			//		var tempPureJsonUnBound = angular.toJson($scope.unBoundSites[0].pageTemplates[0].widgets);
			//		if (tempPureJsonGridsterLayout !== tempPureJsonUnBound) {
			//			console.log('Web socket updates came in, and gridster is out of sync. Resetting gridster.', tempPureJsonGridsterLayout, tempPureJsonUnBound);
			//			$scope.sites = $scope.unBoundSites;
			//		}
			//	}, 5000);
			//}, true);

			//TODO: Widgets need positioning for each device, including disabling on certain device sizes. Example:
			//           "gridsterLayout": [
			//             {
			//               "name": "Carousel",
			//               "type": "carousel",
			//               "sizeX": 2,
			//               "sizeY": 4,
			//               "row": 0,
			//               "col": 0,
			//               "position": {
			//                 "phone": {
			//                   "sizeX": 2,
			//                   "sizeY": 4,
			//                   "row": 0,
			//                   "col": 0,
			//                   "disabled": true
			//                 },
			//                 "tablet": {
			//                   "sizeX": 2,
			//                   "sizeY": 4,
			//                   "row": 0,
			//                   "col": 0,
			//                   "disabled": false
			//                 },
			//                 "desktop": {
			//                   "sizeX": 2,
			//                   "sizeY": 4,
			//                   "row": 0,
			//                   "col": 0,
			//                   "disabled": false
			//                 }
			//               },
			//               "content": "<div class=\"vn-slider\"><carousel data-interval=\"item.settings.interval\"><slide data-ng-repeat=\"slide in item.settings.slides\" data-active=\"slide.active\"><a href title=\"{{slide.headline}} - {{slide.subHeadline}}\"><div class=\"vn-slider__slide\" data-ng-style=\"{'background-image':'url({{slide.imgUrl}})' }\"></div></a></slide></carousel></div>",


			//----------------------------------------------
			//Volusion Storefront Data

			$rootScope.seo = {};

			vnSiteConfig.getConfig().then(function (response) {
				$scope.config = response.data;
			});

			themeSettings.getThemeSettings().then(function(response) {
				$scope.themeSettings = response;

				var imagesToPreload  = [];

				angular.forEach($scope.themeSettings.pages.home.slider.slides, function (slide) {
					imagesToPreload.push(slide.imageUrl);
				});

				vnImagePreloader.preloadImages(imagesToPreload);
			});
}]);
