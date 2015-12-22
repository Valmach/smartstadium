angular.module('hello', [ 'ngRoute' ])
  .config(function($routeProvider, $httpProvider) {

	$routeProvider.when('/', {
		templateUrl : 'home.html',
		controller : 'home'
	}).when('/login', {
		templateUrl : 'login.html',
		controller : 'navigation'
	}).otherwise('/');

    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

  })
//-----------------------------------------
// AngularJS : Controller home
//-----------------------------------------
.controller('home', function($scope, $http) {
    $http.get('/resource/').success(function(data) {
      $scope.greeting = data;
    })
})
//-----------------------------------------
// AngularJS : Controller navigation
//-----------------------------------------
.controller('navigation', function($rootScope, $scope, $http, $location) {

  var authenticate = function(credentials, callback) {

    var headers = credentials ? {authorization : "Basic "
        + btoa(credentials.username + ":" + credentials.password)
    } : {};

    $http.get('user', {headers : headers}).success(function(data) {
    if (data.name) {
        $rootScope.authenticated = true;
        $rootScope.user = data.name
        $rootScope.admin = data && data.roles && data.roles.indexOf("ROLE_ADMIN")>0;
      } else {
        $rootScope.authenticated = false;
        $rootScope.admin = false;
      }
      callback && callback(true);
    }).error(function() {
      $rootScope.authenticated = false;
      callback && callback(false);
    });

  }

  authenticate();
  $scope.credentials = {};

  $scope.login = function() {
      authenticate($scope.credentials, function() {
        if ($rootScope.authenticated) {
          $location.path("/");
          $scope.error = false;
        } else {
          $location.path("/login");
          $scope.error = true;
        }
      });
  };

  $scope.logout = function() {
    $http.post('logout', {}).success(function() {
      $rootScope.authenticated = false;
      $rootScope.admin = false;
      $location.path("/");
    }).error(function(data) {
      $rootScope.authenticated = false;
      $rootScope.admin = false;
    });
  };

})
//-----------------------------------------
// AngularJS : Controller A_AJOUTER
//-----------------------------------------

//-----------------------------------------
; // End of angular.module hello