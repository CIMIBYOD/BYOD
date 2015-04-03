/*************************************/
/********   Configuration    ********/
/**************************************/
var config={
  debug:true,
  //which src to choose for map server (see below)
  mapSrc:"france",
   //which report url to choose to create reports (see below)
  reportUrl:"demo",
  map :{
     france:{
      location: new L.LatLng(48.85, 2.4),
      zoomLevel : 10,
       },
       //untiled afghanistan map
  	   afgha:{
  		   location: new L.LatLng(34.59, 69.8),
  		   mapUrl:'http://192.168.1.130/arcgis/rest/services/SWContest/Afghanistan/MapServer',
  		   zoomLevel : 12,
  	   },
        //tiled afghanistan map
	   afghaTiled:{
		   location: new L.LatLng(34.59, 69.8),
		   mapUrl:'http://192.168.246.20/arcgis/services/Contestreduit/MapServer/WMSServer',
		   layers:'0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33',
		   zoomLevel : 12,
	   },
  },
  alertPanel:{
     reportUrl:{
      test:'http://localhost:90/cimicop/situation/tocivilian',
      demo:'http://192.168.1.100:8585/TOMSDataService.svc/bso/cimicop/report/fromcivilian'
     }
  }

}