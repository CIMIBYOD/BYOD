var ReportPanel = React.createClass({displayName: "ReportPanel",

 getInitialState: function() {

 //panel definition 
 var reports = [

 {icon:"icon/riot.png", label:"riot",id:"riot"},
 {icon:"icon/armed-group.png", label:"militia",id:"militia"},
 {icon:"icon/bomb.png", label:"bomb",id:"bomb"},
 {icon:"icon/death.png", label:"dead",id:"dead"},
 {icon:"icon/injured.png", label:"injured",id:"injured"},
 {icon:"icon/tank.png", label:"vehicle",id:"vehicle"},
 {icon:"icon/kidnap.png", label:"kinapping",id:"kinapping"},
 {icon:"icon/other.png", label:"report",id:"report"}
 ];
 

 var  data={compID:"report-panel",reports:reports};
 return {data: data};
},

componentDidMount: function() {
  var self  = this;
     //fade in
     $("#"+this.state.data.compID ).toggle( "fade" );

     //alert panel actions
     $(".c-alert-panel-list button").click(function(e){
      self.getLocation();
      var that = this;
      setTimeout(function () {
       $(that.element).blur();
     },500);

    });
   },
   componentWillUnmount : function() {
     //fade out
     $("#"+this.state.data.compID ).toggle( "fade",null,100 );
   },
   getLocation: function(){
    var success = function (position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
      _log("Latitude: " +latitude +  "Longitude: " + longitude);
    };


    var error = function(reason) {
      _log("ERROR : Unable to retrieve your location: "+reason);
    };


    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(success, error);
   } else {
     _log("ERROR : GeoLocation not available !!" );

   }


 },
 render: function() {
   _log("rendering ReportPanel ..." );

     //define position againts 'open panel button'
     var position = $("#report-btn").offset();
     var buttonTop = position.top;
     var buttonLeft = position.left;
     var buttonWidth = $("#report-btn").outerWidth();
     var panelHeight = 256;
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
       React.createElement("button", {id: report.id, type: "button", className: "btn btn-primary"}, React.createElement("img", {src: report.icon}), React.createElement("span", {className: "glyphicon-class"}, report.label))
       );
    });
    return (
      React.createElement("div", {id: "report-panel", className: "c-alert-panel-list c-alert-floating-panel", style: startStyle}, 
      reports
      )
      );
  }
});

