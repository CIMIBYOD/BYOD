var ReportDetail = React.createClass({displayName: "ReportDetail",
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
          React.createElement("div", {id: "detail-panel", className: "panel panel-primary", style: startStyle}, 
          React.createElement("div", {className: "panel-heading"}, "Report details"), 
             React.createElement("div", {className: "panel-body"}, 
             React.createElement("textarea", null, "here..."), 
             React.createElement("img", {src: ""}), 
             React.createElement("input", {type: "file", className: "hiddenFileInput"}), 
             React.createElement("button", {className: "loadFileBtn"}, "Load File")
             )
          )
      );
  }
});



