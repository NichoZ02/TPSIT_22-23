var http = require('http')
var miaUtils = require('./utils')
var url = require('url');
var querystring = require('querystring');
var port = 8000;

const server = http.createServer((req,res)=>{
  
  var params = querystring.parse(url.parse(req.url).query);
  var page = url.parse(req.url).pathname;
  res.writeHead(200, {"Content-Type": "text/plain"});
  
  if(page == "/somma")
    {
      var somma = miaUtils.somma(params['num1'], params['num2'])
      res.write(somma);
    }
  else if(page == "/paridis")
    {
      res.write(miaUtils.paridis());
    }
  else
    {
      res.write("Il server è partito!");
    }
  res.end();
})

server.listen(port,()=>{
  console.log(`server is running at http://${port}`);
})
