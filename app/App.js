(function(){

angular.module('templates', []);
var module = angular.module('AppName', [
	'ui.router',
	'templates'
	]);

/*
 * Start your engines!
 */
angular.element(document).ready(function() {
	angular.bootstrap(document, ['AppName']);
});

/*
 * Routes
 */
module.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('app', {

		});
	$urlRouterProvider.otherwise('/');
});

/*
 * App Init
 */
module.run(function($rootScope, $state) {
	
	// If a route goes wrong, go to the default state
	$rootScope.$on('$stateChangeError', function() {
		$state.go('app');
	});
});

}());