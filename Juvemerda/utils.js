const {readFile, writeFile,appendFile} = require('fs');

function stampaStr(str) 
{
  res = '';
  for (i = 1; i <= 100; i++) 
  {
    res = res + str + '\n'

  }

  writeFile('./stampa.txt', res, (error) =>
  {
    if(error)
    {
      console.log(error)
      return
    }
  })
  return res;
}

module.exports = { stampaStr }