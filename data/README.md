# Datengrundlage

Im Ordner /data befinden sich die von der Schulbehörde bereitgestellten Rohdaten der Berliner Schulen, sowie ein Parser, der diese Daten in .json übersetzt.

## Rohdaten

Die Rohdaten befinden sich in der Datei 'Schuldaten2015.csv'. Als Seperator wurde ';' verwendet. 

## Aufbereitete Daten

Die für die Verwendung fertigen Daten befinden sich in der Datei 'data.json'. Die in der csv-Datei enthaltenen Datensätze liegen als json-Array vor. Jede Schule ist ein json-Objekt. Zusätzlich zu den Daten der Schulbehörde enthält jedes Schulobjekt ein latitude und ein longitude Property, sodass sie auf einer Karte dargestellt werden könne.

## Parser

Die umwandlung der Daten von csv nach json erfolt mit dem Script 'parse.js'. Zum Ausführen des Scripts ist eine Node.js-Installation erforderlich. 
Zunächst müssen Abhängigkeiten installiert werden
```
npm install
```
Anschließend kann das Script ausgeführt werden
```
node parse.js
```
In Zeile sieben und acht werden input- und output-Dateien festgelegt. Sollen andere Dateien verwendet werden, kann das an dieser Stelle geändert werden.
```javascript
var INPUT_FILE = "Schuldaten2015.csv";
var OUTPUT_FILE = 'data.json';
```

Zur bestimmung der Geokoordinaten aus den vorhandenen Adressen der Schulen wurde 'nominatem.openstreetmap.org' benutzt. Da maximal eine Anfrage pro Sekunde erlaubt ist, benötigt die Ausführung des Parsers ca. 20 Minuten.


