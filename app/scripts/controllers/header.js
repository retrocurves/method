'use strict';
/**
 * @ngdoc function
 * @name methodApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the methodApp
 */

function setCategoryUrl(category) {
	category.url = '/c/' + category.content.slug + '/' + category.categoryId;
	category.name = category.content.name;

	if (category.childrenCategories && category.childrenCategories.length > 0) {
		angular.forEach(category.childrenCategories, function(childCategory) {
			setCategoryUrl(childCategory);
		});
	}
}

angular.module('Volusion.controllers')
	.controller('HeaderCtrl', [
			'$rootScope',
			'$scope',
			'$timeout',
			'$filter',
			'translate',
			'vnCart',
			'ContentMgr',
			'vnAppConfig',
			'vnSearchManager',
			'snapRemote',
			'vnApiClient',
		function (
			$rootScope,
			$scope,
			$timeout,
			$filter,
			translate,
			vnCart,
			ContentMgr,
			vnAppConfig,
			vnSearchManager,
			snapRemote,
			vnApiClient) {


            $scope.showSearchMobile = true;
            $scope.showSearchDesktop = false;
            $scope.searchLocal = vnSearchManager.getSearchText() || '';

            translate.addParts('common');
			translate.addParts('header');

			vnApiClient.initialize().then(function() {
				vnApiClient.api.Nav().get().then(function(response) {

					angular.forEach(response.items, function(item) {
						setCategoryUrl(item);
					});
					$scope.navCategoriesList = response.items;
				});
			}); 

			$scope.getCartItemsCount = function () {
				return vnCart.getCartItemsCount();
			};

			$scope.snapToggle = function (side) {
				if ($rootScope.isInDesktopMode) {
					snapRemote.toggle(side);
				} else {
					snapRemote.getSnapper().then(function(snapper) {
						if(side === snapper.state().state) {
							snapper.close();
						} else {
							snapper.expand(side);
						}
					});
				}
			};

			$scope.$watch(
				function () {
					return ContentMgr.getHeaderState();
				},
				function (state) {
					$scope.headerState = state;
				}, true);


		}]);
