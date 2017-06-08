var app = angular.module("memeboxApp",[]);

app.controller("mainControlsController", function($scope, $http, $interval) {
  var mainControls = this;

  mainControls.images = [];

  // TODO Build functionality to fetch images

  $http.get("http://localhost:3000/api/getDb").success(function (res) {
      $scope.db = res;

      console.log("      *****db*****\n");
      for(i = 0; i < $scope.db.images.length; i++){
          console.log("url: " + $scope.db.images[i].url + "\noriginal_text: " + $scope.db.images[i].original_text + "\n");
      }
      console.log("\n      ************");
  });

  // Form behavior
  mainControls.inputText = "";
  mainControls.troll = function() {
    // TODO Send the input text to the server and let the server create an appropriate meme.

    $scope.text = { 'text': $scope.mainControls.inputText};
    console.log("entered: " + $scope.text.text);
    $http.post("http://localhost:3000/api/inputText", $scope.text).success(function (res) {
      //refreshData();
      console.log("send: " + $scope.text);
    });


    // TODO Then refresh the images, which should now include the new one
      //zie in post functie hier boven
  };

  // TODO Refresh every 3 seconds
});
