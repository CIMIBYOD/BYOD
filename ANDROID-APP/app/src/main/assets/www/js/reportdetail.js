var ReportDetail = React.createClass({displayName: "ReportDetail",
 /* ReactJS lifeCycle
*
*/
componentDidMount: function() {
 var loadFileBtn = document.querySelector('#take-a-picture');
 var fileInputField = document.querySelector('.c-report-detail-hiddenFileInput');
 var img = document.querySelector('.c-picture');

 console.log("%% loadFileBtn elem = "+loadFileBtn);
 console.log("%% fileInputField elem = "+fileInputField);
 console.log("%% img elem = "+img);


 loadFileBtn.addEventListener('click', function() {
  console.log("%% loadFileBtn.addEventListener");
  fileInputField.click();
}.bind(this));

 fileInputField.addEventListener('change', function(evt) {
  console.log('%% Change', evt);
  var reader = new FileReader();
  reader.onload = function (evt) {
    img.src = evt.target.result;
      console.log("%% img.src =["+img.src+"]");

  };

  reader.readAsDataURL(evt.target.files[0]);
});
},
   /* ReactJS render
   *
   */
   render: function() {
     _log("rendering ReportDetail ..." );

     var startStyle = { //panel is invisible when created
      //display: 'none',
      position: 'fixed',
      top: "20"+"px",
      left:"50"+"px",
     width:'80%',
      height:'80%',
     marginLeft: 'auto',
     marginRight: 'auto'
    };
    return (
      React.createElement("div", {id: "detail-panel", className: "panel panel-primary", style: startStyle}, 
      React.createElement("div", {className: "panel-heading"}, "Report details"), 
      React.createElement("div", {className: "panel-body"}, 
      React.createElement("input", {id: "hiddenFileInput", type: "file", className: "c-report-detail-hiddenFileInput"}), 
      React.createElement("div", {className: "report-command"}, 
        React.createElement("button", {id: "back-to-list", type: "button", className: "btn btn-primary btn-sm"}, React.createElement("span", {className: "glyphicon glyphicon-arrow-left"})), 
        React.createElement("button", {id: "send-report", type: "button", className: "btn btn-primary btn-sm"}, React.createElement("span", {className: "glyphicon glyphicon-send"})), 
        React.createElement("button", {id: "take-a-picture", type: "button", className: "btn btn-primary btn-sm"}, React.createElement("span", {className: "glyphicon glyphicon-camera"}))
     ), 
     
      React.createElement("div", {contentEditable: "true", className: "report-body"}, 
       React.createElement("img", {src: "", className: "c-picture img-thumbnail"}), 
      "here..."
      )
     
      


      
      )
      )
      );
  }
});
