var xmlhttp;

function showref(str)
{
xmlhttp=GetXmlHttpObject();
if (xmlhttp==null)
  {
  alert ("Browser does not support HTTP Request");
  return;
  }
var url="getref.php";
url=url+"?q="+str;
url=url+"&sid="+Math.random();
xmlhttp.onreadystatechange=stateChanged;
xmlhttp.open("GET",url,true);
xmlhttp.send(null);


}

function stateChanged()
{
if (xmlhttp.readyState==4)
{
	
/*document.getElementById("txtHint").innerHTML=xmlhttp.responseText;*/


return Tip(xmlhttp.responseText, PADDING, 5, TITLE, 'Complete Reference',TITLEBGCOLOR,'#999999', STICKY, 1,CLICKSTICKY, true, CLICKCLOSE, true, CLOSEBTN, true, BGCOLOR, '#F0F0F0',BORDERCOLOR,'#DBDCDC', FONTFACE, 'Arial, Helvetica, sans-serif', FONTSIZE, '12px' );

}
if (xmlhttp.readyState!=4)
{
	
/*document.getElementById("txtHint").innerHTML=xmlhttp.responseText;*/


return Tip('Loading Complete Reference', PADDING, 5, BGCOLOR, '#F0F0F0',BORDERCOLOR,'#DBDCDC', FONTFACE, 'Arial, Helvetica, sans-serif', FONTSIZE, '12px' );

}

}


function GetXmlHttpObject()
{
if (window.XMLHttpRequest)
  {
  // code for IE7+, Firefox, Chrome, Opera, Safari
  return new XMLHttpRequest();
  }
if (window.ActiveXObject)
  {
  // code for IE6, IE5
  return new ActiveXObject("Microsoft.XMLHTTP");
  }
return null;
}