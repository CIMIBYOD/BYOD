/*
A REGLER

1) l'ID a disparu des BSO ...
2) les icones des markers

*/
console.log(new Date().getTime());
var markers = [];
var cpt=1;
var marker = {
	id:"Marker."+ cpt++,
	datetime:"1428053296573",
	type: "event",
	subtype: "armed-group",
	name:"armed-group",
	description: "a description",
	shape:{
	type : "ponctual",
	coords:[{lat:48.85,lon:(2.4 +cpt*0.1)}]
	}

}
markers.push(marker);

marker = {
	id:"Marker."+ cpt++,
	datetime:"1428053296573",
	type: "event",
	subtype: "bomb",
	name:"bomb",
	description: "a description",
	shape:{
	type : "ponctual",
	coords:[{lat:48.85,lon:(2.4 +cpt*0.1)}]
	}
}
markers.push(marker);

marker = {
	id:"Marker."+ cpt++,
	datetime:"1428053296573",
	type: "event",
	subtype: "death",
	name:"death",
	description: "a description",
	shape:{
	type : "ponctual",
	coords:[{lat:48.85,lon:(2.4 +cpt*0.1)}]
	}
}
markers.push(marker);

marker = {
	id:"Marker."+ cpt++,
	datetime:"1428053296573",
	type: "event",
	subtype: "kidnap",
	name:"kidnap",
	description: "a description",
	shape:{
	type : "ponctual",
	coords:[{lat:48.85,lon:(2.4 +cpt*0.1)}]
	}
}
markers.push(marker);

marker = {
	id:"Marker."+ cpt++,
	datetime:"1428053296573",
	type: "event",
	subtype: "injured",
	name:"injured",
	description: "a description",
	shape:{
	type : "ponctual",
	coords:[{lat:48.85,lon:(2.4 +cpt*0.1)}]
	}
}
markers.push(marker);

marker = {
	id:"Marker."+ cpt++,
	datetime:"1428053296573",
	type: "event",
	subtype: "other",
	name:"other",
	description: "a description",
	shape:{
	type : "ponctual",
	coords:[{lat:48.85,lon:(2.4 +cpt*0.1)}]
	}
}
markers.push(marker);

marker = {
	id:"Marker."+ cpt++,
	datetime:"1428053296573",
	type: "event",
	subtype: "riot",
	name:"riot",
	description: "a description",
	shape:{
	type : "ponctual",
	coords:[{lat:48.85,lon:(2.4 +cpt*0.1)}]
	}
}
markers.push(marker);


marker = {
	id:"Marker."+ cpt++,
	datetime:"1428053296573",
	type: "event",
	subtype: "tank",
	name:"tank",
	description: "a description",
	shape:{
	type : "ponctual",
	coords:[{lat:48.85,lon:(2.4 +cpt*0.1)}]
	}
}
markers.push(marker);



var polygon1 = {
	id:"Polygon.01",
	datetime:"1428053296573",
	type: "area",
	subtype: "danger",
	name:"polygon-01",
	description: "a danger",
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
	datetime:"1428053296573",
	type: "area",
	subtype: "warning",
	name:"polygon-02",
	description: "a warning",
	shape:{
		type : "area",
		coords:[{lat:(48.9851567648082-0.1),lon:2.2525327883962},
		{lat:48.9743627794255-0.1,lon:2.37587841339621},
		{lat:49.0105451569975-0.1,lon:2.40780316339621},
		{lat:49.018476375828-0.1,lon:2.23898895506287}
		]
	}
}



var polygon3 = {
	id:"Polygon.03",
	datetime:"1428053296573",
	type: "area",
	subtype: "safe",
	name:"polygon-03",
	description: "a green zone",
	shape:{
		type : "area",
		coords:[{lat:(48.9851567648082-0.2),lon:2.2525327883962},
		{lat:48.9743627794255-0.2,lon:2.37587841339621},
		{lat:49.0105451569975-0.2,lon:2.40780316339621},
		{lat:49.018476375828-0.2,lon:2.23898895506287}
		]
	}
}

//test add
for(var i=0;i<markers.length;i++){
addBso(JSON.stringify(markers[i]));
}

addBso(JSON.stringify(polygon1));
addBso(JSON.stringify(polygon2));
addBso(JSON.stringify(polygon3));



if(cache.get("Marker.1") == undefined){

	console.log("TEST-FAIL 'Marker.1' not in cache ");
}
if(cache.get("Polygon.01") == undefined){

	console.log("TEST-FAIL 'Polygon.01' not in cache ");
}

//test remove
setTimeout(function(){

removeBso("Marker.1");
if(cache.get("Marker.01") !== undefined){

	console.log("TEST-FAIL 'Marker.01' should have been deleted ");
}
if(cache.get("Polygon.01") == undefined){

	console.log("TEST-FAIL 'Polygon.01' not in cache ");
}

},2000);


//test update
polygon1.shape.coords.forEach(function(element,index,array){
 element.lat -= 0.05;
});
setTimeout(function(){
	updateBso(JSON.stringify(polygon1));
	if(cache.get("Polygon.01") == undefined){

	console.log("TEST-FAIL 'Polygon.01' not in cache ");
   }
},5000);


