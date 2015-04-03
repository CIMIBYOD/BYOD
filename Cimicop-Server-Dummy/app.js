var restify = require('restify');


function respond(req, res, next) {
  res.send("hello I'm CIMICOP");
  next();
}

server = restify.createServer({
  name: 'cimicop dummy',
  version: '0.1.0'
});

server.use(restify.CORS());
server.use(restify.fullResponse());
server.use(restify.bodyParser({ mapParams: false }));


server.get('/cimicop/situation/tocivilian', respond);

//Content-Type: application/json
server.post('/cimicop/situation/tocivilian', function create(req, res, next) {

 
  //check content Type
  var report="";
  var valid = true;
  try{
    if(!req.is('application/json')){
      valid = false;
      report+="- content type is not application/json  but "+req.header('content-type')+"  || ";
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

var reported = req.body;

/* Disabled, no ID to send 
if(typeof(reported.id) == "undefined"){
  valid = false;
  report+="- report.id is mandatory " +" || ";
}else{
  if(reported.id != "new"){
    valid = false;
    report+="- report.id should be 'new' but is " +reported.id +" || ";
  }
}*/

if(typeof(reported.type) == "undefined"){
  valid = false;
  report+="- report.type is mandatory " +" || ";
}

if(typeof(reported.datetime) == "undefined"){
  valid = false;
  report+="- report.datetime is mandatory " +" || ";
}

if( reported.type != "event"){
  valid = false;
  report+="- (report.type should be an 'event' but is " +reported.type +" || ";
}


if(typeof(reported.subtype) == "undefined"){
  valid = false;
  report+="- report.subtype is mandatory "  +" || ";
}else{

  if( reported.subtype != "armed-group"
   && reported.subtype != "bomb"
   && reported.subtype != "dead"
   && reported.subtype != "injured"
   && reported.subtype != "militia"
   && reported.subtype != "kidnap"
   && reported.subtype != "other" 
   && reported.subtype != "riot" 
   && reported.subtype != "tank" 
   ){
    valid = false;
  report+="- report.subtype is unknown " +reported.subtype +" || ";
}
}


if(typeof(reported.name) == "undefined"){
  valid = false;
  report+="- report.name is mandatory " +" || ";
}


if(typeof(reported.description) == "undefined"){
  valid = false;
  report+="- report.description is mandatory "  +" || ";
}


if(typeof(reported.shape) == "undefined"){
  valid = false;
  report+="- report.shape is mandatory " +" || ";
}else{

  if(reported.shape.type != "ponctual"){
    valid = false;
    report+="- (report.shape.type should be a ponctual but is " +reported.shape.type +" || ";
  }


 // var coords = JSON.parse(reported.shape.coords);
 var coords = reported.shape.coords;

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
  console.log("ERROR : report parsing failed : "+ e +" details :" +report);
  valid = false;
}

if(valid){
   console.log("SUCCESS");
  res.send(200,req.body);  
}else{
  console.log("ERROR : " +report);
  res.send(500,report);  
}
});

server.listen(90, function() {
  console.log('%s listening at %s', server.name, server.url);
});