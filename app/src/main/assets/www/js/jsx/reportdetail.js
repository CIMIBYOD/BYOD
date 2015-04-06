var ReportDetail = React.createClass({
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
      top: "30"+"px",
      left:"30"+"px",
     // width:'80%',
    //  height:'80%',
     //marginLeft: 'auto',
     //marginRight: 'auto'
    };
    return (
      <div id="detail-panel" className="panel panel-primary"  style={startStyle}>
      <div className="panel-heading">Report details</div>
      <div className="panel-body">
      <input  id="hiddenFileInput" type="file" className="c-report-detail-hiddenFileInput" />
      <div className="report-command" >
        <button  id="back-to-list" type="button" className="btn btn-primary btn-sm"><span className="glyphicon glyphicon-arrow-left" ></span></button>
        <button  id="send-report" type="button" className="btn btn-primary btn-sm"><span className="glyphicon glyphicon-send" ></span></button>
        <button  id="take-a-picture" type="button" className="btn btn-primary btn-sm"><span className="glyphicon glyphicon-camera" ></span></button>
     </div>
     
      <div contentEditable="true" className="report-body" >
       <img src="" className="c-picture img-thumbnail"/>
      here...
      </div>
     
      


      
      </div>
      </div>
      );
  }
});



