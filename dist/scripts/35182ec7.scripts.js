function Translate(a,b,c,d,e){this.$translate=a,this.$translatePartialLoader=b,this.storage=c,this.disableTranslations=e,this.configure(angular.extend(d,this.getConfig())),this.addPart=b.addPart}function TranslateProvider(a){this.$translateProvider=a,this.setPreferredLanguage=a.preferredLanguage}angular.module("Volusion.directives",[]),angular.module("Volusion.filters",[]),angular.module("Volusion.services",[]),angular.module("Volusion.decorators",[]),angular.module("Volusion.controllers",[]),angular.module("methodApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngTouch","ui.bootstrap","pascalprecht.translate","snap","seo","angulartics","Volusion.toolboxCommon","Volusion.controllers","Volusion.decorators","Volusion.directives","Volusion.filters","Volusion.services"]).config(["$routeProvider","$locationProvider","translateProvider",function(a,b,c){"use strict";b.html5Mode(!0);var d={};c.configure(d),a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/p/:slug",{templateUrl:"views/product.html",controller:"ProductCtrl",resolve:{translations:["translate",function(a){return a.addParts("product")}]}}).when("/c/:slug",{templateUrl:"views/category.html",controller:"CategoryCtrl"}).when("/:slug",{templateUrl:"views/article.html",controller:"ArticlesCtrl"}).otherwise({redirectTo:"/"})}]).run(function(a,b,c){"use strict";b.isInDesktopMode=!0,enquire.register("screen and (max-width: 991px)",{unmatch:function(){a.close(),b.isInDesktopMode=!0},match:function(){b.isInDesktopMode=!1}}),b.$on("$routeChangeSuccess",function(){a.close()}),b.$on("$routeChangeError",function(a,b,d,e,f,g){a.preventDefault(),404===g.status&&c.location.replace("/404.html")})}),angular.module("methodApp").controller("MainCtrl",["$scope","$rootScope","$location","vnApi",function(a,b,c,d){"use strict";b.seo={},a.mainNav=d.Nav().get({navId:1}),a.config=d.Configuration().get(),a.cart=d.Cart().get()}]),angular.module("methodApp").controller("CategoryCtrl",["$scope","$rootScope","$location","vnApi",function(a,b,c,d){"use strict";function e(a){var b,c;if(a.hasOwnProperty(b))for(b in a)if(c=a[b],c.title&&"Brand"===c.title)return c.properties;throw new Error("CategoryCtrl: Did not find a brand object in the facets object from api.")}function f(a){var b,c;for(b in a)if(a.hasOwnProperty(b)&&(c=a[b],c.title&&"Color"===c.title))return console.log("How does app determine the colors? ",c),c.properties;throw new Error("CategoryCtrl: Did not find a brand object in the facets object from api.")}b.seo={},a.selectBrand=function(){console.log("update for the brand: ",a.brand)};var g={slug:c.path().split("/")[2]},h=d.Category().get(g);h.$promise.then(function(b){a.category=b.data,a.subCategories=a.category.subCategories}).then(function(){var b=d.Product().query({categoryIds:a.category.id});b.$promise.then(function(b){a.products=b.data,a.brands=e(b.facets),a.colors=f(b.facets)})})}]),angular.module("Volusion.controllers").controller("ProductCtrl",["$rootScope","$scope","vnApi","$sce","$location","$routeParams",function(a,b,c,d,e,f){"use strict";function g(){h.optionSelection={images:"default"},h.image=h.images.default[0],i.options=i.options||{}}var h={},i={};b.interval=4e3,b.isopen1=!0,c.Product().get({code:"ah-chairbamboo"}).$promise.then(function(c){b.product=c.data;var d=e.absUrl(),j=b.seo.metaTagTitle;b.product.sharing={facebook:"http://www.facebook.com/sharer.php?u="+d+"/",twitter:"http://twitter.com/share?url="+d+"&amp;text="+j,tumblr:"http://www.tumblr.com/share/link?url="+d+"&amp;name="+j,googlePlus:"https://plus.google.com/share?url="+d},h=b.product,i=b.cartItem=h.cartItem,b.isInDesktopMode=a.isInDesktopMode,angular.extend(b.seo,h.seo),g(),console.log("route params: ",f)}),b.toTrusted=function(a){return d.trustAsHtml(a)},c.Review().get({code:"ah-chairbamboo"}).$promise.then(function(a){b.ratingsAndReviews=a}),b.decrementQty=function(){i.quantity--},b.incrementQty=function(){i.quantity++}}]),angular.module("methodApp").controller("PageCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("Volusion.services").provider("config",function(){function a(){this.greet=function(){return b}}var b="Hello";this.setSalutation=function(a){b=a},this.$get=function(){return new a}});var ApiEndpointConfig=function(a){"use strict";var b={"delete":{method:"DELETE"},get:{method:"GET"},patch:{method:"PATCH"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},save:{method:"POST"},update:{method:"PUT"}};this.actions=angular.extend(b,a||{});var c=this;angular.forEach(c.actions,function(a,b){c.addHttpAction(b,a)})};ApiEndpointConfig.prototype.route=function(a){"use strict";return this.route=a,this},ApiEndpointConfig.prototype.model=function(a){"use strict";return this.model=a,this},ApiEndpointConfig.prototype.addHttpAction=function(a,b){"use strict";this.actions[a]=b};var ApiEndpoint=function(a,b,c){"use strict";this.config=b,this.resource=c(a+b.route,{},b.actions);var d=this;angular.forEach(b.actions,function(a,b){var c=d.request;d[b]=angular.bind(d,c,b)})};ApiEndpoint.prototype.request=function(a,b,c){"use strict";return this.resource[a](b,c).$promise};var ApiProvider=function(){"use strict";this.baseRoute="",this.endpoints={}};ApiProvider.prototype.setBaseRoute=function(a){"use strict";this.baseRoute=a},ApiProvider.prototype.endpoint=function(a,b){"use strict";var c=new ApiEndpointConfig(b);return this.endpoints[a]=c,c},ApiProvider.prototype.$get=["$resource",function(a){"use strict";var b={},c=this;return angular.forEach(c.endpoints,function(d,e){b[e]=new ApiEndpoint(c.baseRoute,d,a)}),b}],angular.module("Volusion.services").provider("api",ApiProvider).config(["apiProvider",function(a){"use strict";var b={save:{method:"POST",headers:{vMethod:"POST"}},update:{method:"POST",headers:{vMethod:"PUT"}}};a.endpoint("products").route("/products/:code"),a.endpoint("reviews").route("/products/:code/reviews"),a.endpoint("categories").route("/categories/:id"),a.endpoint("config").route("/config"),a.endpoint("relatedProducts").route("/products/:code/relatedProducts"),a.endpoint("accessories").route("/products/:code/accessories"),a.endpoint("navs").route("/navs/:navId"),a.endpoint("carts",b).route("/carts/:cartId")}]),angular.module("Volusion.services").factory("tokenGenerator",function(){"use strict";function a(){return{_:(new Date).valueOf()}}return{getCacheBustingToken:a}});var storageKey="VN_TRANSLATE";Translate.prototype.getConfig=function(){var a=this.storage,b=JSON.parse(a.get(storageKey))||{},c=a.get("NG_TRANSLATE_LANG_KEY");return!this.disableTranslations&&c&&"undefined"!==c&&(b.lang=c),b},Translate.prototype.configure=function(a){a=angular.extend(this.getConfig(),a),this.storage.set(storageKey,JSON.stringify(a)),this.$translate.use(a.lang)},Translate.prototype.addParts=function(){if(this.disableTranslations)return!0;var a=this.$translatePartialLoader;return angular.forEach(arguments,angular.bind(this,function(b){a.addPart(b)})),this.$translate.refresh()},TranslateProvider.prototype.$get=["$translate","$translatePartialLoader","storage",function(a,b,c){var d=this.options;return new Translate(a,b,c,{region:d.region,lang:d.lang,country:d.country},d.disableTranslations)}],TranslateProvider.prototype.configure=function(a){a=angular.extend({region:"us",lang:"en",country:"us"},a),a.lang&&this.setPreferredLanguage(a.lang),this.options=a,a.disableTranslations||this.initTranslateProvider(a.lang)},TranslateProvider.prototype.initTranslateProvider=function(a){var b=this.$translateProvider;b.useLoader("$translatePartialLoader",{urlTemplate:"/translations/{part}/{lang}.json"}),"en"===a&&b.useMessageFormatInterpolation(),b.useMissingTranslationHandlerLog(),b.useLocalStorage()},angular.module("Volusion.services").provider("translate",["$translateProvider",TranslateProvider]),angular.module("Volusion.services").factory("storage",["$window","$cookieStore",function(a,b){function c(){return{get:function(b){var c=a.localStorage.getItem(b);return null===c?d(b):c},set:function(b,c){return a.localStorage.setItem(b,c)},remove:function(b){return a.localStorage.removeItem(b)}}}function d(a){var c=b.get(a);return"undefined"==typeof c?null:c}function e(){return{get:function(a){return d(a)},set:function(a,c){return b.put(a,c)},remove:function(a){return b.remove(a)}}}return"localStorage"in a&&null!==a.localStorage?c():e()}]),angular.module("Volusion.directives").directive("easyZoom",function(){"use strict";function a(a){b.standardSrc&&b.zoomSrc&&(a.swap(b.standardSrc,b.zoomSrc),b={})}var b={};return{restrict:"A",replace:!0,templateUrl:"template/easyZoom.html",scope:{ngSrc:"=",ezAdjacent:"=",ezOverlay:"=",ezZoomSrc:"=",alt:"@"},link:function(c,d){var e=d.easyZoom(),f=e.data("easyZoom");c.$watch("ngSrc",function(c){void 0!==c&&(b.standardSrc=c,a(f))}),c.$watch("ezZoomSrc",function(c){void 0!==c&&(b.zoomSrc=c,a(f))}),c.$on("$destroy",function(){f.teardown()})}}}).run(["$templateCache",function(a){"use strict";a.put("template/easyZoom.html",'<div class="easyzoom easyzoom--adjacent" data-ng-class="{ \'easyzoom--adjacent\': ezAdjacent, \'easyzoom--overlay\': ezOverlay }"><a data-ng-href="{{ezZoomSrc}}"><img class="img-responsive" data-ng-src="{{ngSrc}}" alt="{{alt}}"><div class="th-product-view__zoom"></div></a></div>')}]);