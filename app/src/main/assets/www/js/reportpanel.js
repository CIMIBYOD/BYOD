var ReportPanel = React.createClass({
  render: function() {
    var reports = this.props.data.map(function (report) {
      return (
         <button id={report.id} type="button" className="btn btn-primary"><img  src={report.icon}></img><span className="glyphicon-class">{report.label}</span></button>
      );
    });
    return (
      <div className="c-alert-panel-list c-alert-floating-panel">
        {reports}
      </div>
    );
  }
});
/*

var div = L.DomUtil.create('div',"c-alert-panel-width");

       //set ID and hide it
    $(div).attr("id","action").hide();

    // build alert panel buttons
	var shadowHtml ='<div class="c-alert-panel-list">';

   for (var i = 0; i < 8; i++) {
    var icon,text,id;
    switch (i){
      case 0: icon="icon/riot.png"; text="riot";id="militia";
      break;
      case 1: icon="icon/armed-group.png"; text="militia";id="militia";
      break;
       case 2: icon="icon/bomb.png"; text="bomb";id="bomb";
      break;
      case 3: icon="icon/death.png"; text="dead";id="dead";
      break;
      case 4: icon="icon/injured.png"; text="injured";id="injured";
      break;
      case 5: icon="icon/tank.png";  text="vehicle";id="vehicle";
      break;
       case 6: icon="icon/kidnap.png";  text="kinapping";id="kinapping";
      break;
       case 7: icon="icon/other.png";  text="report";id="report";
      break;

    }
        shadowHtml +=
        '<button id="'+ id +'" type="button" class="btn btn-primary"><img  src="'+icon+'"></img><span class="glyphicon-class">'+text+'</span></button>';
    }
	shadowHtml +='</ul>';	shadowHtml +='</div>';
	div.innerHTML = shadowHtml;


*/