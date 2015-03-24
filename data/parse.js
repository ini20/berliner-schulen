var fs = require('fs');

var indexOf = function(schoolarray, bsn){
	for(var a = 0; a < schoolarray.length; a++)
	{
		var school = schoolarray[a];
		if(school.bsn == bsn)
			return a;
	}
	return -1;
};

fs.readFile("data/Schuldaten2015.csv", 'utf-8', function(err, data){
	if(err)
	{
		console.log("Error reading the specified File");
		console.log(err);
	}

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

				if(value == "" || value == " ")
					continue;

				if(attrName === "Schulzweig") {
					if(school[attrName] === undefined)
						school[attrName] = [];

					school[attrName].push(value);
				}
				else
					school[attrName] = value;
			}
		}else
		{
			school["Schulzweig"].push(attributes[4]);
			school["BemerkungenSchulzweig"] += " " + attributes[22];
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
});

