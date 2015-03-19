//
var marker1 = {
	id:"Marker.01",
	type: "danger",
	name:"marker-01",
	shape:{
	type : "ponctual",
	coords:[{lat:48.90,lon:2.5}]
	}
}

var marker2 = {
	id:"Marker.02",
	type: "watch",
	name:"marker-02",
	shape:{
	type : "ponctual",
	coords:[{lat:48.85,lon:2.5}]
	}
}


var polygon1 = {
	id:"Polygon.01",
	type: "danger",
	name:"polygon-01",
	shape:{
		type : "area",
		coords:[{lat:48.9851567648082,lon:2.2525327883962},
		{lat:48.9743627794255,lon:2.37587841339621},
		{lat:49.0105451569975,lon:2.40780316339621},
		{lat:49.018476375828,lon:2.23898895506287}
		]
	}
}

var polygon2 = {
	id:"Polygon.02",
	type: "watch",
	name:"polygon-02",
	shape:{
		type : "area",
		coords:[{lat:48.8851567648082,lon:2.2525327883962},
		{lat:48.8743627794255,lon:2.37587841339621},
		{lat:48.9005451569975,lon:2.40780316339621},
		{lat:48.908476375828,lon:2.23898895506287}
		]
	}
}

//test add
addBso(JSON.stringify(marker1));
addBso(JSON.stringify(marker2));

addBso(JSON.stringify(polygon1));
addBso(JSON.stringify(polygon2));

if(cache.get("Marker.01") == undefined){

	console.log("TEST-FAIL 'Marker.01' not in cache ");
}
if(cache.get("Polygon.01") == undefined){

	console.log("TEST-FAIL 'Polygon.01' not in cache ");
}

//test remove
setTimeout(function(){

removeBso("Marker.01");
if(cache.get("Marker.01") !== undefined){

	console.log("TEST-FAIL 'Marker.01' should have been deleted ");
}
if(cache.get("Polygon.01") == undefined){

	console.log("TEST-FAIL 'Polygon.01' not in cache ");
}

},2000);


//test update
polygon1.shape.coords.forEach(function(element,index,array){
 element.lat -= 0.1;
});
setTimeout(function(){
	updateBso(JSON.stringify(polygon1));
	if(cache.get("Polygon.01") == undefined){

	console.log("TEST-FAIL 'Polygon.01' not in cache ");
   }
},5000);

