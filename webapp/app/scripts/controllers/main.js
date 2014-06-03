'use strict';

angular.module('schooldataApp')
  .controller('MainCtrl', function ($scope, $http) {
    var es = sp.config.elasticsearch;
    var query = {
      aggs: {
        district: {
          terms: {
            field: 'name',
            size: 0
          }
        }
      }
    };
    var url = es.host + '/' + es.index + '/district/_search';

    $http.post(url, query).success(function(data) {
      var districts = [];
      $.each(data.aggregations.district.buckets, function(i, v){
        districts.push(v.key);
      });
      $scope.districts = districts;
    });

    $scope.schoolTypes = [
      'Schulpraktisches Seminar',
      'Berlin-Kolleg',
      'Berufsschule',
      'Berufsfachschule',
      'Fachoberschule',
      'Fachschule',
      'Berufliches Gymnasium',
      'Berufsoberschule',
      'Abend-Gymnasium',
      'Abend-Hauptschule',
      'Abend-Realschule',
      'Ausländische Schule',
      'Freie Waldorfschule',
      'Grundschule',
      'Gymnasium',
      'Heilpraktikerschule',
      'Integrierte Sekundarschule',
      'Kosmetikschule',
      'Künstlerische Schule',
      'Sonstige Ergänzungsschule',
      'Sprachschulen',
      'Volkshochschul-Kolleg',
      'Volkshochschule',
      'Vorbereitungsschule auf Fremdenprüfung',
      'Wirtschafts- u. Verwaltungsschule'
    ];
    $scope.languages = ['Deutsch', 'Englisch', 'Französisch'];
    $scope.test = ['l'];
  });
