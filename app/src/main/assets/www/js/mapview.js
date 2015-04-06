/**********     addBso     *********/

//add bso on map
var addBso = function(bsoJson){

 _debug("addBso:["+bsoJson+"]");
 var bso = JSON.parse(bsoJson);
 _addBso(bso);

}
//@private
var _addBso = function(bso){
 var layer;
 if(bso.type == "event"){

  layer = _toMarker(bso);
  if(layer != undefined){
    layer.addTo(map);
    cache.put(bso.id,layer);
  }

}else if(bso.type == "area"){

  layer = _toPolygon(bso);
  if(layer != undefined){
    layer.addTo(map);
    cache.put(bso.id,layer);
  }

}

}

/**********     removeBso     *********/

  //remove bso from map
  var removeBso = function(id){

   _debug("removeBso:["+id+"]");
   var layer = cache.remove(id);
   map.removeLayer(layer)
 }

 /**********     updateBso     *********/

 //update bso from map
 var updateBso = function(bsoJson){
   _debug("updateBso");
   var bso = JSON.parse(bsoJson);
  //remove and create a new one
  removeBso(bso.id);
  addBso(bsoJson);
}

/**********    mapReady     *********/
 //map has been loaded
 var mapReady = function(){
   if(typeof(JSBridge) === "undefined"){
        //in browser
        console.log("map is ready!");
      }else{
        //in Android
        JSBridge.mapReady();
      }

    }

/**********    transform ponctual Bso to leaflet marker     *********/
//define icons

var markerIcons = {};
var icon = L.icon({
  iconUrl: 'icon/armed-group-marker.png',
  popupAnchor: [1, -16],
  iconSize:     [32, 32]
});
markerIcons["armed-group"]=icon;

icon = L.icon({
  iconUrl: 'icon/death-marker.png',
  popupAnchor: [1, -16],
  iconSize:     [32, 32]
});
markerIcons["death"]=icon;

icon = L.icon({
  iconUrl: 'icon/injured-marker.png',
  popupAnchor: [1, -16],
  iconSize:     [32, 32]
});
markerIcons["injured"]=icon;

icon = L.icon({
  iconUrl: 'icon/kidnap-marker.png',
  popupAnchor: [1, -16],
  iconSize:     [32, 32]
});
markerIcons["kidnap"]=icon;

icon = L.icon({
  iconUrl: 'icon/other-marker.png',
  popupAnchor: [1, -16],
  iconSize:     [32, 32]
});
markerIcons["other"]=icon;

icon = L.icon({
  iconUrl: 'icon/riot-marker.png',
  popupAnchor: [1, -16],
  iconSize:     [32, 32]
});
markerIcons["riot"]=icon;

icon = L.icon({
  iconUrl: 'icon/tank-marker.png',
  popupAnchor: [1, -16],
  iconSize:     [32, 32]
});
markerIcons["tank"]=icon;

icon = L.icon({
  iconUrl: 'icon/bomb-marker.png',
  popupAnchor: [1, -16],
  iconSize:     [32, 32]
});
markerIcons["bomb"]=icon;

icon = L.icon({
  iconUrl: 'icon/aircraft-marker.png',
  popupAnchor: [1, -16],
  iconSize:     [32, 32]
});
markerIcons["aircraft"]=icon;

icon = L.icon({
  iconUrl: 'icon/helico-marker.png',
  popupAnchor: [1, -16],
  iconSize:     [32, 32]
});
markerIcons["helico"]=icon;




//@private
var _toMarker = function(bso){
 try{
  return _bindPopup(L.marker(L.latLng(bso.shape.coords[0].lat, bso.shape.coords[0].lon), {icon: markerIcons[bso.subtype]}),bso);
  }catch(reason){
  _log("ERROR: unable to transform ponctual to Marker with reason :" +reason);
  }
}


/**********   transform area Bso to leaflet polygone     *********/

//@private
var _toPolygon = function(bso){
 try{
  var edges=[];
  for (var i=0;i<bso.shape.coords.length;i++){
    if(bso.shape.coords[i] !== null){
      edges.push(L.latLng(bso.shape.coords[i].lat, bso.shape.coords[i].lon));
    }
  }
  var color;
  if(bso.subtype =='danger'){color = "#ff0000";}
  else if(bso.subtype =='warning'){color = "#FF8100";}
  else if(bso.subtype =='safe'){color = "#00b35a";}
  else{color = "#ff0000";}
  return _bindPopup(L.polygon(edges,{weight:1,color:color}),bso);

}catch(reason){
  _log("ERROR: unable to transform area to polygone with reason :" +reason);
}
}
//add popup info to bso
var _bindPopup = function(layer,bso){
  try{
    console.log("bso.datetime is " + typeof(bso.datetime));
  var validity = new Date(parseInt(bso.datetime)).toDateString();
  return layer.bindPopup("<h5><b>"+bso.name+"</b></h5><br>"+"<b>report date : "+validity+"</b><br>"+bso.description);
}catch(e){/*TODO*/}
}
