const {readFile, writeFile,appendFile} = require('fs');

function stampaStr(str) 
{
  res = '';
  for (i = 1; i <= 100; i++) 
  {
    res = res + str + '\n'
    
  }
  
  return res;
}

module.exports = { stampaStr }