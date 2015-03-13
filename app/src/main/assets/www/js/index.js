        JSBridge.log("Map - loading index.js" );


        var map = L.map('map').setView([37.75, -122.23], 10);

        L.esri.basemapLayer('Imagery').addTo(map);
        L.esri.basemapLayer('ImageryLabels').addTo(map);


        L.control.locate({
              onLocationError: function(err) {console.log(err.message)},  // define an error callback function
              onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
                console.log(context.options.strings.outsideMapBoundsMsg);
              },
              showPopup: false, // display a popup when the user click on the inner marker
            }).addTo(map);





     //vector
     var myLayer = L.geoJson().addTo(map);

     map.setView(new L.LatLng(48.85, 2.4), 11);

    
      //button
      $("#ooo-click-me").click(function(e){

       JSBridge.touch();

     });


      var draw = function(){
       addBso();
     }
      ////////////////////////////////////////////////////////////////////////////////////
      var testBso;



      var addBso = function(bsoJson){

       JSBridge.log("Map - bsoJson " + bsoJson);
        var bso = JSON.parse(bsoJson);
       JSBridge.log("Map - addBso " + bso);
        JSBridge.log("Map - addBso id " + bso.id);
     // var myBso = {"id":"id1","type":"name1","name":"explosion","shape":{"type":"ponctual","coords":[{"lat":48.85,"lng":2.4}]}};

     //  testBso = bso;
      // L.marker([myBso.shape.coords[0].lat,myBso.shape.coords[0].lng]).addTo(map);
       L.marker(L.latLng(bso.shape.coords[0].lat, bso.shape.coords[0].lng)).addTo(map);

      }

     //addBso();                 