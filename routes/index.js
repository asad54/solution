var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require("cheerio");
var htmlparser = require("htmlparser2");
var getPageTitle=require('./pagetitles.js')

router.get('/I/want/title', function(req, res, next) {
var params=req.query;
	console.log(params);
	var addresses=[];
	var add=params['address']
if(!params.address){
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<html><body><h1>Error 404: ' + req.url +' should not be empty</h1></body></html>');
            //res.render('error')
            return;
        }
	
	res.writeHeader(200, {"Content-Type": "text/html"}); 
		  var str='<html><head></head><body><h1> Following are the titles of given websites: </h1>'
	
	if (add instanceof Array) 
	{
		addresses=add;
	}
	else{
		addresses.push(add);

	}



	var titleArray=[];
	if (add instanceof Array) 
	{
		res.write(str);
	    	console.log('Array')
	    	for ( var i in add)
	    	{
	    		var addr=helper(add[i]);
	    		request(addr, function (error, response, body) {
			  if (!error && response.statusCode == 200)
			   {
			   	
			   	console.log(response.statusCode)

							
							var $ = cheerio.load(body);
							var list = $("title");
							console.log(list.html());
							
							res.write('<ul><li>Title of page '+add[i]+' is :'+list.html()+'</li></ul>');
								
			   }
			   if(typeof response === "undefined" || typeof body === "undefined")
				   {	res.write('no response')}

				})

	    	}
	} 
	else 
	{
			console.log('not arry')

			add=helper(add);
		
				request(add, function (error, response, body) {
					
				  if (!error && response.statusCode == 200)
				   {
				   	
				   	
								    var html = body;
								var $ = cheerio.load(html);
								var list = $("title");

								console.log(list.html());
								titleArray.push(list.html())
								str+='<ul><li>Title of page '+add+' is :'+list.html()+'</li></ul>';
								res.write(str)
				   }
				   if(typeof response === "undefined" || typeof body === "undefined")
				   	res.write('no response');

				})


    }

	/*
	
	getPageTitle.pagetitles(add,function (arry) {
		console.log('a gya after call back')
		console.log(arry)

		  res.writeHeader(200, {"Content-Type": "text/html"}); 
		  var str='<html><head></head><body><h1> Following are the titles of given websites: </h1>'
		  
	for (var i in arry)
	str+='<ul><li>Title is :'+arry[i]+'</li></ul>';

		  res.write(str)

		 
	})
*/
    
	
  
});


function helper(string) {
	

if (string.substring(0, 7) != "http://")
    string = "http://" + string;
	return string;

}
module.exports = router;


 //res.render('test', { title: 'Express',array:arry,address:addresses  });

				

		// body... res.render('test', { title: 'Express',array:arry });