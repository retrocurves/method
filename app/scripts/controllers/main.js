angular.module('Volusion.controllers')
	.controller('MainCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'vnApi', 'themeSettings', 'vnSiteConfig', 'vnImagePreloader',
		function ($scope, $rootScope, $location, $window, $timeout, vnApi, themeSettings, vnSiteConfig, vnImagePreloader) {

			'use strict';

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

			/* Gridster code **************************************************************/

			$scope.testAlert = function() {
				console.log('TEST');
			};

			$scope.gridsterOpts = {
				columns: 3, // the width of the grid, in columns
				pushing: true, // whether to push other items out of the way on move or resize
				floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
				width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
				colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
				rowHeight: 120, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
				margins: [10, 10], // the pixel distance between each widget
				outerMargin: false, // whether margins apply to outer edges of the grid
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
					handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']//,
					//start: function(event, $element, widget) {}, // optional callback fired when resize is started,
					//resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
					//stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
				},
				draggable: {
					enabled: true, // whether dragging items is supported
					handle: '.my-class'//, // optional selector for resize handle
					//start: function(event, $element, widget) {}, // optional callback fired when drag is started,
					//drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
					//stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
				}
			};

			// IMPORTANT: Items should be placed in the grid in the order in which they should appear.
			// In most cases the sorting should be by row ASC, col ASC

			// these map directly to gridsterItem directive options
			$scope.standardItems = [
				{
					sizeX: 2, sizeY: 4, row: 0, col: 0,
					content: '<div data-ng-if="themeSettings.pages.home.slider.isEnabled">' +
								'<div class="vn-slider">' +
									'<carousel data-interval="themeSettings.pages.home.slider.interval">' +
										'<slide data-ng-repeat="slide in themeSettings.pages.home.slider.slides" data-active="slide.active">' +
											'<a href title="{{slide.headline}} - {{slide.subHeadline}}">' +
												'<div class="vn-slider__slide" data-ng-style="{\'background-image\':\'url({{slide.imageUrl}})\' }"></div>' +
											'</a>' +
										'</slide>' +
									'</carousel>' +
								'</div>' +
							'</div>'
				},
				{
					sizeX: 1, sizeY: 4, row: 0, col: 2,
					content: '<a data-ng-href="" class="th-promo th-b3"><img ng-src="{{themeSettings.pages.home.tiles.tiles.tile6.imageUrl}}" class="img-responsive" alt=""></a>'
				},
				{
					sizeX: 1, sizeY: 4, row: 4, col: 0,
					content: '<a data-ng-href="" class="th-promo th-p1"><img ng-src="{{themeSettings.pages.home.tiles.tiles.tile1.imageUrl}}" class="img-responsive" alt="" /></a>'
				},
				{
					sizeX: 1, sizeY: 4, row: 4, col: 1,
					content: '<a data-ng-href="" class="th-promo th-p2">' +
								'<div class="th-title">Now Stocking Herschel Bags.</div>' +
									'<div class="th-text">' +
										'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.' +
										'<div class="th-link" data-translate="home.shopNow">Shop Now &gt;</div>' +
									'</div>' +
								'<img data-ng-src="{{themeSettings.pages.home.tiles.tiles.tile2.imageUrl}}" class="img-responsive" alt="" />' +
							'</a>'
				},
				{
					sizeX: 1, sizeY: 4, row: 4, col: 2,
					content: '<a data-ng-href="" class="th-promo th-p3"><img ng-src="{{themeSettings.pages.home.tiles.tiles.tile3.imageUrl}}" class="img-responsive" alt="" /></a>' },
				{
					sizeX: 1, sizeY: 2, row: 8, col: 0,
					content: '<a data-ng-href="" class="th-promo th-b1"><img data-ng-src="{{themeSettings.pages.home.tiles.tiles.tile4.imageUrl}}" class="img-responsive" alt="" /><span class="th-category">New Sunglasses &gt;</span></a>'
				},
				{
					sizeX: 2, sizeY: 2, row: 8, col: 1,
					content: '<a data-ng-href="" class="th-promo th-b2"><img data-ng-src="{{themeSettings.pages.home.tiles.tiles.tile5.imageUrl}}" class="img-responsive" alt="" /><span class="th-category">Townsend Shoes &gt;</span></a>'
				}

			];

			$scope.$watch('standardItems', function(standardItems){
				// one of the items changed
				console.log(standardItems);
			}, true);

		}]);
