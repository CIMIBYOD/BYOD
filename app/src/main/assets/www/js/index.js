/*************************************/
/********   Configuration    ********/
/**************************************/  
var config={
  debug:true,
  map :{
  //initial map location
  location: new L.LatLng(48.85, 2.4),
//initial zoom 
zoomLevel : 10

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
      return _bindPopup(L.marker(L.latLng(bso.shape.coords[0].lat, bso.shape.coords[0].lon)),bso);
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
        edges.push(L.latLng(bso.shape.coords[i].lat, bso.shape.coords[i].lon));
      }
      return _bindPopup(L.polygon(edges),bso);

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
 var map = L.map('map').setView(config.map.location,  config.map.zoomLevel);

 L.esri.basemapLayer('Imagery').addTo(map);
 L.esri.basemapLayer('ImageryLabels').addTo(map);


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


var legend = L.control({position: 'bottomright'});

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

        $(div).attr("id","action").hide();


    // loop through our density intervals and generate a label with a colored square for each interval
   for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
/*  div.innerHTML +=  
'<div class="panel panel-default"><div class="panel-heading"><span class="panel-title">Reports</span></div>'+
  '<div class="panel-body">';
  
 

 div.innerHTML += '<div class="list-group">' +
  '<a href="#" class="list-group-item active">'+
    '<p class="list-group-item-text">Boom</p>'+
  '</a>'+
   '<a href="#" class="list-group-item">'+
    '<p class="list-group-item-text">Paf</p>'+
  '</a>'+
'</div>'

 div.innerHTML +='</div></div>';
*/
    return div;
};

legend.addTo(map);


      //button
      var show=true;
      $("#ooo-click-me").click(function(e){
        if(show){
          $("#action").show();
show = false;
        }else{
           $("#action").hide();
show = true;
        }


     });


      ////////////////////////////////////////////////////////////////////////////////////


      if(config.test){

//$.getScript( "js/spec/testVector.js", function( data, textStatus, jqxhr ) {
//
//  console.log( "testVector loaded with status : " +textStatus );
//});

    }





