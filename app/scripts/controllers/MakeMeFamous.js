'use strict';

angular.module('integrationApp')
  .controller('MakeMeFamousCtrl', function ($scope, $http, famous) {
    $scope.rows = [];
    var api = "/latest";
    var tweets = $http.get(api);

    var inThrees = function(array, fn) {
      _.each(_.range(array.length / 3), function(i) {
        fn(array[3*i], array[3*i+1], array[3*i+2]);
      });
    };

    tweets.then(function(response) {
      var ySoFar = 0;
      inThrees(response.data, function(first, second, third) {
        if (Math.random()  < 0.5) {
          $scope.rows.push({
            height: 2*height,
            y: ySoFar,
            elements: [{
              tweet: first,
              size: 2*height,
              x: 0,
              y: 0
            }, {
              tweet: second,
              size: height,
              x: 2*height,
              y: 0,
            }, {
              tweet: third,
              size: height,
              x: 2*height,
              y: height,
            }]
          });
          ySoFar += 2*height;
        }
        else {
          $scope.rows.push({
            height: height,
            y: ySoFar,
            elements: [{
              tweet: first,
              size: height,
              x: 0,
              y: 0
            }, {
              tweet: second,
              size: height,
              x: height,
              y: 0,
            }, {
              tweet: third,
              size: height,
              x: 2*height,
              y: 0,
            }]
          });
          ySoFar += height;
        }
      });
    });

    var height = 320 / 3;
    $scope.height = height;

    $scope.size = function(tweet) {
      return tweet.height || height;
    };

    var Transitionable = famous["famous/transitions/Transitionable"];
    var GenericSync = famous['famous/inputs/GenericSync'];
    var EventHandler = famous['famous/core/EventHandler'];

    $scope.visible = new Transitionable(0);

    var sync = new GenericSync(function() {
      return $scope.visible.get(1);
    }, {direction: GenericSync.DIRECTION_Y});

    sync.on('update', function(data) {
      $scope.visible.set(data.p);
    });

    $scope.eventHandler = new EventHandler();
    $scope.eventHandler.pipe(sync);

    $scope.offset = function() {
      return $scope.visible.get();
    };

    $scope.images = [];

    $scope.toTop = function() {
      console.log("click");
      $scope.visible.set(0, {duration: 500, curve: "easeOut"});
    };

    var row = function(n) {
      var nColumns = 3;
      return Math.floor(n / nColumns);
    };

    var hidden = function(row) {
      return row.y + row.height + $scope.offset() < 0;
    };

    var flat = function(row) {
      return row.y + row.height < $scope.offset();
    };

    var visible = function() {
      return $scope.visible.get();
    };

    var rotating = function(row) {
      return -$scope.offset() > row.y && -$scope.offset();
      return -$scope.offset() > (row.y - row.height) && -$scope.offset() < row.y;
    };

    var columnOffset = function(n) {
      return 0;
    };

    //
    // rotating - if the top of the visible area is between the top of
    //            the picture and the bottom of the pictures


    $scope.grid = {
      x: function(tweet) {
        return tweet.xOffset;
      },
      y: function(row) {
        if (rotating(row)) return 0;
        return row.y + $scope.offset();
      },
      z: function(row) {
        if (!rotating(row)) return 0;
        var height = row.height;
        var visibleHeight = (row.y + row.height + $scope.offset());
        var z = Math.sqrt((height * height) - (visibleHeight * visibleHeight));
        return -z;
      },
      xRotation: function(row) {
        if (rotating(row)) {
          var visibleHeight = (row.y + row.height + $scope.offset());
          var oppositeOverHypotenuse = visibleHeight / row.height;
          var theta = (Math.PI / 2) - Math.asin( visibleHeight / row.height);
          return theta;
        }
        if (hidden(row)) return Math.PI / 2;
        return 0;
      }
    };

    window.offset = $scope.offset;

    $scope.positions = _.map($scope.profilePics, function(pic) {
    });
  });