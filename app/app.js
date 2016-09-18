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


app.run(function($state, $window, $location, $rootScope, cookieFactory) {
	$rootScope.$on('$stateChangeStart', function(){
		console.log(document.cookie);

		/*function get_cookie ( cookie_name ){
		  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
		 
		  if (results)
		    return (decodeURI(results[2]));
		  else
		    return null;
		};*/
		
		$rootScope.ActiveUser = JSON.parse(cookieFactory.cookieGet('activeUser'));
				
		if(!$rootScope.ActiveUser){
			$location.path('/login');
		}
	
	});
	
});

app.component('nHeader', {
	templateUrl: "pages/partials/header.html",
	controller: function($rootScope, $scope, $state, $uibModal, $log, cookieFactory){
		//console.log('header is working');

	var ctrl = this;

	/*mod component*/
	ctrl.openComponentModal = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      component: 'modalComponent',
      resolve: {
        user: function () {
          return $rootScope.ActiveUser;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      ctrl.selected = selectedItem;
      console.log(ctrl.selected);
    }, function () {
      //$log.info('modal-component dismissed at: ' + new Date());
    });
  };
  /*/mod component*/

  //logout
  ctrl.cookDel = function(){
        	console.log(document.cookie);
        	cookieFactory.cookieDel();
        	$rootScope.ActiveUser = false;
        	$state.go('/');
        }	
    // /logout
	}
});

app.component('nFooter', {
	templateUrl: "pages/partials/footer.html",
	controller: function($rootScope, $uibModal){
		//console.log('footer is working');
	}
});

app.component('front', {
	templateUrl: "pages/front.html",
	bindings: {
        memberView: "@",
    },
	 controller: function($rootScope, $state, $location, $uibModal, cookieFactory, goodsFactory){
        var ctrl = this;
        if($rootScope.ActiveUser){
        	console.log('in member now', $rootScope.ActiveUser);
        } else {console.log('in front now');}
        
        console.log('activuser', $rootScope.ActiveUser);
        ctrl.ActiveUser = $rootScope.ActiveUser;
    
    }
});

app.component('product', {
	templateUrl: "pages/partials/product.html",
	controller: function(goodsFactory){
		var ctrl = this;

		ctrl.products = goodsFactory;

		//ctrl.editMode = false;

        console.log(ctrl.products);
		console.log('product is working');
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
        	//console.log($scope.login.email.$valid);
        	//console.log($scope.login);
        	
        	console.log('Is all form valid?', $scope.login.$valid);
        	
        	ctrl.isValid = function(){
        		if($scope.login.$valid) return true;
        	};

        	if($scope.login.$valid ){
        		$rootScope.ActiveUser = {
        			email: ctrl.email,
        			password: ctrl.password
        		}
        		console.log('create root', $rootScope.ActiveUser);
        		if(ctrl.remember){
        			var date = new Date(new Date().getTime() + 3600 * 1000000);
        			document.cookie = "activeUser=" + JSON.stringify($rootScope.ActiveUser) + "; expires=" + date.toGMTString();
        		} else { 
        			document.cookie = "activeUser=" + JSON.stringify($rootScope.ActiveUser);
        		}
    
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
  controller: function ($rootScope, cookieFactory) {
    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.currentUserInfo = ctrl.resolve.user
      console.log(ctrl.currentUserInfo);
    };

    ctrl.ok = function () {
    	console.log(ctrl.userEdit);
    	ctrl.close({$value: ctrl.userEdit});


		// function get_cookie ( cookie_name ){
		//   var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
		 
		//   if (results)
		//     return (decodeURI(results[2]));
		//   else
		//     return null;
		// };

    	document.cookie = "activeUser=" + JSON.stringify(ctrl.userEdit);
    	$rootScope.ActiveUser = JSON.parse(cookieFactory.cookieGet('activeUser'));
    	console.log($rootScope.ActiveUser);
    };

    ctrl.cancel = function () {
      ctrl.dismiss({$value: 'cancel'});
    };
  }
});

app.factory('cookieFactory', [function factory() {
        return {
            cookieDel: function(){
				var cookie_date = new Date ( );  // Текущая дата и время
				cookie_date.setTime ( cookie_date.getTime() - 1 );
				document.cookie = "activeUser=; expires=" + cookie_date.toGMTString();
				console.log(document.cookie);
            },

            cookieGet: function ( cookie_name ){
      			  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
      			 
      			  if (results)
      			    return (decodeURI(results[2]));
      			  else
      			    return null;
      			}

        };
}]);

app.factory('goodsFactory', [function factory(){
	return [
		{	name: 'Prodact1',
			price: '100',
			image: 'gallery1.jpg',
			description: 'some description\'s text к п3 6aerg56 reg ager agreg aerg areg areg arg arga '

		},
		{	name: 'Prodact2',
			price: '200',
			image: 'gallery3.jpg',
			description: 'some description\'s text'

		},
		{	name: 'Prodact3',
			price: '300',
			image: 'girl1.jpg',
			description: 'some description\'s text'

		},
		{	name: 'Prodact4',
			price: '400',
			image: 'girl3.jpg',
			description: 'some description\'s text'

		}
	]
}]);

/*
при логине сохранять логин в куки, в имя куки подставлять email
при выходе удалять куку
!!!лучше хранить не в куке а в сессии, а если поставить галочку "запомнить", то тогда в куках
Если куке не ставить время жизним, то кука будет считаться сессионной и будет жить до закрытия браузера (т.е. можно создавать куку без времени, а если поставить "запомнить", то задать время)

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
