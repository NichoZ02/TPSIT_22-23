var http = require('http')
var miaUtils = require('./utils')
var url = require('url');
var querystring = require('querystring');
var port = 8000;

const server = http.createServer((req,res)=>
{
  var params = querystring.parse(url.parse(req.url).query);
  var page = url.parse(req.url).pathname;
  res.writeHead(200, {"Content-Type": "text/plain"});

  if(page == "/stampa")
  {
    res.write(miaUtils.stampaStr(params['nick']));

  }
  else
  {
    res.write("Il server è partito!");

  }
  res.end();
})

server.listen(port,()=>
{
  console.log(`Il server è partito al http://${port}`);
})