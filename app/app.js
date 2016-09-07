'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ui.router',
 
]);

app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
	

	$stateProvider.state('/', {    
        url: "/",
        template: "<front></front>"
    });

	$stateProvider.state('login', {    
        url: "/login",
        template: "<login></login>"
    });
    
$urlRouterProvider.otherwise('/');

 
}]);

app.component('front', {
	templateUrl: "pages/front.html",
	 controller: function(){
        var ctrl = this;
        console.log('in front now');}
});

app.component('login', {
	templateUrl: "pages/login.html",
	 controller: function($scope){
        var ctrl = this;
        console.log('in login now');

        ctrl.login = function(){
        	console.log(ctrl.email, ctrl.password, ctrl.remember);
        	ctrl.re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        	console.log($scope.login.email.$valid);
        	console.log($scope.login);
        	// if (ctrl.re.test(ctrl.email)){alert('val')}
        	// 	else{alert('noVal');}
        };


    }
});
