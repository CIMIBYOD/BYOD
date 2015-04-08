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
 
       //fade in
       $("#"+this.state.data.compID ).toggle( "fade" );

       //alert panel actions (open report details view)
       var that = this;
       $(".c-report-panel-list button").click(function(e){
        var data = {reportType: $(this).attr("id")};
        React.render(
          <ReportDetail data={data} />,
         document.getElementById('report-details-placeholder')
         );
        
        $("#"+that.state.data.compID ).toggle( "fade");

       //remove me
       setTimeout(function () {
         window.app.view.visible = false; 
         React.unmountComponentAtNode(document.getElementById('report-panel-placeholder'));
       },500);

     });
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

