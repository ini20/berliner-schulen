'use strict';

angular.module('schooldataApp')
  .controller('MainCtrl', function ($scope) {
    $scope.districts = [
      'Mitte',
      'Friedrichshain-Kreuzberg',
      'Pankow',
      'Charlottenburg-Wilmersdorf',
      'Spandau',
      'Steglitz-Zehlendorf',
      'Tempelhof-Schöneberg',
      'Neukölln',
      'Treptow-Köpenick',
      'Marzahn-Hellersdorf',
      'Lichtenberg',
      'Reinickendorf'
    ];
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
