(function(){
	angular
		.module('app')
		.factory('userService', userService);
		
	function userService() {
		return {
			username:undefined
		}
	}
})();