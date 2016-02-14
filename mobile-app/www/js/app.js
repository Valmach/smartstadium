// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ionicApp', ['ionic','nfcFilters','stade', 'firebase'])

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
    .state('login', {
      url: '/',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })
    .state('navigate', {
      url: '/navigate',
      templateUrl: 'templates/navigate.html',
      controller: 'navigateCtrl'
    })
    .state('share', {
      url: '/share',
      templateUrl: 'share.html',
      controller: 'shareCtrl'
    });

  $urlRouterProvider.otherwise("/");

})


.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://smartstadium.firebaseIO.com/users");
  return $firebaseAuth(usersRef);
})
.factory("StadeEvent", function($firebaseAuth) {


/*
  var usersRef = new Firebase("https://smartstadium.firebaseIO.com/events");

  return $firebaseAuth(usersRef);
  */

    return {all: function() {return eventResponse;}};

})
.controller('loginCtrl', function($rootScope, $scope, $state, $ionicHistory,$ionicLoading,Auth) {
// Setup the loader
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $rootScope.hasMessage = false;

  $rootScope.authData = null;
  $rootScope.anonymous = true;


  $scope.home = function() {
    $state.go('home');
  };



  $scope.logout = function(authMethod) {
      Auth.$unauth();
      $scope.authData = null;
      $scope.anonymous = true;
  };

  $scope.login = function(authMethod) {

    var provider = authMethod;
    var scope = {remember: "sessionOnly",scope: "email"};

    Auth.$authWithOAuthRedirect(provider, scope)
    .then(function(authData) {

    })
    .catch(function(error) {
      if (error.code === 'TRANSPORT_UNAVAILABLE') {
        Auth.$authWithOAuthPopup(authMethod).then(function(authData) {});
      } else {
        console.log(error);
      }
    });
  };

  Auth.$onAuth(function(authData) {
      if (authData === null) {
        $rootScope.anonymous = true;
      } else {
        $rootScope.anonymous = false;
      }
      // This will display the user's name in our view
      $rootScope.authData = authData;
    });

    $ionicLoading.hide();
})

.controller('homeCtrl', function($scope, $http, $ionicPopup,  $state, $rootScope, StadeEvent) {

  $scope.currentTitle =  "";
  $scope.currentEvent =  null;
  $scope.eventIndex = 0;
  $scope.eventMaxIndex = 0;
  $http.get('js/data.json').success (function(data){
    $scope.eventResponse = data.responseData;
    $scope.currentTitle =  $scope.eventResponse.title;
    $scope.currentEvent =  $scope.eventResponse.events[$scope.eventIndex];
    $scope.eventMaxIndex = $scope.eventResponse.events.length;
	});


  $scope.reading = false;

  $rootScope.selectedEvent = 1;
  $rootScope.selectedZone = "";

  $scope.startReader = function() {
    $scope.reading = true;
  };

  $scope.stopReader = function() {
    $scope.reading = false;
  };

   $scope.navigate = function(searchMode) {
      $scope.reading = false;
      if(searchMode){
        // Navigation depuis le bouton recherche
      }else{
           $rootScope.selectedEvent = 1;
           $rootScope.selectedZone = "B10";
      }

      $state.go('navigate');

   };

	$scope.tag = {};

  $scope.eventLeft = function() {
    $scope.eventIndex--;
    $scope.currentEvent =  $scope.eventResponse.events[$scope.eventIndex];
  };
  $scope.eventRight = function() {
    $scope.eventIndex++;
    $scope.currentEvent =  $scope.eventResponse.events[$scope.eventIndex];
  };

	$scope.toggle = function() {
    var button = document.querySelector('.toggle');
    var overlay = document.querySelector('.glass');
    if (overlay.className === 'glass down') {
      overlay.className = 'glass up';
    } else {
      overlay.className = 'glass down';
    }
  };

//Begin of the popup

$scope.showFeedbackPopup = function() {
  $scope.data = {};

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl: 'templates/sms.html',
    title: 'Messages',
    scope: $scope,
    buttons: [
      {
        text: 'OK',
        type: 'button-positive'
      },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          return true;
        }
      }
    ]
  });

  myPopup.then(function(res) {

  });


 };
// End of the popup




// Begin

 // Triggered on a button click, or some other target
 $scope.showPopup = function() {
   $scope.data = {}

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="password" ng-model="data.wifi">',
     title: 'Enter Wi-Fi Password',
     subTitle: 'Please use normal things',
     scope: $scope,
     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.data.wifi) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
             return $scope.data.wifi;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
   $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
   }, 3000);
  };

// End

})

.controller('navigateCtrl', function($scope,$window) {





  $scope.firstSelectedId = null;
  $scope.secondSelected = null;

  $scope.$on('$viewContentLoaded', function(){
    //Here your view content is fully loaded !!
  });

})

.controller('navigateOldCtrl', function($scope,$window) {

  $scope.svgWidth = document.getElementById('navigationContentId').offsetWidth;
  $scope.svgHeight = document.getElementById('stadeContainerId').offsetHeight;
  // - document.getElementById('navbarId').offsetHeight;
  $scope.gridRow = 14;
  $scope.gridCol = 12;
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
      var y = event.clientY - document.getElementById('navbarId').offsetHeight;


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
.controller('shareCtrl', function($scope) {


})

.controller('feedCtrl', function($scope) {

});

