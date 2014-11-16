/*globals Firebase*/
angular.module('Volusion.controllers')
	.controller('MainCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'vnApi', 'themeSettings', 'vnSiteConfig', 'vnImagePreloader', 'Sites', '$firebase',
		function ($scope, $rootScope, $location, $window, $timeout, vnApi, themeSettings, vnSiteConfig, vnImagePreloader, Sites, $firebase) {

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
					handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
					//start: function(event, $element, widget) {}, // optional callback fired when resize is started,
					//resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
					stop: function() {
						console.log('fired resizable stop');
						Sites.saveGridsterLayout();
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
						Sites.saveGridsterLayout();
						//$scope.staticSites.$save(); // THIS NEEDS TO BE A FACTORY THAT WE CAN CALL - WON'T WORK LIKE THIS!
					} // optional callback fired when item is finished dragging
				}
			};

			// IMPORTANT: Items should be placed in the grid in the order in which they should appear.
			// In most cases the sorting should be by row ASC, col ASC

			// these map directly to gridsterItem directive options

			//TODO: Create a positioning for each device, and remove the generic one. A gridster layout for each device.
			//Example positioning model added to the first item below... including disabling a widget on a specific viewport.

			//NOTE: this below is a grid. There will be a grid on each page. All pages will be made up of grids and grids only (ideally).

		// now we can use $firebase to synchronize data between clients and the server!
		//var siteObject = Sites.getSite('monkeypants');
		// var ref = new Firebase('https://phoenix-sites.firebaseio.com/sites');
		// var sync = $firebase(ref);

		// /* jshint ignore:start */
		// // replace the entire node with new data
		// sync.$set(
		// 	{
		//     "monkeypants": {
		//       "name": "Monkey Pants",
		//       "activeTheme": "method",
		//       "pageTemplates": {
		//         "home": {
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
		//               "settings": {
		//                 "isEnabled": true,
		//                 "interval": 4000,
		//                 "slides": [
		//                   {
		//                     "imgUrl": "http://design16.volusion.com/v/theme-engine/method/slide1.jpg",
		//                     "headline": "NewYearSaleathon",
		//                     "subHeadline": "Save20%offstorewidewithcouponcodeNEWYEAR",
		//                     "linksTo": "/all-products"
		//                   },
		//                   {
		//                     "imgUrl": "http://design16.volusion.com/v/theme-engine/method/slide2.jpg",
		//                     "headline": "NewSunriseCollection",
		//                     "subHeadline": "Wakeuptosomethinggood",
		//                     "linksTo": "/all-products"
		//                   },
		//                   {
		//                     "imgUrl": "http://design16.volusion.com/v/theme-engine/method/slide3.jpg",
		//                     "headline": "MiamiFashion",
		//                     "subHeadline": null,
		//                     "linksTo": "/all-products"
		//                   },
		//                   {
		//                     "imgUrl": "http://design16.volusion.com/v/theme-engine/method/slide4.jpg",
		//                     "headline": "MiamiFashion",
		//                     "subHeadline": null,
		//                     "linksTo": "/all-products"
		//                   }
		//                 ]
		//               }
		//             },
		//             {
		//               "name": "Image",
		//               "type": "image",
		//               "sizeX": 1,
		//               "sizeY": 4,
		//               "row": 0,
		//               "col": 2,
		//               "content": "<a data-ng-href=\"\"><img ng-src=\"{{item.settings.imgUrl}}\" class=\"img-responsive\" alt=\"\"></a>",
		//               "settings": {
		//                 "imgUrl": "/images/homepage/tile6.jpg"
		//               }
		//             },
		//             {
		//               "name": "Image",
		//               "type": "image",
		//               "sizeX": 1,
		//               "sizeY": 4,
		//               "row": 4,
		//               "col": 0,
		//               "content": "<a data-ng-href=\"\"><img ng-src=\"{{item.settings.imgUrl}}\" class=\"img-responsive\" alt=\"\"></a>",
		//               "settings": {
		//                 "imgUrl": "/images/homepage/tile1.jpg"
		//               }
		//             },
		//             {
		//               "name": "HTML",
		//               "type": "html",
		//               "sizeX": 1,
		//               "sizeY": 4,
		//               "row": 4,
		//               "col": 1,
		//               "content": "<div ng-bind-html=\"item.settings.html | vnLegacyLinkify | html\"></div>",
		//               "settings": {
		//                 "html": "<h1>Super Sale Folks!</h1>"
		//               }
		//             },
		//             {
		//               "name": "Image",
		//               "type": "image",
		//               "sizeX": 1,
		//               "sizeY": 4,
		//               "row": 4,
		//               "col": 2,
		//               "content": "<a data-ng-href=\"\"><img ng-src=\"{{item.settings.imgUrl}}\" class=\"img-responsive\" alt=\"\"></a>",
		//               "settings": {
		//                 "imgUrl": "/images/homepage/tile3.jpg"
		//               }
		//             },
		//             {
		//               "name": "Image",
		//               "type": "image",
		//               "sizeX": 1,
		//               "sizeY": 2,
		//               "row": 8,
		//               "col": 0,
		//               "content": "<a data-ng-href=\"\"><img ng-src=\"{{item.settings.imgUrl}}\" class=\"img-responsive\" alt=\"\"></a>",
		//               "settings": {
		//                 "imgUrl": "/images/homepage/tile4.jpg"
		//               }
		//             },
		//             {
		//               "name": "Image",
		//               "type": "image",
		//               "sizeX": 2,
		//               "sizeY": 2,
		//               "row": 8,
		//               "col": 1,
		//               "content": "<a data-ng-href=\"\"><img ng-src=\"{{item.settings.imgUrl}}\" class=\"img-responsive\" alt=\"\"></a>",
		//               "settings": {
		//                 "imgUrl": "/images/homepage/tile5.jpg"
		//               }
		//             }
		//           ]
		//         }
		//       }
		//     }
		//   }
		// );
		// /* jshint ignore:end */

		// create a synchronized object, all server changes are downloaded in realtime
		// var siteObject = sync.$asObject();

		//changes made to realtimeSite affects both the realtimeSite object and staticSite object on all devices & browsers in the world in realtime.
		//siteObject.$bindTo($scope, 'realtimeSite');

		//changes made to staticSite happen in a single browser and doesn't affect the local (or remote) realtimeSite object. Nobody sees your changes until you click staticSite.$save();
		//$scope.staticSite = siteObject;
        //
		//	$scope.$watch('staticSite', function (newValue) {
		//		console.log('static site changed', newValue.pageTemplates.home.gridsterLayout[2].row, newValue.pageTemplates.home.gridsterLayout[2].col);
		//	}, true);

		$scope.gridsterLayout = Sites.getGridsterLayout('monkeypants');

		$scope.$watch('gridsterLayout', function (newValue) {
			console.log('gridsterLayout changed', newValue);
		}, true);

		//HACK:Since firebase sends updates in pieces, Gridster get's invalid array updates first and tries to correct them.
		//So a half second after any updates come in from Firebase, check if we're still in sync with Firebase.
		var newRef = new Firebase('https://phoenix-sites.firebaseio.com/sites/monkeypants/pageTemplates/home/gridsterLayout');
		$scope.newFB = $firebase(newRef).$asArray();
		$scope.$watch('newFB', function () {
			//TODO: Wrap the following in a $timeout()
			$timeout(function (){
				if (angular.toJson($scope.gridsterLayout) !== angular.toJson($scope.newFB)) {
					console.log('FB updates came in, and gridster is out of sync. Resetting gridsterLayout', $scope.gridsterLayout, $scope.newFB);
					$scope.gridsterLayout = Sites.getGridsterLayout('monkeypants');
				}
			}, 500);
		}, true);




			$scope.themes = {
				mehod: {
					name: 'Method'
				},
				gizmo: {
					name: 'Gizmo'
				}
			};

			$scope.widgets = {
				html: {
					content: '<div ng-bind-html="item.settings.html | vnLegacyLinkify | html"></div>',
					settings: {
						html: '<h1>Super Sale Folks!</h1>'
					}
				},
				image: {
					content: '<a data-ng-href=""><img ng-src="{{item.settings.imgUrl}}" class="img-responsive" alt=""></a>',
					settings: {
						imgUrl: '/images/homepage/tile6.jpg'
					}
				}
			};

			$scope.sitesOld = {
				monkeypants : {
					name: 'Monkey Pants',
					activeTheme: 'method',
					pageTemplates: {
						home: {
							gridsterLayout: [
								{
									name: 'Carousel',
									type: 'carousel',
									sizeX: 2, sizeY: 4, row: 0, col: 0,
									position: {
										phone: { sizeX: 2, sizeY: 4, row: 0, col: 0, disabled: true},
										tablet: { sizeX: 2, sizeY: 4, row: 0, col: 0, disabled: false},
										desktop: { sizeX: 2, sizeY: 4, row: 0, col: 0, disabled: false}
									},
									content: '<div class="vn-slider">' +
														'<carousel data-interval="item.settings.interval">' +
															'<slide data-ng-repeat="slide in item.settings.slides" data-active="slide.active">' +
																'<a href title="{{slide.headline}} - {{slide.subHeadline}}">' +
																	'<div class="vn-slider__slide" data-ng-style="{\'background-image\':\'url({{slide.imgUrl}})\' }"></div>' +
																'</a>' +
															'</slide>' +
														'</carousel>' +
													'</div>',
									settings: {
										isEnabled: true,
										interval : 4000,
										slides   : [
											{
												imgUrl     : 'http://design16.volusion.com/v/theme-engine/method/slide1.jpg',
												headline   : 'NewYearSaleathon',
												subHeadline: 'Save20%offstorewidewithcouponcodeNEWYEAR',
												linksTo    : '/all-products'
											},
											{
												imgUrl     : 'http://design16.volusion.com/v/theme-engine/method/slide2.jpg',
												headline   : 'NewSunriseCollection',
												subHeadline: 'Wakeuptosomethinggood',
												linksTo    : '/all-products'
											},
											{
												imgUrl     : 'http://design16.volusion.com/v/theme-engine/method/slide3.jpg',
												headline   : 'MiamiFashion',
												subHeadline: null,
												linksTo    : '/all-products'
											},
											{
												imgUrl     : 'http://design16.volusion.com/v/theme-engine/method/slide4.jpg',
												headline   : 'MiamiFashion',
												subHeadline: null,
												linksTo    : '/all-products'
											}
										]
									}
								},
								{
									name: 'Image',
									type: 'image',
									sizeX: 1, sizeY: 4, row: 0, col: 2,
									content: '<a data-ng-href=""><img ng-src="{{item.settings.imgUrl}}" class="img-responsive" alt=""></a>',
									settings: {
										imgUrl: '/images/homepage/tile6.jpg'
									}
								},
								{
									name: 'Image',
									type: 'image',
									sizeX: 1, sizeY: 4, row: 4, col: 0,
									content: '<a data-ng-href=""><img ng-src="{{item.settings.imgUrl}}" class="img-responsive" alt=""></a>',
									settings: {
										imgUrl: '/images/homepage/tile1.jpg'
									}
								},
								{
									name: 'HTML',
									type: 'html',
									sizeX: 1, sizeY: 4, row: 4, col: 1,
									content: '<div ng-bind-html="item.settings.html | vnLegacyLinkify | html"></div>',
									settings: {
										html: '<h1>Super Sale Folks!</h1>'
									}
								},
								{
									name: 'Image',
									type: 'image',
									sizeX: 1, sizeY: 4, row: 4, col: 2,
									content: '<a data-ng-href=""><img ng-src="{{item.settings.imgUrl}}" class="img-responsive" alt=""></a>',
									settings: {
										imgUrl: '/images/homepage/tile3.jpg'
									}
								},
								{
									name: 'Image',
									type: 'image',
									sizeX: 1, sizeY: 2, row: 8, col: 0,
									content: '<a data-ng-href=""><img ng-src="{{item.settings.imgUrl}}" class="img-responsive" alt=""></a>',
									settings: {
										imgUrl: '/images/homepage/tile4.jpg'
									}
								},
								{
									name: 'Image',
									type: 'image',
									sizeX: 2, sizeY: 2, row: 8, col: 1,
									content: '<a data-ng-href=""><img ng-src="{{item.settings.imgUrl}}" class="img-responsive" alt=""></a>',
									settings: {
										imgUrl: '/images/homepage/tile5.jpg'
									}
								}
							]
						}
					}
				}
			};

			$scope.standardItems = [
				{
					name: 'Carousel',
					type: 'carousel',
					sizeX: 2, sizeY: 4, row: 0, col: 0,
					position: {
						phone: { sizeX: 2, sizeY: 4, row: 0, col: 0, disabled: true},
						tablet: { sizeX: 2, sizeY: 4, row: 0, col: 0, disabled: false},
						desktop: { sizeX: 2, sizeY: 4, row: 0, col: 0, disabled: false}
					},
					content: '<div class="vn-slider">' +
										'<carousel data-interval="item.settings.interval">' +
											'<slide data-ng-repeat="slide in item.settings.slides" data-active="slide.active">' +
												'<a href title="{{slide.headline}} - {{slide.subHeadline}}">' +
													'<div class="vn-slider__slide" data-ng-style="{\'background-image\':\'url({{slide.imgUrl}})\' }"></div>' +
												'</a>' +
											'</slide>' +
										'</carousel>' +
									'</div>',
					settings: {
						isEnabled: true,
						interval : 4000,
						slides   : [
							{
								imgUrl     : 'http://design16.volusion.com/v/theme-engine/method/slide1.jpg',
								headline   : 'NewYearSaleathon',
								subHeadline: 'Save20%offstorewidewithcouponcodeNEWYEAR',
								linksTo    : '/all-products'
							},
							{
								imgUrl     : 'http://design16.volusion.com/v/theme-engine/method/slide2.jpg',
								headline   : 'NewSunriseCollection',
								subHeadline: 'Wakeuptosomethinggood',
								linksTo    : '/all-products'
							},
							{
								imgUrl     : 'http://design16.volusion.com/v/theme-engine/method/slide3.jpg',
								headline   : 'MiamiFashion',
								subHeadline: null,
								linksTo    : '/all-products'
							},
							{
								imgUrl     : 'http://design16.volusion.com/v/theme-engine/method/slide4.jpg',
								headline   : 'MiamiFashion',
								subHeadline: null,
								linksTo    : '/all-products'
							}
						]
					}
				},
				{
					name: 'Image',
					type: 'image',
					sizeX: 1, sizeY: 4, row: 0, col: 2,
					content: '<a data-ng-href=""><img ng-src="{{item.settings.imgUrl}}" class="img-responsive" alt=""></a>',
					settings: {
						imgUrl: '/images/homepage/tile6.jpg'
					}
				},
				{
					name: 'Image',
					type: 'image',
					sizeX: 1, sizeY: 4, row: 4, col: 0,
					content: '<a data-ng-href=""><img ng-src="{{item.settings.imgUrl}}" class="img-responsive" alt=""></a>',
					settings: {
						imgUrl: '/images/homepage/tile1.jpg'
					}
				},
				{
					name: 'HTML',
					type: 'html',
					sizeX: 1, sizeY: 4, row: 4, col: 1,
					content: '<div ng-bind-html="item.settings.html | vnLegacyLinkify | html"></div>',
					settings: {
						html: '<h1>Super Sale Folks!</h1>'
					}
				},
				{
					name: 'Image',
					type: 'image',
					sizeX: 1, sizeY: 4, row: 4, col: 2,
					content: '<a data-ng-href=""><img ng-src="{{item.settings.imgUrl}}" class="img-responsive" alt=""></a>',
					settings: {
						imgUrl: '/images/homepage/tile3.jpg'
					}
				},
				{
					name: 'Image',
					type: 'image',
					sizeX: 1, sizeY: 2, row: 8, col: 0,
					content: '<a data-ng-href=""><img ng-src="{{item.settings.imgUrl}}" class="img-responsive" alt=""></a>',
					settings: {
						imgUrl: '/images/homepage/tile4.jpg'
					}
				},
				{
					name: 'Image',
					type: 'image',
					sizeX: 2, sizeY: 2, row: 8, col: 1,
					content: '<a data-ng-href=""><img ng-src="{{item.settings.imgUrl}}" class="img-responsive" alt=""></a>',
					settings: {
						imgUrl: '/images/homepage/tile5.jpg'
					}
				}
			];
		}]);
