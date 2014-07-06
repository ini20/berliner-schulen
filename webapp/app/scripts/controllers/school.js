'use strict';

/**
 * @ngdoc function
 * @name schooldataApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the schooldataApp
 */
angular.module('schooldataApp')
  .controller('SchoolCtrl', ['$scope', '$routeParams', 'es', function ($scope, $routeParams, es) {
    $scope.schoolId = $routeParams.schoolId;

    $scope.schoolData = {};
    $scope.error = null;
    $scope.loading = null;

    var body = {};
    body.query = {
        bool: {
            must : [{
            query_string: {
                default_field: 'school.bsn',
                query: $routeParams.schoolId
            }}]
    }};

    body.size = 1;

    var ctrl = this;

    this.loadSchool = function() {
        $scope.loading = 1;
        $scope.error = null;
        es.search({
                index: sp.config.elasticsearch.index,
                type: 'school',
                body: body
            }).then(function (returned) {
                $scope.schoolData = {}; // reset from possible previous value
                // we found the school
                if (returned.hits.total > 0) {
                    $scope.schoolData = returned.hits.hits[0]._source;
                    ctrl.initPersonellCharData();
                } else {
                    $scope.error = "";
                }
                $scope.loading = null;
            }, function(error) {
                $scope.error = "";
                $scope.loading = null;
                console.log(error.message);
        });
    };

    this.initPersonellCharData = function() {
        $scope.personellData = null;
        if ($scope.schoolData.personell === undefined) {
            return;
        }
        var p = $scope.schoolData.personell;
        var years = [];
        var bars = [];
        p.forEach(function(d) {
            var val = [];
            d.data.forEach(function(yd) {
                if (years.indexOf(yd.year) == -1) {
                    years.push(yd.year);
                }
                val.push(parseInt(yd.amount_f) + parseInt(yd.amount_m));
            });
            bars.push({
                x : d.name,
                y : val
            });
        });
        bars.sort(function(b1, b2) {
            return b1.x.localeCompare(b2.x);
        });
        $scope.personellData = {
            series : years,
            data : bars
        };

        console.log($scope.personellData);

        var alternate = false;

        setTimeout(function() {
            d3.select('#chart').selectAll('g.x.axis g.tick text').
            attr('y', function() {
                if (alternate) {
                    alternate = false;
                    return 20;
                } else {
                    alternate = true;
                    return 7;
                }
            });
        }, 100);

    };

    $scope.chartType = 'bar';

    $scope.config = {
    tooltips: false,
    labels: false,
    mouseover: function() {},
    mouseout: function() {},
    click: function() {},
    legend: {
      display: true,
      //could be 'left, right'
      position: 'right'
    }
  };

    this.loadSchool();

  }]);
