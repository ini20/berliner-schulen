var fs = require('fs');
var parse = require('csv-parse');
var http = require('http');

var httpRequests = 0;
var schools = [];

var indexOf = function (schoolarray, bsn) {
	for (var a = 0; a < schoolarray.length; a++) {
		var school = schoolarray[a];
		if (school.bsn == bsn)
			return a;
	}
	return -1;
};

var searchAddress = function(school)
{
	//search the address
	var url = 'http://nominatim.openstreetmap.org/search/';
	var params = '?format=json&addressdetails=1&limit=1&polygon_svg=1';
	var query = school.Strasse + ", " + school.PLZ + ", Berlin";
	var encoded = encodeURI(query);
	url = url + encoded + params;

	var req = http.get(url, function(res) {

		res.setEncoding("utf8");
		var body = "";
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function(err){
			if(err)
			{
				console.log(err);
			}
			var place = JSON.parse(body);
			if(!place[0])
			{
				console.log("Response has no data. School: " + school.Schulname);
				return;
			}
			school.lat = place[0].lat;
			school.lon = place[0].lon;
			console.log('Found Coords for school: ' + school.Schulname);
			httpRequests++;
			console.log('number of httpRequests: ' + httpRequests + '/' + schools.length);
		});
		res.on('error', function (err) {
			console.log(err);
		});
	});

	req.on('error', function(err){
		console.log("Problem" + err.message);
		httpRequests++;
	});
};

var writeToJSONFile = function(schools){
	console.log("Writing to file");
	var jsonSchools = JSON.stringify(schools);
	fs.writeFile('data.json', jsonSchools, 'utf8');
};

var searchAddresses = function(counter)
{
	var school = schools[counter];
	console.log('will search for: ' + school.Schulname);
	searchAddress(school);
	counter++;
	if(counter < schools.length)
	{
		setTimeout(function(){
			searchAddresses(counter);
		}, 1500);
	}
	else {
		console.log('waiting 10 seconds before saving');
		setTimeout(function() {
			writeToJSONFile(schools);
		}, 10000);
	}
};

fs.readFile("Schuldaten2015-02.csv", 'utf-8', function(err, data){
	if(err)
	{
		console.log("Error reading the specified File");
		console.log(err);
	}
	parse(data, {delimiter: ';', escape: '\'', quote: '\'', trim: true}, function(err, output){

		var headers = output[0];

		for(var i = 1; i< output.length; i++) {
			var line = output[i];
			var bsn = line[0];

			if (bsn == "" || bsn == " ")
				continue;

			var index = indexOf(schools, bsn);

			if (index == -1) {
				var school = {};
				school.bsn = bsn;

				for (var t = 1; t < line.length; t++) {
					var attrName = headers[t];
					var value = line[t];

					if (value == "" || value == " " || value == 0 || value == 2 ||
						value == "0" || value == "2")
						continue;

					if (attrName === "Schulzweig") {
						if (school[attrName] === undefined)
							school[attrName] = [];

						school[attrName].push(value);
					}
					else if (attrName === "Bauten") {
						school[attrName] = [];
						var bauten = value.split(', ');
						for (var s = 0; s < bauten.length; s++) {
							school[attrName].push(bauten[s]);
						}
					}
					else if (attrName == "Fremdsprachen") {
						school[attrName] = [];
						var languages = value.split(', ');
						for (var s = 0; s < languages.length; s++) {
							school[attrName].push(languages[s]);
						}
					}
					else if (attrName == "Leistungskurse") {
						school[attrName] = [];
						var mainClasses = value.split(', ');
						for (var s = 0; s < mainClasses.length; s++) {
							school[attrName].push(mainClasses[s]);
						}
					}
					else
						school[attrName] = value;
				}
				console.log('Parsed school: ' + school.Schulname);
				schools.push(school);
			}
			else {
				var exSchool = schools[index];
				exSchool["Schulzweig"].push(line[5]);
				exSchool["BemerkungenSchulzweig"] += " " + line[22];
			}
		}

		searchAddresses(0);
	});
});

