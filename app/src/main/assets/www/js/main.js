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


var alertPanel = L.control({position: 'bottomright'});


alertPanel.onAdd = function (map) {
    var div = L.DomUtil.create('div',"c-alert-panel-width");

       //set ID and hide it
    $(div).attr("id","action").hide();

    // build alert panel buttons
	var shadowHtml ='<div class="c-alert-panel-list">';

   for (var i = 0; i < 8; i++) {
    var icon,text,id;
    switch (i){
      case 0: icon="icon/riot.png"; text="riot";id="militia";
      break;
      case 1: icon="icon/armed-group.png"; text="militia";id="militia";
      break;
       case 2: icon="icon/bomb.png"; text="bomb";id="bomb";
      break;
      case 3: icon="icon/death.png"; text="dead";id="dead";
      break;
      case 4: icon="icon/injured.png"; text="injured";id="injured";
      break;
      case 5: icon="icon/tank.png";  text="vehicle";id="vehicle";
      break;
       case 6: icon="icon/kidnap.png";  text="kinapping";id="kinapping";
      break;
       case 7: icon="icon/other.png";  text="report";id="report";
      break;

    }
        shadowHtml +=
        '<button id="'+ id +'" type="button" class="btn btn-primary"><img  src="'+icon+'"></img><span class="glyphicon-class">'+text+'</span></button>';
    }
	shadowHtml +='</ul>';	shadowHtml +='</div>';
	div.innerHTML = shadowHtml;

    return div;
};

alertPanel.addTo(map);



var position = $("#report-btn").offset();
console.log("position.top = "+position.top);
console.log("position.left = "+position.left);
console.log("width = "+$("#report-btn").width());
console.log("height = "+$("#report-btn").height());




//alert panel show/hide
var show=true;
$("#report-btn").click(function(e){
   $("#action").toggle( "fade" );
});

//alert panel actions
$(".c-alert-panel-list button").click(function(e){
  console.log("clicked : " + $(this).attr("id"));
  event.stopPropagation();

});
