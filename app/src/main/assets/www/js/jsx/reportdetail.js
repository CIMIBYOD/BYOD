var ReportDetail = React.createClass({
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
    
             </div>
          </div>
      );
  }
});
