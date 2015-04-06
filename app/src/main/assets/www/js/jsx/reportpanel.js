var ReportPanel = React.createClass({

 getInitialState: function() {

 //panel definition 
 var reports = [

 {icon:"icon/riot.png", label:"riot",id:"riot"},
 {icon:"icon/armed-group.png", label:"militia",id:"militia"},
 {icon:"icon/bomb.png", label:"bomb",id:"bomb"},
 {icon:"icon/death.png", label:"dead",id:"dead"},
 {icon:"icon/injured.png", label:"injured",id:"injured"},
 {icon:"icon/kidnap.png", label:"kinapping",id:"kidnap"},
 {icon:"icon/tank.png", label:"vehicle",id:"tank"},
 {icon:"icon/aircraft.png", label:"aircraft",id:"aircraft"},
 {icon:"icon/helico.png", label:"helicopter",id:"helico"},
  {icon:"icon/other.png", label:"report",id:"other"},
 ];


 

 var  data={compID:"report-panel",reports:reports};
 return {data: data};
},
/* ReactJS lifeCycle
*
*/
componentDidMount: function() {
  var self  = this;
     //fade in
     $("#"+this.state.data.compID ).toggle( "fade" );

     //alert panel actions
     $(".c-alert-panel-list button").click(function(e){
      var reportType = $(this).attr("id");
      self.sendReport(reportType);
      var that = this;
      setTimeout(function () {
        $(that.element).removeClass("active");
       $(that.element).blur();
     },500);

    });
   },
   /* ReactJS lifeCycle
*
*/
componentWillUnmount : function() {
     //fade out
     $("#"+this.state.data.compID ).toggle( "fade",null,100 );
   },
   /*
   * send Report
   *  report are then sent to webC2
   * @param type of report, (bomb,kidnap ...)
   * @param lat latitude
   * @param lon longitude
   * @param data data added to report (comment, picture ..)
   */
   sendReport: function(type,data){

    //report 
    var report =  {
      type: "event",
      subtype: type,
      datetime:new Date().getTime(),
      name:"todo",
      description: "todo",
      shape:{
        type : "ponctual",
        coords:[{lat:"",lon:""}]
      }
    }


// geolocation callback
var geoSuccess = function (position) {

  var latitude  = position.coords.latitude;
  var longitude = position.coords.longitude;
  
  report.shape.coords=[{lat:latitude,lon:longitude}];

  _log(JSON.stringify(report));

  $.ajax({
    url: 'http://localhost:90/cimicop/situation/tocivilian',
    type: 'POST',
    data: JSON.stringify(report),
    contentType: 'application/json',
    dataType: 'json',
    success: function(msg) {
       _log("report sending success");
    }
  });

}
var geoError = function(reason) {
  _log("ERROR : Unable to retrieve your location: "+reason);
};

// geolocation MUST be available for report
if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
} else {
 _log("ERROR : GeoLocation not available !!" );

}

},

     /* ReactJS render
   *
   */
   render: function() {
     _log("rendering ReportPanel ..." );

     //define position againts 'open panel button'
     var position = $("#report-btn").offset();
     var buttonTop = position.top;
     var buttonLeft = position.left;
     var buttonWidth = $("#report-btn").outerWidth();
     var panelHeight = 320;
     var panelWidth = 170;
  

     var panelTop = buttonTop - 10 - panelHeight;
     var panelLeft = buttonLeft -  (panelWidth - buttonWidth);


     var startStyle = { //panel is invisible when created
      display: 'none',
      position: 'fixed',
      top: panelTop.toString()+"px",
      left:panelLeft.toString()+"px"
    };
    var reports = this.state.data.reports.map(function (report) {
      return (
       <button id={report.id} type="button" className="btn btn-primary"><img  src={report.icon}></img><span className="glyphicon-class">{report.label}</span></button>
       );
    });
    return (
      <div id="report-panel" className="c-report-panel-list c-report-floating-panel" style={startStyle}>
      {reports}
      </div>
      );
  }
});

