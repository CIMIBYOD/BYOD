var restify = require('restify');



function respond(req, res, next) {
  res.send("hello I'm CIMICOP");
  next();
}

var server = restify.createServer();
server.use(restify.bodyParser({ mapParams: false }));


server.get('/cimicop/situation/tocivilian', respond);

//Content-Type: application/json
server.post('/cimicop/situation/tocivilian', function create(req, res, next) {

  console.log("header is "+req.header('content-type'));

	//check req.is('application/json');
  console.log("body is "+req.body);      // your JSON
  for(var i in req.body){
  	console.log("- "+i);
  }
  res.send(req.body);    // echo the result back
 //   res.send(200);
 });


server.listen(90, function() {
  console.log('%s listening at %s', server.name, server.url);
});