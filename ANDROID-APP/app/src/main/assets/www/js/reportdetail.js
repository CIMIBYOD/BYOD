var ReportDetail = React.createClass({displayName: "ReportDetail",
 /* ReactJS lifeCycle
*
*/
componentDidMount: function() {


    //fade in
    $("#detail-panel" ).toggle( "fade" );


    var loadFileBtn = document.querySelector('#take-a-picture');
    var fileInputField = document.querySelector('.c-report-detail-hiddenFileInput');
    var picture = document.querySelector('.c-picture');
    var inspectPicture = document.querySelector('.c-inspect-picture');


    loadFileBtn.addEventListener('click', function() {
      fileInputField.click();
    }.bind(this));

    fileInputField.addEventListener('change', function(evt) {
      var reader = new FileReader();
      reader.onload = function (evt) {
        picture.src = evt.target.result;
        $(picture).show();
      };

      reader.readAsDataURL(evt.target.files[0]);
    });

    var that = this;

    $("#send-report").click(function(){
      that.sendReport();
    });

    $("#back-to-list").click(function(){

    //remove me
    $("#detail-panel" ).toggle( "fade",null,100);
    setTimeout(function () {
     React.unmountComponentAtNode(document.getElementById('report-details-placeholder'));
   },100);

    //simulate click on report-panel button
    $("#report-btn").trigger( "click" );

  });



   //initialize picture thumbnail
   $(picture).hide();
   $(picture).outerWidth($("#take-a-picture").outerWidth());
   $(picture).outerHeight($("#take-a-picture").outerHeight());
 },
/*
   * send Report
   *  report are then sent to webC2
   * @param type of report, (bomb,kidnap ...)
   * @param lat latitude
   * @param lon longitude
   * @param data data added to report (comment, picture ..)
   */
   sendReport: function(data){



    var subtype = this.props.data.reportType;
    var type = "";
    _log("building report of subtype : "+subtype);

    if(subtype == "bomb" ||
      subtype == "kidnap" ||
      subtype == "riot" ||
      subtype == "armed-group" ||
      subtype == "death" ||
      subtype == "injured" ||
      subtype == "other" 
      ){
     type =  "event";
 }else{
  type =  "observation";
}

//for name
var names={};
names["bomb"]="bomb";
names["kidnap"]="kidnapping";
names["riot"]="riot";
names["armed-group"]="armed group";
names["death"]="dead";
names["injured"]="injured";
names["other"]="report";
names["tank"]="armoured vehicle";
names["aircraft"]="aircraft";
names["helico"]="helicopter";

var name = ""
try{
name = names[subtype];
}catch(e){}


var description = "none"
if($("#report-msg").val() != ""){
  description = $("#report-msg").val();
}

var picture = "none"
if($(".c-picture").attr("src") != ""){
  picture = $(".c-picture").attr("src");
}


    //report 
    var report =  {
      type: type,
      subtype: subtype,
      datetime:new Date().getTime(),
      name:name,
      description: description,
      picture:picture,
      shape:{
        type : "ponctual",
        coords:[{lat:"",lon:""}]
      }
    }

    var that = this;
// geolocation callback
var geoSuccess = function (position) {

  var latitude  = position.coords.latitude;
  var longitude = position.coords.longitude;
  
  report.shape.coords=[{lat:latitude,lon:longitude}];


  //setting report's envelop
  report={report:report};

  _log("sending report :\n"+JSON.stringify(report)+"\nto URL " +that.props.data.reportURL);

try{
 that.postReport(report);
}catch(e){
  _log("ERROR :Unable to send Report with exception:"+e);

}

 //remove me
 $("#detail-panel" ).toggle( "fade");
 setTimeout(function () {
   React.unmountComponentAtNode(document.getElementById('report-details-placeholder'));
 },500);


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
/* post report through Java API
 *
 */
 postReport : function(report){
   if(typeof(JSBridge) === "undefined"){
      //in browser
        $.ajax({
      url: that.props.data.reportURL,
      type: 'POST',
      data: JSON.stringify(report),
      contentType: 'application/json',
      dataType: 'json',
      success: function(msg) {
         _log("report sending success");
      }
  });
    }else{
      //in Android
      JSBridge.sendReport(report);
    }

  }
  ,
 /* ReactJS render
 *
 */
 render: function() {
   _log("rendering ReportDetail ..." );


   return (

    React.createElement("div", {id: "detail-panel", className: "panel panel-primary detail-panel"}, 
    React.createElement("div", {className: "panel-heading"}, "Report details"), 
    React.createElement("div", {className: "panel-body"}, 
    React.createElement("input", {id: "hiddenFileInput", type: "file", className: "c-report-detail-hiddenFileInput"}), 
    React.createElement("div", {className: "report-command"}, 
    React.createElement("button", {id: "back-to-list", type: "button", className: "btn btn-primary btn-sm"}, React.createElement("span", {className: "glyphicon glyphicon-arrow-left"})), 
    React.createElement("button", {id: "send-report", type: "button", className: "btn btn-primary btn-sm"}, React.createElement("span", {className: "glyphicon glyphicon-send"})), 
    React.createElement("button", {id: "take-a-picture", type: "button", className: "btn btn-primary btn-sm"}, React.createElement("span", {className: "glyphicon glyphicon-camera"})), 
    React.createElement("img", {src: "", className: "c-picture img-thumbnail"})
    ), 

    React.createElement("textarea", {className: "report-body", id: "report-msg", placeholder: "add your comments here..."}

    )
    )
    )
    );
 }
});
