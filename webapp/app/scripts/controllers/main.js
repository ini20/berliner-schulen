'use strict';

var sp = sp || {};

angular.module('schooldataApp')
    .controller('MainCtrl', ['$scope', '$http', 'es', 'mapService', function ($scope, $http, es, mapService) {
        console.log('main', $scope);
        es.search({
            index: sp.config.elasticsearch.index,
            type: 'district',
            body: {
                aggs: {
                    district: {
                        terms: {
                            field: 'name',
                            size: 0
                        }
                    }
                }
            }
        }).then(function (body) {
            var districts = [];
            angular.forEach(body.aggregations.district.buckets, function(v){
                districts.push(v.key);
            });
            $scope.districts = districts;
        }, function (error) {
            console.trace(error.message);
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

        $scope.updateFilter = function() {
            mapService.updateFilter({
                districts: this.selectedDistricts
            });
        };
    }]);
