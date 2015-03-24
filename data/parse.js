var fs = require('fs');
var parse = require('csv-parse');
var http = require('http');

var httpRequests = 0;

var indexOf = function(schoolarray, bsn){
	for(var a = 0; a < schoolarray.length; a++)
	{
		var school = schoolarray[a];
		if(school.bsn == bsn)
			return a;
	}
	return -1;
};

fs.readFile("data/Schuldaten2015-02.csv", 'utf-8', function(err, data){
	if(err)
	{
		console.log("Error reading the specified File");
		console.log(err);
	}
	parse(data, {delimiter: ';', escape: '\'', quote: '\'', trim: true}, function(err, output){

		var headers = output[0];
		var schools = [];

		for(var i = 1; i< output.length; i++){
			var line = output[i];
			var bsn = line[0];

			if(bsn == "" || bsn == " ")
				continue;

			var index = indexOf(schools, bsn);

			if(index == -1)
			{
				var school = {};
				school.bsn = bsn;

				for(var t = 1; t < line.length; t++)
				{
					var attrName = headers[t];
					var value = line[t];

					if(value == "" || value == " " || value == 0 || value == 2 ||
						value == "0" || value == "2")
						continue;

					if(attrName === "Schulzweig") {
						if(school[attrName] === undefined)
							school[attrName] = [];

						school[attrName].push(value);
					}
					else if(attrName === "Bauten")
					{
						school[attrName] = [];
						var bauten = value.split(', ');
						for(var s = 0; s < bauten.length; s++)
						{
							school[attrName].push(bauten[s]);
						}
					}
					else if(attrName == "Fremdsprachen")
					{
						school[attrName] = [];
						var languages = value.split(', ');
						for(var s = 0; s < languages.length; s++)
						{
							school[attrName].push(languages[s]);
						}
					}
					else if(attrName == "Leistungskurse")
					{
						school[attrName] = [];
						var mainClasses = value.split(', ');
						for(var s = 0; s < mainClasses.length; s++)
						{
							school[attrName].push(mainClasses[s]);
						}
					}
					else
						school[attrName] = value;
				}


			}
			else
			{
				var exSchool = schools[index];
				exSchool["Schulzweig"].push(line[5]);
				exSchool["BemerkungenSchulzweig"] += " " + line[22];
			}

			//search the address
			var query = school.strasse + ", " + school.PLZ + ", Berlin";
			var options = {
				host: ' http://nominatim.openstreetmap.org',
				path: '/search/q=' + query,
				port: 80,
				method: 'POST'
			};

			httpRequests++;
			var req = http.request(options, function(res){

				httpRequests--;
				schools.push(school);
				if(httpRequests == 0)
				{
					var schoolsJSON = JSON.stringify(schools);
					fs.writeFile("data/data.json", schoolsJSON, function(err){
						if(err)
							console.log(err);
					});
					console.log("Done!");
				}
			});
		}
	});


	/*


	var lines = data.split('\r\n');
	var schools = [];

	var headers = lines[0].split('\t');

	for(var i = 1; i < lines.length; i++)
	{
		var line = lines[i];
		var attributes = line.split('\t');
		var bsn = attributes[0];

		if(bsn == "" || bsn == " ")
			continue;

		var index = indexOf(schools, bsn);

		if(index == -1) {
			var school = {};
			school.bsn = bsn;

			for(var t = 1; t < attributes.length; t++)
			{
				var attrName = headers[t];
				var value = attributes[t];

				if(value == "" || value == " " || value == 0 || value == 2 ||
					value == "0" || value == "2")
					continue;

				if(attrName === "Schulzweig") {
					if(school[attrName] === undefined)
						school[attrName] = [];

					school[attrName].push(value);
				}
				else if(attrName === "Bauten")
				{
					school[attrName] = []
					var bauten = value.split(', ');
					for(var s = 0; s < bauten.length; s++)
					{
						school[attrName].push(bauten[s]);
					}
				}
				else if(attrName == "Fremdsprachen")
				{
					school[attrName] = [];
					var languages = value.split(', ');
					for(var s = 0; s < languages.length; s++)
					{
						school[attrName].push(languages[s]);
					}
				}
				else
					school[attrName] = value;
			}
		}else
		{
			console.log(school);
			school["Schulzweig"].push(attributes[5]);
			school["BemerkungenSchulzweig"] += " " + attributes[22];
			continue;
		}
		console.log("parsed: " + school.Schulname);
		schools.push(school);

	}

	console.log("Done!");
	var schoolsJSON = JSON.stringify(schools);
	fs.writeFile("data/data.json", schoolsJSON, function(err){
		if(err)
			console.log(err);
	});
	*/
});

