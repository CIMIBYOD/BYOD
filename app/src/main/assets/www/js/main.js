/**************************************/
    /**********    MAIN          *********/
    /**************************************/

_log("loading map view ..." );

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


//alert panel show/hide
var show=true;
$("#report-btn").click(function(e){
  if(show == true){
  _log("Opening report panel ... ");
  show = false;
  React.render(
    React.createElement(ReportPanel, null),
    document.getElementById('report-panel-placeholder')
    );
  }else{
    _log("Dismounting report panel ... ");
    show = true;
   React.unmountComponentAtNode(document.getElementById('report-panel-placeholder'));
  }

});

//alert panel actions
$(".c-alert-panel-list button").click(function(e){
  e.stopPropagation();
  $(e.target).blur();

});
