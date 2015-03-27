var restify = require('restify');


function respond(req, res, next) {
  res.send("hello I'm CIMICOP");
  next();
}

server = restify.createServer({
  name: 'cimicop dummy',
  version: '0.1.0'
});

server.use(restify.bodyParser({ mapParams: false }));


server.get('/cimicop/situation/tocivilian', respond);

//Content-Type: application/json
server.post('/cimicop/situation/tocivilian', function create(req, res, next) {

  console.log("header is "+req.header('content-type'));

  //check content Type
  var report="";
  var valid = true;
  try{
    if(!req.is('application/json')){
      valid = false;
      report+="- content type is not application/json "+" || ";
    }

//check DTO
/* Valid DTO Sample
{
  "id":"new",
  "type": "event",
    "subtype": "bomb",
  "name":"marker-02",
    "description":"a desc",
  "shape":{
  "type" : "ponctual",
  "coords":"[{\"lat\":\"48.85\",\"lon\":\"2.5\"}]"
  }
}

*/
var report = req.body;

if(typeof(report.id) == "undefined"){
  valid = false;
  report+="- report.id is mandatory " +" || ";
}else{
  if(report.id != "new"){
    valid = false;
    report+="- report.id should be 'new' but is " +report.id +" || ";
  }
}

if(typeof(report.type) == "undefined"){
  valid = false;
  report+="- report.type is mandatory " +" || ";
}

if( report.type != "event"){
  valid = false;
  report+="- (report.type should be an 'event' but is " +report.type +" || ";
}


if(typeof(report.subtype) == "undefined"){
  valid = false;
  report+="- report.subtype is mandatory "  +" || ";
}else{

  if( report.subtype != "armed-group"
   && report.subtype != "bomb"
   && report.subtype != "death"
   && report.subtype != "injured"
   && report.subtype != "jeep"
   && report.subtype != "kidnap"
   && report.subtype != "other" 
   && report.subtype != "riot" 
   && report.subtype != "tank" 
   ){
    valid = false;
  report+="- report.subtype is unknown " +report.subtype +" || ";
}
}



if(typeof(report.name) == "undefined"){
  valid = false;
  report+="- report.name is mandatory " +" || ";
}

if(typeof(report.description) == "undefined"){
  valid = false;
  report+="- report.description is mandatory "  +" || ";
}

if(typeof(report.shape) == "undefined"){
  valid = false;
  report+="- report.shape is mandatory " +" || ";
}else{

  if(report.shape.type != "ponctual"){
    valid = false;
    report+="- (report.shape.type should be a ponctual but is " +report.shape.type +" || ";
  }
  var coords = JSON.parse(report.shape.coords);

  if(coords.length != 1){
    valid = false;
    report+="- (report.shape.coords should be one and only one point "+" || ";
  }else{

    if(typeof(coords[0].lat) == "undefined"){
      valid = false;
      report+="- (report.shape.coords should have latitude "+" || ";
    }

    if(typeof(coords[0].lon) == "undefined"){
      valid = false;
      report+="- (report.shape.coords should have longitude "+" || ";
    }
  }
}

}catch(e){
  valid = false;
  report+="BOOM :  "+e;

}
if(valid){
  res.send(200,req.body);  
}else{
  res.send(500,report+"    "+req.body);  
}
});


server.listen(90, function() {
  console.log('%s listening at %s', server.name, server.url);
});