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


app.run(function($state, $window, $location, $rootScope) {
	$rootScope.$on('$stateChangeStart', function(){
		if(!$rootScope.ActiveUser){
			$location.path('/login');
		}
	});
	
});

app.component('nHeader', {
	templateUrl: "pages/partials/header.html",
	controller: function($rootScope, $scope, $state, $uibModal, $log, cookieDelFactory){
		console.log('header is working');
		console.log('HROOT', $rootScope.ActiveUser);
		//$scope.ActiveUser = $rootScope.ActiveUser;

	var ctrl = this;
	//ctrl.ActiveUser = $rootScope.ActiveUser;
	//get activeuser from cookies

	/*mod component*/
	ctrl.openComponentModal = function () {
    var modalInstance = $uibModal.open({
      animation: true,
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

  //logout
  ctrl.cookDel = function(){
        	console.log(document.cookie);
        	cookieDelFactory.cookieDel();
        	$rootScope.ActiveUser = false;
        	$state.go('/');
        }	
    // /logout


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
	 controller: function($rootScope, $state, $location, $uibModal, cookieDelFactory){
        var ctrl = this;
        if($rootScope.ActiveUser){
        	console.log('in member now', $rootScope.ActiveUser);
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
        	
        	ctrl.isValid = function(){
        		if($scope.login.$valid) return true;
        	};

        	if($scope.login.$valid ){
        		$rootScope.ActiveUser = {
        			email: ctrl.email,
        			password: ctrl.password
        		}
        		console.log('create root', $rootScope.ActiveUser);
        		console.log(ctrl.email);
        		//document.cookie = "email="+ctrl.email; +" password="+ctrl.password;
        			
				document.cookie = "activeUser=" + JSON.stringify($rootScope.ActiveUser) + "; expires=" + (new Date(Date.now() + 7 * 86400000).toGMTString());
				
        		$location.url('/member');
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

app.factory('cookieDelFactory', [function factory() {
        return {
            cookieDel: function(){
            	console.log(document.cookie);
				var cookie_date = new Date ( );  // Текущая дата и время
				cookie_date.setTime ( cookie_date.getTime() - 1 );
				document.cookie = "activeUser=; expires=" + cookie_date.toGMTString();
				console.log(document.cookie);
            }
        };
}]);

/*
при логине сохранять логин в куки, в имя куки подставлять email
при выходе удалять куку
!!!лучше хранить не в куке а в сессии, а если поставить галочку "запомнить", то тогда в куках

при создании товара дописывать email из куки
при повторном логине проверять есть ли в массиве товаров товары с данным email

разделить вывод на "все товары" и "мои товары" с возможностью редатирования

crtl.loguot = function(){
	document.cookie = "activeuser=; path=/; expires=" + date.toUTCString();
}

app.factory('factory', [function factory() {
            
        return {
            cookieDel: function(){
				document.cookie = "activeuser=; path=/; expires=" + date.toUTCString();
				console.log(document.cookie);
            }
        };

    }]);


*/
