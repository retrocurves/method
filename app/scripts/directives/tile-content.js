/**
 * @ngdoc directive
 * @name volusionMethodThemeApp.directive:tileContent
 * @description
 * # tileContent
 */
angular.module('Volusion.controllers')
	.directive('tileContent', ['$compile', function ($compile) {

		'use strict';

		return {
			restrict: 'A',
			link    : function postLink(scope, element, attrs) {

				var html = attrs.tileContent,
					compiled = $compile(html)(scope);

				element.append(compiled);
			}
		};
	}]);
