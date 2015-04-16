/**************************************/
/**********     MAIN          *********/
/**************************************/

_log("loading map view ..." );
var app={}

 //Bso's cache
 var cache = new Cache();
 app.cache = cache;

 //Map (Leaflet)
 var map = L.map('map',{
  attributionControl:false,

 })
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

 app.map = map;

//location control
L.control.locate({
    onLocationError: function(err) {_log(err.message)},  // define an error callback function
    onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
      _log(context.options.strings.outsideMapBoundsMsg);
    },
    showPopup: false, // display a popup when the user click on the inner marker
 }).addTo(map);



//tell android java context that map is ready
mapReady();

//alert panel show/hide
 app.view={};
 app.view.visible = false;

$("#report-btn").click(function(e){
 if(app.view.visible == false){
  _log("Opening report panel ... ");
  app.view.visible = true;
  var data = {reportURL: config.reportPanel.reportURL[config.reportPanel.reportURL.use]};
  React.render(
    React.createElement(ReportPanel, {data: data}),
    document.getElementById('report-panel-placeholder')
    );
  }else{
    _log("Dismounting report panel ... ");
    app.view.visible = false;
   React.unmountComponentAtNode(document.getElementById('report-panel-placeholder'));
  }

});


