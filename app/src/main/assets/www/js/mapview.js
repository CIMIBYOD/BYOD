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

    /**********    transform ponctual Bso to leaflet marker     *********/
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
