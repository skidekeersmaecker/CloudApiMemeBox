var app = angular.module("memeboxApp",[]);

app.controller("mainControlsController", function($scope, $http, $interval) {
  var mainControls = this;

  mainControls.images = [];

  // TODO Build functionality to fetch images
  getDB();

  // Form behavior
  mainControls.inputText = "";

  //op save button click
  mainControls.troll = function() {
    // TODO Send the input text to the server and let the server create an appropriate meme.

    //maak json van bestand om door te sturen
    $scope.text = { 'text': $scope.mainControls.inputText};
    console.log("entered: " + $scope.text.text);

    //post input naar server side (start.js)
    $http.post("http://localhost:3000/api/inputText", $scope.text).success(function (res) {
      console.log("send: " + $scope.text);
    });


    // TODO Then refresh the images, which should now include the new one
    getDB();
  };

  // TODO Refresh every 3 seconds
  $interval(getDB, 3000);

  function getDB() {
  //if (params.access_token) {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/api/getDb'
    }).then(function (response) {
      mainControls.images = response.data.images;
      showDbDataConsole();
    }, function (err) {
      $scope.name = err;
    });
  //}
  }

  function showDbDataConsole() {
    console.log("      *****db*****\n");
    for (i = 0; i < mainControls.images.length; i++) {
      console.log("url: " + mainControls.images[i].url + "\noriginal_text: " + mainControls.images[i].original_text + "\n");
    }
    console.log("\n      ************");
  }

});
