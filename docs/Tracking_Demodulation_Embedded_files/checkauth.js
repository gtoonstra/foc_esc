$( document ).ready(function() {
	var referer 	= encodeURIComponent(document.referrer);
	var siteBasePath = window.location.protocol + '//' + window.location.hostname;
	var redirectTo 	= encodeURIComponent(siteBasePath + '/checkauthIFrame.htm');
	$.ajax({
		url: '/checkauth',
		data: {'referer': referer, 'redirectTo': redirectTo},
		success: function(data){
		   if (typeof(data) != 'undefined' && data != null && typeof(data.redirectTo) != 'undefined' && data.redirectTo != null) {
				$('body').append('<iframe style="display:none" id="checkAuthFrame" height="100" frameborder="0" src="'+data.redirectTo+'"></iframe>'); 
				$('#checkAuthFrame').load(function() {
					var cLocation = $(this).contents().find('#cLocation').html();
					//Get URL from param
					var token = $.getUrlVar(cLocation, 'token');
					if ( token !== undefined && token != '' ) {
						//If token is exist then do second checkauth call to process the token
						var welcomeUrl = encodeURIComponent(siteBasePath + '/index/welcome');
						$.ajax({
							type: "GET",
							url: "/checkauth",
							data: {'referer': referer, 'redirectTo': welcomeUrl, 'token': token},
							success: function(data){
								$.welcomeCall ( welcomeUrl );
								
								//Authenticate into Gama account for who logged in via SSO
								//$.gamaAccCall ();
							},
							dataType: 'json',
							cache: false
						});
					}
					else {
						$.welcomeCall ();
					}
				});
		   }
		   else {
				$.welcomeCall ();
			}
		},
		dataType: 'json',
		cache: false
	});
	
	$.welcomeCall = function ( welcomeUrl ) {
		var referer 	= encodeURIComponent(document.referrer);
		var redirectTo 	= encodeURIComponent(window.location.href);
		if ( typeof ( welcomeUrl ) == 'undefined' ) {
			welcomeUrl = siteBasePath + '/index/welcome';
		}
		$.ajax({
			url: decodeURIComponent(welcomeUrl),
			data: {'referer': referer, 'redirectTo': redirectTo},
			type: 'POST',
			success: function(data){
				//Update welcome bar

				$('.login-bar').html(data);
				
				//Initialize lightbox
				$('.login-bar').nextGenInit({				
					width: 780,
					siteUrlPrefix: '',
					siteRedirectPrefix: ''
				});
			},
			cache: false
		});
	};
	
	$.gamaAccCall = function ( ) {
		$.ajax({
			url: '/registration/managegamaaccount',
			success: function ( data ) {
				//If there is any error in loggin into gama account then logout from NG acc as well
				if ( data.error && data.logoutUrl ) {
					window.location = data.logoutUrl;
				}
			},
			cache: false
		});
	};
	
	$.getUrlVar = function(url, key){
		var result = new RegExp(key + "=([^&]*)", "i").exec(url);
		return result && unescape(result[1]) || "";
	};
});