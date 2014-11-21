/*globals Firebase*/
angular.module('Volusion.services')
	.factory('Sites', ['$firebase', '$filter', function ($firebase, $filter) {

		'use strict';

		var savedSiteName;
		var gridsterLayoutSingleton;

		function getGridsterLayout(siteName) {
			savedSiteName = siteName;
			var ref = new Firebase('https://phoenix-sites.firebaseio.com/sites/' + savedSiteName + '/pageTemplates/home/gridsterLayout');
			gridsterLayoutSingleton = $firebase(ref).$asArray();
			return gridsterLayoutSingleton;
		}

		function saveGridsterLayout() {
			console.log('fired saveGridsterLayout');
			//var sortedArray = $filter('orderBy')(gridsterLayoutSingleton, ['row','col']); //fix order of gridster array since gridster requires it
			//setPriorities(sortedArray);

			var sortedArrayDesc = $filter('orderBy')(gridsterLayoutSingleton, ['row','col'], true); //fix order of gridster array since gridster requires it
			setPrioritiesSaveInReverseOrder(sortedArrayDesc);


			//////////////////////////////////////////////////////////
			//Exploring a way to save all updates at once...
			//save it all at once, since Gridster (on additional clients/browsers) doesn't do well with incremental updates.

			//var ref = new Firebase('https://phoenix-sites.firebaseio.com/sites/' + savedSiteName + '/pageTemplates/home/gridsterLayout');
			//var sync = $firebase(ref);
			//console.log(sortedArray);
			//var jsonToSave = angular.fromJson(angular.toJson(sortedArray)); //strip off all the angular junk
			//console.log('jsonToSave', jsonToSave);
            //
			//delete jsonToSave[0].$id;
			//delete jsonToSave[1].$id;
			//delete jsonToSave[2].$id;
			//delete jsonToSave[3].$id;
			//delete jsonToSave[4].$id;
			//delete jsonToSave[5].$id;
            //
			//delete jsonToSave[0].$priority;
			//delete jsonToSave[1].$priority;
			//delete jsonToSave[2].$priority;
			//delete jsonToSave[3].$priority;
			//delete jsonToSave[4].$priority;
			//delete jsonToSave[5].$priority;
            //
			//console.log('jsonToSave', jsonToSave);
			//sync.$set(jsonToSave);
			//sync.$set(angular.fromJson('{"gridsterLayout":[{"test":555]}'));
			//////////////////////////////////////////////////////////
		}

		//function setPriorities(sortedArray) {
		//	var count = 0;
		//	angular.forEach(sortedArray, function(item) {
		//		count++;
		//		var fbItem = gridsterLayoutSingleton.$getRecord(item.$id);
		//		fbItem.$priority = count;
		//		console.log(count, fbItem, fbItem.$priority, item.$id);
		//		gridsterLayoutSingleton.$save(fbItem);
		//	});
		//}

			function setPrioritiesSaveInReverseOrder(sortedArray) {
				var length = sortedArray.length;
				angular.forEach(sortedArray, function(item) {
					var fbItem = gridsterLayoutSingleton.$getRecord(item.$id);
					fbItem.$priority = length;
					console.log(length, fbItem, fbItem.$priority, item.$id);
					gridsterLayoutSingleton.$save(fbItem);
					length--;
				});
			}

		return {
			getGridsterLayout  : getGridsterLayout,
			saveGridsterLayout : saveGridsterLayout
		};
	}]);
