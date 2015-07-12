/* This file is used for adding javascript/jquery util functions which can be used for various purposes across sites 
 * @Date Created: /09/06/2012
 */

/* itc_tracking function is used to track itc value in omniture.
 * @params: pass the anchor element and get the name attribute where the itc value has been set. 
 * @result: tracking the itc value in v4 of omniture.
 */ 
function itc_tracking (element, event)
{
	var itc_code = element.attr('name');
	var classname = element.attr('class');
	
	if(classname != null && classname != "undefined" && classname.indexOf("contentgating") !== -1) {
		event.preventDefault();
	}
	if (itc_code != null && itc_code !=''){
		var itc_link = element.attr('href');		
		event.preventDefault();		
		var s=s_gi('cmpglobalvista'); 
	   	s.eVar4= itc_code;
	 	s.tl(element,'o','Internal Tracking Code');
		if(classname == null || classname == "undefined" || classname.indexOf("contentgating") == -1) {
			setTimeout(function(){
				//if the link contains target attribute, then page should open based on the target value
				var target = element.attr('target');
				if (target != null && target != '')
				{
					 window.open(itc_link, target);				 	
				}
				else 
				{			 	
					window.location = itc_link;
				}
			},800);	
		}
	}
}