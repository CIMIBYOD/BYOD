try {
            var map = new L.Map('map');

            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib = 'Map data © OpenStreetMap contributors';
            var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});

      L.control.locate({
        //  position: 'topleft',  // set the location of the control
       //   drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location
       //   follow: false,  // follow the user's location
        //  setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true
       //   keepCurrentZoomLevel: false, // keep the current map zoom level when displaying the user's location. (if `false`, use maxZoom)
        //  stopFollowingOnDrag: false, // stop following when the map is dragged if `follow` is true (deprecated, see below)
      //  remainActive: false, // if true locate control remains active on click even if the user's location is in view.
      //    markerClass: L.circleMarker, // L.circleMarker or L.marker
      //    circleStyle: {},  // change the style of the circle around the user's location
       //   markerStyle: {},
       //   followCircleStyle: {},  // set difference for the style of the circle around the user's location while following
       //   followMarkerStyle: {},
       //   icon: 'fa fa-map-marker',  // class for icon, fa-location-arrow or fa-map-marker
       //   iconLoading: 'fa fa-spinner fa-spin',  // class for loading icon
       //   circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds
       //   metric: true,  // use metric or imperial units
          onLocationError: function(err) {console.log(err.message)},  // define an error callback function
          onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
                  console.log(context.options.strings.outsideMapBoundsMsg);
          },
          showPopup: false, // display a popup when the user click on the inner marker
      //    strings: {
       //       title: "Show me where I am",  // title of the locate control
       //       popup: "You are within {distance} {unit} from this point",  // text to appear if user clicks on circle
        //      outsideMapBoundsMsg: "You seem located outside the boundaries of the map" // default message for onLocationOutsideMapBounds
       //   },
     //     locateOptions: {}  // define location options e.g enableHighAccuracy: true or maxZoom: 10
      }).addTo(map);


 //vector
        var myLayer = L.geoJson().addTo(map);

        var campus = {
            "type": "Feature",
            "properties": {
                "popupContent": "This is a great place in Paris",
                "style": {
                    weight: 2,
                    color: "#999",
                    opacity: 1,
                    fillColor: "#B0DE5C",
                    fillOpacity: 0.8
                }
            },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": [
                    [
                        [
                            [2.40432014465332, 48.84732195489861],
                            [2.40715255737305, 48.84620006835170],
                            [2.40921249389647, 48.84468219277038],
                            [2.41067161560059, 48.84362625960105],
                            [2.41195907592773, 48.84290029616054],
                            [2.40989913940431, 48.84078835902781],
                            [2.40758171081543, 48.84059036160317],
                            [2.40346183776855, 48.84059036160317],
                            [2.40097274780272, 48.84059036160317],
                            [2.40062942504881, 48.84072235994946],
                            [2.40020027160645, 48.84191033368865],
                            [2.40071525573731, 48.84276830198601],
                            [2.40097274780272, 48.84369225589818],
                            [2.40097274780272, 48.84461619742136],
                            [2.40123023986816, 48.84534214278395],
                            [2.40183105468751, 48.84613407445653],
                            [2.40432014465332, 48.84732195489861]
                        ],[
                            [2.40361204147337, 48.84354376414072],
                            [2.40301122665405, 48.84278480127163],
                            [2.40221729278564, 48.84316428375108],
                            [2.40283956527711, 48.84390674342741],
                            [2.40361204147337, 48.84354376414072]
                        ]
                    ],[
                        [
                            [2.40942707061768, 48.83989736613708],
                            [2.40942707061768, 48.83910536278566],
                            [2.40685214996338, 48.83923736397631],
                            [2.40384807586671, 48.83910536278566],
                            [2.40174522399902, 48.83903936209552],
                            [2.40041484832764, 48.83910536278566],
                            [2.40041484832764, 48.83979836621592],
                            [2.40535011291504, 48.83986436617916],
                            [2.40942707061768, 48.83989736613708]
                        ]
                    ]
                ]
            }
        };


        function onEachFeature(feature, layer) {
        			var popupContent = "<p>I started out as a GeoJSON " +
        					feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

        			if (feature.properties && feature.properties.popupContent) {
        				popupContent += feature.properties.popupContent;
        			}

        			layer.bindPopup(popupContent);
        		}

        		L.geoJson([ campus], {

        			style: function (feature) {
        				return feature.properties && feature.properties.style;
        			},

        			onEachFeature: onEachFeature,

        			pointToLayer: function (feature, latlng) {
        				return L.circleMarker(latlng, {
        					radius: 8,
        					fillColor: "#ff7800",
        					color: "#000",
        					weight: 1,
        					opacity: 1,
        					fillOpacity: 0.8
        				});
        			}
        		}).addTo(map);

            map.setView(new L.LatLng(48.85, 2.4), 11);
            map.addLayer(osm);
        }catch(e) {
            console.log("BOOM " +e);
        }