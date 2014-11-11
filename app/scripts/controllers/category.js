angular.module('Volusion.controllers')
	.controller('CategoryCtrl', [
		'$q', '$scope', '$rootScope', '$routeParams', '$location', '$route', 'vnApi', 'vnApiClient', 'themeSettings', 'vnProductParams', 'vnAppRoute', 'ContentMgr',
		function ($q, $scope, $rootScope, $routeParams, $location, $route, vnApi, vnApiClient, themeSettings, vnProductParams, vnAppRoute, ContentMgr) {

			'use strict';

			$scope.checkForFacetFilters = function () {
				if (vnProductParams.getFacetString()) {
					return true;
				}
			};

			$scope.clearAllFilters = function () {
				vnProductParams.resetParams();
				vnProductParams.addCategory($scope.category.id);
				$scope.queryProducts();
				if ($scope.isMobileAndVisible) {
					$scope.toggleSearch();
				}
			};

			$scope.dismissMobileFilters = function () {
				$scope.toggleSearch();
			};

			$scope.getCategory = function (newSlug, id) {

				vnApiClient.api.Category().get(id).then(function (response) {
					// Handle the category data
					console.log(response);
					$scope.category = response.data;

					var content = $scope.category.content;
                    angular.extend($rootScope.seo, {
						metaTagTitle: content.metaTagTitle,
						metaTagKeywords: content.metaTagKeywords,
						metaTagDescription: content.metaTagDescription

					});
					vnProductParams.setPrimaryCategoryId(response.data.categoryId);
					vnProductParams.setPageSize(themeSettings.getPageSize());
					vnProductParams.setPage(1);

					$scope.queryProducts();
				});
			};

			$scope.queryProducts = function () {
				//var params = vnProductParams.getParamsObject();
				vnApiClient.api.Product().queryByCategoryId().then(function (response) {
					console.log(response);
					$scope.products = response.data.items;
					angular.forEach($scope.products, function(product) {
						product.url = '/p/' + product.productCode;
					});
					console.log($scope.products);
					$scope.facets = response.data.facets;
					$scope.cursor = {
						totalPages: response.data.pageCount,
						currentPage: Math.ceil ((response.data.startIndex + 1) / themeSettings.getPageSize())
					};
				});
				/*vnApi.Product().get(params).$promise.then(function (response) {

					$scope.products = response.data;
					$scope.facets = response.facets;
					$scope.categoryList = response.categories;
					$scope.cursor = response.cursor;

					// Post response UI Setup
					$scope.checkFacetsAndCategories(response.categories, response.facets);
				});*/
			};

			$scope.toggleSearch = function () {
				// Remember, this should only ever be called / used from the mobile filter element.
				if ($scope.mobileDisplay) {
					$scope.mobileDisplay = false;
					$scope.isMobileAndVisible = false;
					$scope.isMobileAndHidden = true;
					ContentMgr.showAppFooter();
					return;
				}
				$scope.mobileDisplay = true;
				$scope.isMobileAndVisible = true;
				$scope.isMobileAndHidden = false;
				ContentMgr.hideAppFooter();
			};

			$scope.$on('$destroy', function cleanUp() {
				vnProductParams.resetParams();
			});

			$scope.$on('$viewContentLoaded', function () {
				vnAppRoute.setRouteStrategy('category');
				vnApiClient.initialize().then(function() {
					$scope.getCategory($routeParams.slug, $routeParams.id);
				});
			});
		}
	]);
