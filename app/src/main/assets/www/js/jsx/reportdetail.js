var ReportDetail = React.createClass({
 /* ReactJS lifeCycle
*
*/
componentDidMount: function() {
     var loadFileBtn = document.querySelector('.loadFileBtn');
    var fileInputField = document.querySelector('.hiddenFileInput');
    var img = document.querySelector('img');

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
      left:"30"+"px"
     };
       return (
          <div id="detail-panel" className="panel panel-primary"  style={startStyle}>
          <div className="panel-heading">Report details</div>
             <div className="panel-body">
             <textarea>here...</textarea>
             <img src="" />
             <input type="file" className="hiddenFileInput"/>
             <button className="loadFileBtn">Load File</button>
             </div>
          </div>
      );
  }
});



