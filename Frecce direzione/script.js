function counter(c) 
{
    var v = parseInt(document.getElementById('verticale').innerHTML);
    var o = parseInt(document.getElementById('orizzontale').innerHTML);

    switch (c) 
    {
        case "piuVer":
        document.getElementById('verticale').innerHTML = v + 1;
        break;

        case "piuOrr":
        document.getElementById('orizzontale').innerHTML = o + 1;
        break;

        case "menoVer":
        document.getElementById('verticale').innerHTML = v - 1;
        break;

        case "menoOrr":
        document.getElementById('orizzontale').innerHTML = o - 1;
        break;

        default:
        break;
    }
}
