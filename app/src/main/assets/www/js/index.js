      /**************************************/
      /**********      Utils         *********/
      /**************************************/  
      var $debug = true;

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
    layer =  L.marker(L.latLng(bso.shape.coords[0].lat, bso.shape.coords[0].lng));
    layer.addTo(map);
    cache.put(bso.id,layer);

  }else if(bso.shape.type == "area"){



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
 var map = L.map('map').setView([37.75, -122.23], 10);

 L.esri.basemapLayer('Imagery').addTo(map);
 L.esri.basemapLayer('ImageryLabels').addTo(map);

   //bso layer
  var myLayer = L.geoJson().addTo(map);

//location control
 L.control.locate({
              onLocationError: function(err) {console.log(err.message)},  // define an error callback function
              onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
                console.log(context.options.strings.outsideMapBoundsMsg);
              },
              showPopup: false, // display a popup when the user click on the inner marker
            }).addTo(map);


map.setView(new L.LatLng(48.85, 2.4), 11);   

//tell android java context that map is ready
mapReady();

 
      //button
      $("#ooo-click-me").click(function(e){

       JSBridge.touch();

     });


      ////////////////////////////////////////////////////////////////////////////////////








