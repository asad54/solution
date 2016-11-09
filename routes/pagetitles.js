var request = require('request');
var cheerio = require("cheerio");
exports.pagetitles=function (add,callback) {
var titleArray=[];
	if (add instanceof Array) 
	{
	    	console.log('Array')
	    	for ( var i in add)
	    	{
	    		var addr=helper(add[i]);
	    		request(addr, function (error, response, body) {
			  if (!error && response.statusCode == 200)
			   {
			   	
			   	console.log(response.statusCode)

			    
			    // Show the HTML for the Google homepage. 
							    var html = body;
							var $ = cheerio.load(html);
							var list = $("title");

							console.log(list.html());
							titleArray.push(list.html());
			   }
			   if(typeof response === "undefined" || typeof body === "undefined")
				   	titleArray.push('no response')

			   callback(titleArray)
			   
			   })

	    	}
	} 
	else 
	{
			console.log('not arry')

			add=helper(add);
			console.log(add)
				request(add, function (error, response, body) {
					
				   
				  	//console.log(response_.statusCode)
				   
				  if (!error && response.statusCode == 200)
				   {
				   	
				   	
								    var html = body;
								var $ = cheerio.load(html);
								var list = $("title");

								console.log(list.html());
								titleArray.push(list.html())
				   }
				   if(typeof response === "undefined" || typeof body === "undefined")
				   	titleArray.push('no response')

				   	callback(titleArray);

				   
				})


    }
}

function helper(string) {
	console.log('heheheh');
	console.log(string);

if (string.substring(0, 7) != "http://")
    string = "http://" + string;
	return string;

}