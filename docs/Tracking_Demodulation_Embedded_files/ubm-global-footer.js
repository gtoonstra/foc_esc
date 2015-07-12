// JavaScript Document

function getURLVar(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

var color = getURLVar('color');
var name = getURLVar('email');

/*
var url_string = String(document.location);
	var url_index = url_string.indexOf("?email=");
if (url_index>=0) {  

		url_string = url_string.split('?');		
		url_string = url_string[1].split('=');						
		//split if there is a second parameter of location
		if (url_string[2].toString() != null || "") {
		    color = url_string[2].toString();
		}
		url_string = url_string[1].split('&');		
		name = url_string[0].toString();			
	}
*/
	if ( color == "grey") {
		document.getElementById('footerblack').id = 'footergrey';
		document.getElementById("UBM_global_footer_img").src="http://twimgs.com/informationweek/footernav/oct2012/ubm_tech_logo_footer_grey88x111.jpg";
		document.body.style.background = "#E5E5E7";


	}
document.getElementById("feedback_email").href = name; 