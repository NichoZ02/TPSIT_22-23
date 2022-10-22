const {readFile, writeFile,appendFile} = require('fs');
const date = new Date();

function somma(num1, num2)
{
  somma = parseInt(num1) + parseInt(num2);
  str = '';
  str = str + 'Il numero ' + num1 + '\n' + 'E il numero ' + num2 + '\n' + "Da' come somma " + somma;
  writeFile('./somma.txt', str, (error) =>
  {
    if (error)
    { 
      console.log(error);
      return
    }
  })
  return str;
}

function paridis()
{
  str = '';
  numcas = Math.floor(Math.random()*(99)+1);
  if (numcas % 2 == 0)
  {
    str = str + 'Il numero ' + numcas + " e' pari";

  }
  else
  {
    str = str + 'Il numero ' + numcas + " e' dispari";

  }
  writeFile('./paridis.txt', str, (error) =>
  {
    if (error)
    { 
      console.log(error);
      return
    }
  })
  return str;
}

function frase(string)
{
  str = '';
  str = str + 'Hai scritto questa frase: ' + string + '\n' + 'Nel giorno di: ' + date.toDateString() + '\n' + 'Alle ore: ' + date.toTimeString();
  writeFile('./stringa.txt', str, (error) =>
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
  paridis: paridis,
  frase: frase
}