'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ui.router',
  'ngMessages',
  'ui.bootstrap',
  'ngAnimate',

 
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

    $stateProvider.state('member', {    
        url: "/member",
        template: "<front member-view='true'></front>"
    });
    
	$urlRouterProvider.otherwise('/');
}]);

app.component('nHeader', {
	templateUrl: "pages/partials/header.html",
	controller: function($rootScope, $uibModal, $log){
		console.log('header is working');
		console.log('HROOT', $rootScope.ActiveUser);

	var ctrl = this;

	/*mod component*/
	ctrl.openComponentModal = function () {
    var modalInstance = $uibModal.open({
      animation: ctrl.animationsEnabled,
      component: 'modalComponent',
      resolve: {
        items: function () {
        	console.log('pass active', $rootScope.ActiveUser);
          return $rootScope.ActiveUser;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      ctrl.selected = selectedItem;
      console.log(ctrl.selected);
    }, function () {
      $log.info('modal-component dismissed at: ' + new Date());
    });
  };
  /*/mod component*/

	}
});

app.component('nFooter', {
	templateUrl: "pages/partials/footer.html",
	controller: function($rootScope, $uibModal){
		console.log('footer is working');
	}
});

app.component('front', {
	templateUrl: "pages/front.html",
	bindings: {
        //typeNavbar: "@",
        memberView: "@",
        //adminView: "@"
    },
	 controller: function($rootScope, $uibModal){
        var ctrl = this;
        if($rootScope.ActiveUser){
        	console.log('in member now');
        } else {console.log('in front now');}
        
        console.log('activuser', $rootScope.ActiveUser);
        ctrl.ActiveUser = $rootScope.ActiveUser;

    }
});

app.component('login', {
	templateUrl: "pages/login.html",
	 controller: function($rootScope, $scope, $location){
        var ctrl = this;
        console.log('in login now');

        ctrl.login = function(){
        	console.log(ctrl.email, ctrl.password, ctrl.remember);
        	ctrl.emailReg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        	ctrl.passReg = /[a-zA-Z0-9]/
        	console.log($scope.login.email.$valid);
        	console.log($scope.login);
        	// if (ctrl.emailReg.test(ctrl.email)){alert('val')}
        	// 	else{alert('noVal');}
        	//if(response from server is 'OK'){$location.url('/member');}
        	console.log('all form', $scope.login.$valid);
        	if($scope.login.$valid ){
        		$rootScope.ActiveUser = {
        			email: ctrl.email,
        			password: ctrl.password
        		}
        		$location.url('/member')
        	}
        	 console.log('error', $scope.login.$error);
        	 console.log($scope.login.email.$valid);
        };

    }
});


app.component('modalComponent', {
  templateUrl: 'pages/edit-user-modal.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function () {
    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.currentUserInfo = ctrl.resolve.currentUserInfo
      
     
    };

    ctrl.ok = function () {
    	console.log(ctrl.userEdit);
    	ctrl.close({$value: ctrl.userEdit});

    };

    ctrl.cancel = function () {
      ctrl.dismiss({$value: 'cancel'});
    };
  }
});
