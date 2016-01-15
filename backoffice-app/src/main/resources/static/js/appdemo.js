// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ionicApp', ['ionic','stadium'])

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.scrolling.jsScrolling(true);
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html',
      controller: 'homeCtrl'
    })
    .state('navigate', {
      url: '/navigate',
      templateUrl: 'navigate.html',
      controller: 'navigateCtrl'
    })
    .state('verify', {
      url: '/verify',
      templateUrl: 'verify.html',
      controller: 'verifyCtrl'
    })
    .state('save', {
      url: '/save',
      templateUrl: 'save.html',
      controller: 'saveCtrl'
    })
    .state('buy', {
      url: '/buy',
      templateUrl: 'buy.html',
      controller: 'buyCtrl'
    })
    .state('format', {
      url: '/format',
      templateUrl: 'format.html',
      controller: 'formatCtrl'
    })
    .state('read', {
      url: '/read',
      templateUrl: 'read.html',
      controller: 'readCtrl'
    });

  $urlRouterProvider.otherwise("/");

})

.controller('homeCtrl', function($scope) {
	$scope.tag = {};
})
.controller('navigateCtrl', function($scope,$window) {

  $scope.svgWidth = document.getElementById('navigationContentId').offsetWidth;
  $scope.svgHeight = document.getElementById('navigationContentId').offsetHeight - 60;
  $scope.gridRow = 7;
  $scope.gridCol = 6;
  $scope.level = 1;

  $scope.firstSelectedId = null;
  $scope.secondSelected = null;
  $scope.width  = Math.round($scope.svgWidth/$scope.gridCol);
  $scope.heigth = Math.round($scope.svgHeight/$scope.gridRow);
  $scope.maxY = $scope.heigth * $scope.gridRow;
  $scope.maxX = $scope.width * $scope.gridCol;

  $scope.svgClicked= function(event){
      var x = event.clientX;     // Get the horizontal coordinate
      //FIXME
      var y = event.clientY - 40;


      if($scope.firstSelectedId != null && $scope.secondSelected != null){
          document.getElementById($scope.firstSelectedId).setAttribute("fill", "none");
          document.getElementById($scope.secondSelected).setAttribute("fill", "none");
          $scope.firstSelectedId = null;
          $scope.secondSelected = null;
      }

      if (y > 0 && y <= $scope.maxY && x <= $scope.maxX && x > 0){
          var row = 0;
          while(y > 0){
              y = y-$scope.heigth;
              row++;
          }

          var col = 0;
          while(x > 0){
              x = x-$scope.width;
              col++;
          }
          var pathId = "path_"+row+"_"+col;
          var target = document.getElementById(pathId);
          if($scope.firstSelectedId == null){
              $scope.firstSelectedId = pathId;
              target.setAttribute("fill", "magenta");
          }else if($scope.secondSelected == null && $scope.secondSelected != $scope.firstSelectedId){
              $scope.secondSelected = pathId;
              target.setAttribute("fill", "yellow");
          }


      }

  };
  //$scope.svgWidth = 500;
  //$scope.svgHeight = 700;


})
.controller('verifyCtrl', function($scope) {


})
.controller('saveCtrl', function($scope) {


})
.controller('buyCtrl', function($scope) {


})
.controller('formatCtrl', function($scope) {

 })
.controller('readCtrl', function($scope) {

});

