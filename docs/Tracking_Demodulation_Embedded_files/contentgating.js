<!--	 
	var redirectTo = encodeURIComponent(window.location.href);
	$.ajax({
	   type: "GET",
	   url: "/contentgating",
	   data: {"redirectTo": redirectTo},
	   success: function(data){
		   if (typeof(data) != 'undefined' && data != null && typeof(data.redirectTo) != 'undefined' && data.redirectTo != null)
			{
				window.location = data.redirectTo;
			}
	   },
	   dataType: "json",
	   async: false,
	   cache: false
	 });
-->