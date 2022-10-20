const {readFile, writeFile,appendFile} = require('fs');

function somma(num1, num2)
{
  somma = parseInt(num1) + parseInt(num2);
  str = '';
  str = str + num1 + ' + ' + num2 + ' = ' + somma;
  writeFile('./somma.txt', str, (error)=>
    {
      if (error)
        { 
          console.log(error);
          return
        }
    })
  return str;
}

function paridis(1, 99)
{
  str = '';
  numcas = Math.floor(Math.random()*(99)+1);
  if (numcas % 2 == 0)
  {
    str = str + 'Il numero ' + numcas + ' è pari'
  }
  else
  {
    str = str + 'Il numero ' + numcas + ' è dispari'
  }
  writeFile('./paridis.txt', str, (error)=>
    {
      if (error)
        { 
          console.log(error);
          return
        }
    })
  return str;
}

module.exports=
{
  somma: somma,
  paridis: paridis
}