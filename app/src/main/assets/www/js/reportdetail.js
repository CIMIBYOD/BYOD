var ReportDetail = React.createClass({displayName: "ReportDetail",
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
             React.createElement("textarea", null, "here...")
    
             )
          )
      );
  }
});
