// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ionicApp', ['ionic','nfcFilters','nvd3','stadium'])

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
  $scope.svgHeight = document.getElementById('navigationContentId').offsetHeight;
  $scope.gridRow = 7;
  $scope.gridCol = 6;
  $scope.level = 1;

  $scope.svgClicked= function(event){
      var x = event.clientX;     // Get the horizontal coordinate
      //FIXME
      var y = event.clientY - 40;
      var width  = Math.round($scope.svgWidth/$scope.gridCol);
      var heigth = Math.round($scope.svgHeight/$scope.gridRow);

      var maxY = heigth * $scope.gridRow;
      var maxX = width * $scope.gridCol;
      console.debug("x="+x+", y="+y+"width="+width+", heigth="+heigth+"maxX="+maxX+", maxY="+maxY)
      if (y > 0 && y <= maxY && x <= maxX && x > 0){
          var row = 0;
          while(y > 0){
              y = y-heigth;
              row++;
          }

          var col = 0;
          while(x > 0){
              x = x-width;
              col++;
          }
          var pathId = "path_"+row+"_"+col;
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
	var tnf = ndef.TNF_EXTERNAL_TYPE, // NDEF Type Name Format
        recordType = "android.com:pkg", // NDEF Record Type
        payload = "Payload test Bee in IT", // content of the record
        record, // NDEF record object
        message = [];

    // create the actual NDEF record:
    record = ndef.record(tnf, recordType, [], payload);
    message.push(record);


	nfc.addNdefListener( function (nfcEvent){
		nfc.write(
	            message, // write the record itself to the tag
	            function () {
					$scope.$apply(function () {
						$scope.message = "Ecriture sur le Tag terminé!";
					});
					nfc.removeNdefListener();
		        },
	            // this function runs if the write command fails:
	            function (reason) {
		            $scope.$apply(function () {
						$scope.message = "Erreur lors de l'écriture sur le Tag " + reason;
					});
		        }
            )
	}
	);

})

.controller('formatCtrl', function($scope) {
	delete $scope.message;
	nfc.addNdefListener(function (nfcEvent) {
		nfc.erase(function () {
					$scope.$apply(function () {
						$scope.message = "Formattage du Tag terminé!";
						nfc.removeNdefListener();
					});
		        }, function () {
		            $scope.$apply(function () {
						$scope.message = "Erreur lors du formattage du Tag";
					});
		        });
	});
 })


.controller('readCtrl', function($scope) {
    nfc.addNdefListener(function (nfcEvent) {
            console.log(JSON.stringify(nfcEvent.tag, null, 4));
            $scope.$apply(function () {
            	$scope.tag = nfcEvent.tag;
            });
        }, function () {
            console.log("Listening for NDEF Tags.");
            nfc.removeNdefListener();
        }, function (reason) {
            alert("Error adding NFC Listener " + reason);
        });
});

