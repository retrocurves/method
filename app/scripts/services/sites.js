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


//angular.module('Volusion.services')
//	.factory('mySocket', ['$firebase', '$filter', 'socketFactory', function ($firebase, $filter, socketFactory) {
//
//		'use strict';
//		var options = {
//			path: '/socket.io-client'
//		}
//
//		var myIoSocket = io.connect('http://localhost:9000',options);
//
//		var mySocket = socketFactory({
//			ioSocket: myIoSocket
//		});
//
//		return mySocket;
//
//	}]);


/* global io */

angular.module('Volusion.services')
	.factory('socket', ['socketFactory', function(socketFactory) {

		'use strict';

			// socket.io now auto-configures its connection when we ommit a connection url
		var ioSocket = io('http://localhost:9000', {
			// Send auth token on connection, you will need to DI the Auth service above
			// 'query': 'token=' + Auth.getToken()
			path: '/socket.io-client'
		});

		var socket = socketFactory({
			ioSocket: ioSocket
		});

		return {
			socket: socket,

			/**
			 * Register listeners to sync an array with updates on a model
			 *
			 * Takes the array we want to sync, the model name that socket updates are sent from,
			 * and an optional callback function after new items are updated.
			 *
			 * @param {String} modelName
			 * @param {Array} array
			 * @param {Function} cb
			 */
			syncUpdates: function (modelName, array, cb) {
				cb = cb || angular.noop;

				/**
				 * Syncs item creation/updates on 'model:save'
				 */
				socket.on(modelName + ':save', function (item) {

					var oldItem = _.find(array, {_id: item._id});
					var index = array.indexOf(oldItem);
					var event = 'created';

					// replace oldItem if it exists
					// otherwise just add item to the collection
					if (oldItem) {
						array.splice(index, 1, item);
						event = 'updated';
					} else {
						array.push(item);
					}

					console.log(item);
					console.log(array);

					cb(event, item, array);
				});

				/**
				 * Syncs removed items on 'model:remove'
				 */
				socket.on(modelName + ':remove', function (item) {
					var event = 'deleted';
					_.remove(array, {_id: item._id});
					cb(event, item, array);
				});
			},

			/**
			 * Removes listeners for a models updates on the socket
			 *
			 * @param modelName
			 */
			unsyncUpdates: function (modelName) {
				socket.removeAllListeners(modelName + ':save');
				socket.removeAllListeners(modelName + ':remove');
			}
		};
	}]);
