var app = angular.module('fontApp', ['ngSanitize'])
          /* Filter for entries that have no metadata */
          .filter('metadata', function() {
            return function(cache) {

              if (!cache) return;
              var keys = Object.keys(cache);

              var fonts = keys.map(function(key) { return cache[key] });
              /* Filter list to remove an fonts with no metadata */
              return fonts.filter(function(font) { return !!font.metadata });
            };
          })
          /* One and only controller for this simple website */
          .controller('mainCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
            /* Fetch the font object using the API route */
            $http.get('http://localhost:8080/api')
                 .success(function(data, status, headers, config) {
                   console.log(data, status, headers);
                   $scope.fonts = data;
                 })
                 .error(function(data, status, headers, config) {
                   console.log(data);
                 });

            $scope.loadWebfonts = function() {

              $http.get('http://localhost:3000/api/names')
                .success(function(data, status, headers, config) {
                  WebFont.load({
                    google: {
                      families: data
                    }
                  });
                })
                .error(function(data, status, headers, config) {
                  console.log(data);
                });
            }

          }]);
