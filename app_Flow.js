var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async=require("async");
var url = require('url');

var routes = require('./routes/index');

var request = require('request');
var cheerio = require("cheerio");
var users = require('./routes/users');
var async=require("async");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.get('/I/want/title', function(req, res, next) {

console.log(req.query)
var params=req.query;

var addresses=[];
var titles=[];


if(!params.address){
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<html><body><h1>Error 404: ' + req.url +' should not be empty or speeling msitake</h1></body></html>');
            //res.render('error')
            return;
        }


        async.waterfall([
          function parameters(callback) 
          {
            params=url.parse(req.url, true).query;
            console.log('peh;le')
             var add=params['address'];
  /*
  if (add instanceof Array) 
  {
    
    addresses=add;
  }
  else{
    
    addresses.push(add);

  }
  */

            
        callback(null, params);

            // body...
          },
          function makeRequest(params,callback) {
            
            console.log(params);

             if(typeof params.address ==='string'){
                    len=1;
                }
                else
                  var len=Object.keys(params.address).length;
             

          
          if(len>1)
        {
          

          params.address.forEach(function(element) {
            //for ( var i in addresses){

                        
                        console.log(element);
                        var addr=helper(element);
                        
                                request(addr, function(error, response, body) {
                                    if(error)
                                    {
                                        titles.push('error no response');
                                        if(titles.length==len)
                                               { callback(titles);}
                                            
                                    }
                                    else
                                    {
                                      
                                      console.log(titles.length==len);

                                        var $ = cheerio.load(body);
                                        var title = $("title");
                                        console.log(title.html());
                                        titles.push(title.html());
                                        

                                        if(titles.length==len)
                                            {callback(titles);}
                                    }
                                })    
             //}
                           }, this)



        }
        else
        {
          var addr=helper(params.address);
                      
                            request(addr, function(error, response, body) {
                                    if(error){
                                        titles.push('error no response');
                                        if(titles.length==len)
                                          {callback(titles);}
                                        
                                        }
                                    else{
                                        var $ = cheerio.load(body);
                                        var title = $("title");
                                        console.log(title.html());
                                        titles.push(title.html());

                                        if(titles.length==len)
                                            {callback(titles);}
                                    }
                                })  
        }

            

            // body...
          }],
          function sendResponse(titles) {
            console.log('final')
            console.log(titles)
            res.writeHeader(200, {"Content-Type": "text/html"}); 
      var str='<html><head></head><body><h1> Following are the titles of given websites: </h1>';
      for (var i in titles)
        str+='<ul><li>Title of page is '+titles[i]+'</li></ul>';
      res.write(str);
            // body...
          });


  })
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

function helper(string) {
  
if (string.substring(0, 7) != "http://")
    string = "http://" + string;
  return string;

}


module.exports = app;
