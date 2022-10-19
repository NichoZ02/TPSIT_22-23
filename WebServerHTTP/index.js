var http = require('http')
var miaUtils = require('./utils')
var url = require('url');
var querystring = require('querystring');
var port = 8000;

const server = http.createServer((req,res)=>{
  
  var params = querystring.parse(url.parse(req.url).query);
  var page = url.parse(req.url).pathname;
  res.writeHead(200, {"Content-Type": "text/plain"});
  
  if(page == "/primi")
    {
      res.write(miaUtils.primi());
    }
  else if(page == "/pari")
    {
      res.write(miaUtils.pari());
    }
  else if(page == "/dispari")
    {
      res.write(miaUtils.dispari());
    }
  else if(page == "/saluta")
    {
      res.write(miaUtils.saluta(params['nick']));
    }
  else if(page == "/stampasufile")
    {
      res.write(miaUtils.stampasufile(params['string'], params['nvolte']));
    }
  else
    {
      res.write("I'm running as a server!!!");
    }
  res.end();
})

server.listen(port,()=>{
  console.log(`server is running at http://${port}`);
})