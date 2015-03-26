/*************************************/
/********   Configuration    ********/
/**************************************/  
var config={
  debug:true,
  mapSrc:"france",
  map :{ 
	   france:{
		location: new L.LatLng(48.85, 2.4),
		zoomLevel : 10,
	   },
	   afgha:{
		   location: new L.LatLng(34.59, 69.8),
		   mapUrl:'http://192.168.1.130/arcgis/rest/services/SWContest/Afghanistan/MapServer',
		   zoomLevel : 12,
	   },
	   afghaTiled:{
		   location: new L.LatLng(34.59, 69.8),
		   mapUrl:'http://192.168.246.20/arcgis/services/Contestreduit/MapServer/WMSServer',
		   layers:'0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33',
		   zoomLevel : 12,
	   },
  }

}



/**************************************/
/**********      Utils         *********/
/**************************************/  
var $debug = config.debug;

var _log = function(msg){
  if(typeof(JSBridge) === "undefined"){
        //in browser
        console.log(msg);
      }else{
        //in Android
        JSBridge.log(msg);
      }

    }
    var _debug = function(msg){
      if($debug){
        _log(msg);
      }

    }


    //transform ponctual Bso to leaflet marker
    //@private
    var _toMarker = function(bso){
     try{
      var markerIcon;
      if(bso.type =='danger'){markerIcon = L.AwesomeMarkers.icon({icon: 'warning', prefix: 'fa', markerColor: 'red'});}
      else{markerIcon = L.AwesomeMarkers.icon({icon: 'info', prefix: 'fa', markerColor: 'orange'});}
      return _bindPopup(L.marker(L.latLng(bso.shape.coords[0].lat, bso.shape.coords[0].lon), {icon: markerIcon}),bso);
      }catch(reason){
        _log("ERROR: unable to transform ponctual to Marker with reason :" +reason);
      }
   }


    //transform area Bso to leaflet polygone
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
       if(bso.type =='danger'){color = "#ff0000";}
      else{color = "#FF8100";}
      return _bindPopup(L.polygon(edges,{weight:1,color:color}),bso);

      }catch(reason){
        _log("ERROR: unable to transform area to polygone with reason :" +reason);
      }
   }
    //add popup info to bso
   var _bindPopup = function(layer,bso){
    return layer.bindPopup("<b>"+bso.type+"</b><br>"+bso.name);
   }


  _log("loading index.js ..." );

  /**************************************/
  /**********    Classes       *********/
  /**************************************/



  /**********     Cache class    *********/

  var Cache = (function () {
    function Cache() {
      this._cache = {};
    }

    Cache.prototype.put = function (key, value) {
      var normalizedKey = normalizeKey(key);
      var current = this._cache[normalizedKey];
      this._cache[normalizedKey] = value;
      return current;
    };

    Cache.prototype.get = function (key) {
     var normalizedKey = normalizeKey(key);
     return this._cache[normalizedKey];
   };



   Cache.prototype.remove = function (key) {
    var normalizedKey = normalizeKey(key);
    var current = this._cache[normalizedKey];
    if (current !== undefined) {
      delete this._cache[normalizedKey];
    }
    return current;
  };

  var normalizeKey = function(key){
   return "$"+key.replace(/\W/g, '_');
 }
 return Cache;
})();


/**************************************/
/**********    Functions       *********/
/**************************************/

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
 if(bso.shape.type == "ponctual"){

  layer = _toMarker(bso);
  if(layer != undefined){
    layer.addTo(map);
    cache.put(bso.id,layer);
  }

}else if(bso.shape.type == "area"){

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

    /**************************************/
    /**********    MAIN          *********/
    /**************************************/
 //Bso's cache
 var cache = new Cache();

 //Map
 var map = L.map('map')
   _log("Map source is '"+config.mapSrc+"'" );
 if (config.mapSrc == 'france'){
	 map.setView(config.map.france.location,  config.map.france.zoomLevel);
	 L.esri.basemapLayer('Imagery').addTo(map);
	 L.esri.basemapLayer('ImageryLabels').addTo(map);
 }
 if (config.mapSrc == 'afgha') { 
	 map.setView(config.map.afgha.location,  config.map.afgha.zoomLevel);
	 L.esri.dynamicMapLayer( config.map.afgha.mapUrl).addTo(map);
 }
 if (config.mapSrc == 'afghaTiled') { 
	map.setView(config.map.afghaTiled.location,  config.map.afghaTiled.zoomLevel);
	L.tileLayer.wms(config.map.afghaTiled.mapUrl, {
    layers: config.map.afghaTiled.layers,
    }).addTo(map);
 }
 
 

//location control
L.control.locate({
              onLocationError: function(err) {console.log(err.message)},  // define an error callback function
              onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
                console.log(context.options.strings.outsideMapBoundsMsg);
              },
              showPopup: false, // display a popup when the user click on the inner marker
            }).addTo(map);



//tell android java context that map is ready
mapReady();


var alertPanel = L.control({position: 'bottomright'});


alertPanel.onAdd = function (map) {
    var div = L.DomUtil.create('div',"c-alert-panel-width");
       
       //set ID and hide it
    $(div).attr("id","action").hide();

    // build alert panel buttons
	var shadowHtml ='<div class="c-alert-panel-list">';

   for (var i = 0; i < 6; i++) {
    var icon,text;
    switch (i){
      case 0: icon="fa-ambulance"; text="sos";
      break;
      case 1: icon="fa-street-view"; text="report";
      break;
       case 2: icon="fa-bomb"; text="bomb";
      break;
      case 3: icon="fa-ban"; text="no-way";
      break;
      case 4: icon="fa-camera"; text="picture";
      break;
      case 5: icon="fa-exclamation-triangle";  text="alert";
      break;
    }
        shadowHtml +=
        '<button type="button" class="btn btn-danger"><i class="fa '+icon+'  fa-2x"></i><span class="glyphicon-class">'+text+'</span></button>';
    }
	shadowHtml +='</ul>';	shadowHtml +='</div>';
	div.innerHTML = shadowHtml;

    return div;
};

alertPanel.addTo(map);


//alert panel show/hide
var show=true;
$("#ooo-click-me").click(function(e){

   $("#action").toggle( "fade" );

});
