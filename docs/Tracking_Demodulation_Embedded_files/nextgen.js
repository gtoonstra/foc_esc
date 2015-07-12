/**
 * The NextGen singleton class to handle all communication to the server
 */
function NextGen(){
	
	this.userInfo = null;
	this.authUrl = '/auth/login';
	this.authenticateUrl = '/authenticate';
	this.extAuthUrl = '/auth/extauth';
	this.statusElementId = 'status';
	this.redirectUrl='';
	this.successCallback = null;
	this.failCallback = null;
	this.loadingIndicatorId = null;
	this.extAuthWindow = null;
	NextGen.forpass_lb = null;
	/**
	 * Hide loading indicator element if exist 
	 */
	this.hideLoadingIndicator = function(){
		if(this.loadingIndicatorId == null){
			return false;
		}
		else if($('#'+this.loadingIndicatorId).length != 0){
			$('#'+this.loadingIndicatorId).hide();
			return true;
		}
		return false;
	}

	/**
	 * Show loading indicator element if exist
	 */
	this.showLoadingIndicator = function(){
		if(this.loadingIndicatorId == null){
			return false;
		}
		else if($('#'+this.loadingIndicatorId).length != 0){
			$('#'+this.loadingIndicatorId).show();
			return true;
		}
		return false;
	}
	
	/**
	 * Set the status message to node if the dom element exist or defined
	 */
	this.setStatusMessage = function(messages){
		if(typeof(messages) === undefined || messages == null){
			return;
		}

		if(messages.constructor == Array){
			var messageHtml = '<ul class="loginMessages">';			
			for(var i = 0; i < messages.length; i++){
				messageHtml += '<li>'+messages[i]+'</li>';
			}		
			messageHtml += '</ul>';

			//Error message display div should be added above form to display in page else it will displayed in alert
			if(NextGen.instance.statusElementId !== null){
				$('#'+NextGen.instance.statusElementId).show().html(messageHtml);
			}
			else{
				// if no status element is set, call alert
				var message = '';		
				for(var i in messages)
				message += messages[i]+'\n';
				alert(message);
			}
		}
		else{
            if(NextGen.instance.statusElementId !== null){
				$('#'+NextGen.instance.statusElementId).html(messages);
            }
		}
	}	

	/**
	 * Authenticate with the server
	 */
	this.authenticate = function(email, password, rememberme){

		if(email.length <= 0 || password.length <= 0){
			NextGen.instance.setStatusMessage("<ul><li>Your Email or Password field is empty</li></ul>");
			return;
		}

		if(!this.showLoadingIndicator()){
			NextGen.instance.setStatusMessage("Authenticating with server..");
		}
		// clear the status message
		NextGen.instance.setStatusMessage('');

		// first call a request for the hash token	
		$.ajax({
			type : 'POST',
			dataType : 'json',
			url : nextGenLoginInstance.siteUrlPrefix+nextGenLoginInstance.siteRedirectPrefix+this.authUrl+'/token',
			data : {email:email},
			success : function(response){
				// successful call to get the token now handle it
				if(response.token !== undefined){
					// hash the password with provided token
					hash = hex_md5(response.token+hex_md5(password).toUpperCase()).toUpperCase();
					var currentPageUrl = $.url(window.location).param();
					isDisqus2012 = null;
					if ( currentPageUrl.Disqus2012 !== undefined && currentPageUrl.Disqus2012) {
						isDisqus2012 = true;
					}
					$.ajax({type: 'POST', dataType: 'json', url: nextGenLoginInstance.siteUrlPrefix+nextGenLoginInstance.siteRedirectPrefix+NextGen.instance.authenticateUrl,
						data:{email:email, hash:hash, rememberme:rememberme, Disqus2012:isDisqus2012},
						success: function(response2){						
							NextGen.instance.hideLoadingIndicator();

							if(response2.success == true){
								authenticateUserCheck = 'true';
								// authenticate with gateway
								if(response2.ssogateway !== undefined){
									response2.delay = 1500;
									NextGen.instance.authenticateGateway(response2.ssogateway);
								}
								
								// link external provider
								if(response2.reference !== undefined && response2.reference !== null){
                                    response2.delay = 1500;
                                    NextGen.instance.authenticateGateway(response2.reference);
								}

								// authentication successful, run callback
								if(NextGen.instance.loginCallback !== null){
									NextGen.instance.loginCallback(response2);
								}
							}
							else{
								// authentication failed, display messages
								if(response2.messages !== undefined){
									NextGen.instance.setStatusMessage(response2.messages);
								}
								else{
									NextGen.instance.setStatusMessage(new Array("Authentication failed."));
								}
								if(NextGen.instance.failCallback !== null){
									NextGen.instance.failCallback(response2.messages);
								}
							}
						}
					});
				}
				else{
					NextGen.instance.hideLoadingIndicator();
					if(response.messages !== undefined){
						NextGen.instance.setStatusMessage(response.messages);
					}
					else{
						NextGen.instance.setStatusMessage(new Array("Authentication failed."));
					}
				}
			},
			error: function(response){
				NextGen.instance.hideLoadingIndicator();
				NextGen.instance.setStatusMessage(new Array("Unable to authenticate with the server. Please try again later."));
			}
		});
	};

	/**
	 * Password Reset
	 */
	this.passwordReset = function(email){

		if(!this.showLoadingIndicator()){
			NextGen.instance.setStatusMessage("Resetting user password");
		}
		// clear the status message
		NextGen.instance.setStatusMessage('');

		if(!email){
			NextGen.instance.setStatusMessage(new Array("Please enter your email first."));
			NextGen.instance.hideLoadingIndicator();
			return;
		}

		$.ajax({
			type: 'POST',
			dataType: 'html',
			url: nextGenLoginInstance.forgotpasswordtemplate,
			data:{lookup:email},
			success: function(response) {
				NextGen.instance.hideLoadingIndicator();
				NextGen.forpass_lb.setHtml(response, nextGenLoginInstance.forgotPasswordPage);
				
				if(response == null){
					NextGen.instance.setStatusMessage(new Array("No response from server."));
					NextGen.instance.hideLoadingIndicator();
					return;
				}

				if(response.success == true){
					if(response.message){
						NextGen.instance.setStatusMessage(new Array(response.message));
					}
					else {
						NextGen.instance.setStatusMessage(new Array("Password reset request successfully sent."));
					}
				}
				else if(response.error){
					NextGen.instance.setStatusMessage(new Array(response.error));
				}
			}
		});				
	};


	/**
	 * Aunthenticate with External Authentication
	 */
	this.extAuthenticate = function(options){
		nextGenLoginInstance.provider = options.provider;
		$.ajax({
			url: nextGenLoginInstance.siteUrlPrefix+nextGenLoginInstance.siteRedirectPrefix+this.extAuthUrl+'/success',
			type: 'POST',
			headers: { "cache-control": "no-cache" },
			success: function(data){
				if(typeof(data.success) !== "undefined" && data.success == true){
					// authenticate with gateway
					if(data.gateway !== undefined){
						NextGen.instance.authenticateGateway(data.gateway);
					}
					
					var queryStringUrl = '?assetId='+options.assetId;
					if ( data.hasDownloded == true && options.redirectUrl !== "undefined" && options.redirectUrl !== "null" ) {
						// authentication successful, run callback
						if(NextGen.instance.loginCallback !== null){
							NextGen.instance.loginCallback(options);
						}
					}
					else if ( data.hasDownloded == false ) {
						//Skip supplementary page if it is digital edition page.
						if ( typeof ( registerlink ) !== "undefined" && registerlink == 'hide' ) {
							window.location = decodeURIComponent( options.redirectUrl );
						}
						queryStringUrl += '&isSupplementary=true';
						if ( options.redirectUrl !== "undefined" && options.redirectUrl !== "null" ) {
							queryStringUrl += '&successfulLoginRedirect='+options.redirectUrl;
						}
						NextGen.register(nextGenLoginInstance.registerTemplate+queryStringUrl);					
					}
					else if( isNGGatedContentPage() ) {
						window.location.reload();
					}
					else {
						//Update welcome bar
						if($('.welcome').length) {
							NextGen.instance.setWelcomeMessage();
						}				
						nextGenLoginInstance.lb.close();
					}
				}
				else if(typeof(data.error) !== "undefined" && data.error == true){
					if(typeof(data.message) !== "undefined"){
						NextGen.instance.setStatusMessage(new Array(data.message));
					}
					else{
						NextGen.instance.setStatusMessage(new Array("Unknown error."));
					}
				}
			},
			cache:false
		});		
	}
	/**
	 * Set the welcome login bar content
	 */
	this.setWelcomeMessage = function(){
		
		var postData = {'redirectTo' : window.location.href};
		var currentURL = window.location.href;
		//Update url on post for whitepaper login
		if(currentURL.match('/whitepaper') && isSaveforLater()){
			postData.updateURL = nextGenLoginInstance.saveforLater;
		}
		$.ajax({
			url: nextGenLoginInstance.welcomeCall,
			type: 'POST',
			data: postData,
	        success: function(data){									    	        	
	        	$('.welcome').html(data);
	        }
		});
	}

	/**
	 * Authenticate with NextGen Gateway using hidden iframe
	 */
	this.authenticateGateway = function(gatewayUrl)	{		
	
		//if iframe already exist remove it first
		if($('#ngLoginHiddenIframe').length != 0){
			$('#ngLoginHiddenIframe').remove();
		}
		// create a hidden iframe 
		$('body').append('<iframe id="ngLoginHiddenIframe" name="ngLoginHiddenIframe" src="'+gatewayUrl+'" style="height: 0px; width: 0px;" frameborder="0" ></iframe>');

	}
	
	// singleton instance
	if(NextGen.instance !== undefined){
		return NextGen.instance;
	}
	NextGen.instance = this;
}

/**
 * Get singleton instance
 **/
NextGen.getInstance = function(){
	if(NextGen.instance !== undefined){
		return NextGen.instance;
	}
	else{
		NextGen.instance = new NextGen();
		return NextGen.instance;
	}			
};

/**
 * Static login method to call from the login form template
 * This will be called onSubmit of login form
 */
NextGen.login = function(emailName, passwordName, remembermeName){
	var email = $.trim($('#LoginForm input[name='+emailName+']').val());
	var password = $('#LoginForm input[name='+passwordName+']').val();

	var rememberme = 'no';
	if($('#'+remembermeName).is(':checked')){
		var rememberme = 'yes';
	}
	NextGen.getInstance().authenticate(email, password, rememberme);
}

NextGen.extAuthentication = function(provider, assetId, redirectUrl){

	if(NextGen.getInstance().extAuthWindow === null || NextGen.getInstance().extAuthWindow.closed ){
		NextGen.getInstance().extAuthWindow = window.open('',"extAuthWindow","resizable=0,menubar=0,location=0,status=0,scrollbars=0,width=640,height=640");
	}
	else{
		NextGen.getInstance().extAuthWindow.focus();
		return false;
	}

	NextGen.getInstance().setStatusMessage('');
	NextGen.getInstance().showLoadingIndicator();

	NextGen.getInstance().extAuthWindow.document.write('Loading ....');

	$.ajax({
		url: nextGenLoginInstance.siteUrlPrefix+nextGenLoginInstance.siteRedirectPrefix+'/auth/extauth/auth',
		type : 'POST',
		headers : {"cache-control":"no-cache" },
		data : {provider:provider},
		success : function(data){	
			NextGen.getInstance().hideLoadingIndicator();
			if(typeof(data.error) !== "undefined" && data.error == true){
				var errorMessage = 'Unable to retrieve redirect url';
				NextGen.getInstance().setStatusMessage(new Array(errorMessage));
				NextGen.getInstance().extAuthWindow.document.write(errorMessage);
			}
			else if(typeof(data.redirect) !== "undefined"){
				var watchClose = null;

				var checkClose = function(){
					try {
						if(NextGen.getInstance().extAuthWindow.closed)
						{
							clearTimeout(watchClose);
							NextGen.getInstance().extAuthenticate({'provider':provider, 'assetId':assetId, 'redirectUrl':redirectUrl});
						}
					}catch (e){
					}
				};
				watchClose = setInterval(checkClose, 200);

				NextGen.getInstance().extAuthWindow.location = data.redirect;
			}
		},
		cache :false
	});
	return false;
};

/**
 * Static method to open a forgot password request
 */
NextGen.passwordReset = function(emailName){
	var email = $.trim($('input[name='+emailName+']').val());
	NextGen.getInstance().passwordReset(email);
}


NextGen.close = function(){
	if(nextGenLoginInstance && nextGenLoginInstance.lb){
		nextGenLoginInstance.lb.close();
		if(nextGenLoginInstance.lb.closeCallback){
			nextGenLoginInstance.lb.closeCallback();
		}
	}
}

//Load Login form
NextGen.loginForm = function(queryParem){
	var options = $.url(queryParem).param();	 
	if(nextGenLoginInstance && nextGenLoginInstance.lb){
		nextGenLoginInstance.lb.close();
		nextGenLoginInstance.login('', options);
	}
}

/* forpass_code */
NextGen.forgetpassword = function(queryParem){
	if(nextGenLoginInstance && nextGenLoginInstance.lb){
		nextGenLoginInstance.lb.close();
		nextGenLoginInstance.forgotpasswordform(queryParem);
	}
}

/**
 * Define NextGen jQuery plugin functions
 **/
var nextGenLoginInstance = null;
jQuery.fn.nextGenInit = function(options) {	
	
	ngCheckRequirements();

	var ng = NextGen.getInstance();
	ng.loadingIndicatorId = 'ngLoadingIndicator';
	this.siteUrlPrefix = '';
	if(options.siteUrlPrefix){
		this.siteUrlPrefix = options.siteUrlPrefix;
	}
	this.siteRedirectPrefix = '';
	if(options.siteRedirectPrefix){
		this.siteRedirectPrefix = options.siteRedirectPrefix;
	}
	
    this.forgotpasswordtemplate = this.siteUrlPrefix+this.siteRedirectPrefix+'/forgotpassword'; 
	this.loginTemplate = this.siteUrlPrefix+this.siteRedirectPrefix+'/login';
	this.contentGating = this.siteUrlPrefix+this.siteRedirectPrefix+'/contentgating';
	this.registerTemplate = this.siteUrlPrefix+this.siteRedirectPrefix+'/registration/index';
	this.thankyouTemplate = this.siteUrlPrefix+this.siteRedirectPrefix+'/registerthankyou';
	this.loginPage = 'Login';
	this.registrationPage = 'Registration';
	this.updateProfilePage = 'Update Profile';
	this.forgotPasswordPage = 'Forgot Password';
	this.changePasswordPage = 'Change Password';
	this.thankyouPage = 'Thank you for registering';	
	this.benefitsPage = 'Member Benefits';	
	this.width = 780;
	this.height = null;
	this.assetid = null;
	this.successlogin = this.newwindow = '';
	this.redirectUrl='';
	this.firstNamePlaceholder = "#firstName#";
	this.lastNamePlaceholder = "#lastName#";
	this.options = options;
	this.selectedAsset = null;
	this.queryParam = null;
	this.assetPreviewUrl = this.siteUrlPrefix+this.siteRedirectPrefix+'/asset/get/preview';
	this.welcomeCall = this.siteUrlPrefix+this.siteRedirectPrefix+'/index/welcome';
	this.saveforLater = '/whitepaper/saveforlater';
	this.showError = 2000;
	this.provider='';

	var bindElement = this;

	if(typeof(options) === "undefined")	{
		//option is not set
	}
	else{
		if(options.width !== undefined)
			this.width = options.width;

		if(options.height !== undefined)
			this.height = options.height;
	}

	this.lb = new TWLightBox(this.width, this.height, '');
	var lb = this.lb;
	NextGen.forpass_lb = this.lb;
	
	this.login = function(email, options){
		lb.backgroundClickable = false;
		lb.open();
		lb.showLoader();
		var pathUrl = null;
		if(options){ 
			pathUrl = options;
			bindElement.successlogin = options.successfulLoginRedirect;
			if(options.email){
				email = options.email;
			}
		}
		else if(bindElement.queryParam){
			pathUrl = bindElement.queryParam;
			bindElement.successlogin = pathUrl.split("successfulLoginRedirect=").pop();
		}
		
		$.ajax({ 
			url: bindElement.loginTemplate,
			data:  pathUrl,
			success: function(html){				
				if(html.alreadyLoggedIn){
					if(html.successfulLoginRedirect){
						bindElement.successlogin = html.successfulLoginRedirect; 
					}
					NextGen.instance.loginCallback();
				}
				lb.setHtml(html, nextGenLoginInstance.loginPage);
				if(typeof(email) != 'undefined' && email != null )
					$('#LoginForm #email').val(decodeURIComponent(email));
			},
			cache: false,
			error: function (xhr){NextGen.showError(xhr);}
		});
	};
	
	ng.loginSuccess = null;
	ng.loginCallback = function(userInfo){
		lb.close();
		//Disqus login opens a new window, on close parent page will get refershed.
		if ( userInfo.isDisqus2012 !== undefined && userInfo.isDisqus2012 ) {
			window.close();
		}
		if(bindElement.downloadValidation == true){
			if($('.welcome').length) {
				ng.setWelcomeMessage();
			}
			bindElement.assetDownload({'redirectUrl':bindElement.successlogin}); 
		}
		else if(bindElement.successlogin !== undefined && Boolean(bindElement.successlogin)){
			//Page is getting loaded as soon as SSOGateway call so SSO call is terminating. To avoid this we have added few seconds delay.
			if(userInfo !== undefined && userInfo.delay !== undefined && userInfo.ssogateway !== undefined){
				setTimeout(function() {
                    window.location = decodeURIComponent(bindElement.successlogin);
				}, userInfo.delay);
			}
			else{
				window.location = decodeURIComponent(bindElement.successlogin);
			}			
		}
		else if (isNGGatedContentPage()){
			//Page is getting loaded as soon as SSOGateway call so SSO call is terminating. To avoid this we have added few seconds delay.
			if(userInfo !== undefined && userInfo.delay !== undefined && userInfo.ssogateway !== undefined){
				setTimeout(function() {
                    window.location.reload();
				}, userInfo.delay);
			}
			else{
				window.location.reload();
			}
		}
		else if($('.welcome').length) {
			ng.setWelcomeMessage();
		}
		else{
			window.location.reload();
		}
	}

	/*forpass_code*/
	this.forgotpasswordform = function(queryParem){
		lb.backgroundClickable = false;
		lb.open();		
		lb.showLoader();
		$.ajax({ 
			url: bindElement.forgotpasswordtemplate,
			data: queryParem,
			success: function(html){			
				lb.setHtml(html, nextGenLoginInstance.forgotPasswordPage);
			},
			cache: false,
			error: function (xhr){NextGen.showError(xhr);}
		});
	};
	/*forpass_code ends here*/

	// Asset Download
	this.assetDownload = function(options){
		var redirectUrl = decodeURIComponent(options.redirectUrl);
		if(!ngcheckLoggedIn()) {
			lb.backgroundClickable = false;
			lb.open();
			lb.showLoader(); 
		}
		
		$.ajax({ 
			url: redirectUrl,
			success: function(response){
				if(response.successfulLoginRedirect !== undefined)
					bindElement.successlogin = response.successfulLoginRedirect;
				
				if(response.template == 'login' && !ngcheckLoggedIn()) { 
					bindElement.downloadValidation = true;
					bindElement.login(null, response); 
				}
				else if(response.template == 'editprofile') {
					bindElement.downloadValidation = true;
					var queryStringUrl = '?assetId='+response.assetId+'&actionType='+response.actionType+'&successfulLoginRedirect='+response.successfulLoginRedirect;
					NextGen.register(nextGenLoginInstance.registerTemplate+queryStringUrl);
				}				
				else if(response.template == 'thankyou'){
					if(response.url){						
					lb.close();
					//opens a pop-up for asset download
					if(bindElement.newwindow == 1){
						lb.close();
						bindElement.downloadValidation = false;
						if (isNGGatedContentPage()){
							window.location.reload();
							}
						window.open(decodeURIComponent(response.url));
						return false;
					}
						window.location.href = decodeURIComponent(response.url);
					}else{
						window.location.href =  decodeURIComponent(options.redirectUrl);
					}
				}				
			},
			cache: false,
			error: function (xhr){NextGen.showError(xhr);}
		});
	}


	// Iwk and Big Data Sponsored Content Download  	
	$('#TC2_iwkAnalyticReports a, #TC2_iwkAnalyticReports .sponsoredcontent, .whitepaper h3 a, .reports articles,#TC2_greyCurveBoxContent a, .download2 a, #ResourcesContainer #Resources p a, .download3, #TC_inDepth p a, #relatedContent a, #iwkReports a, #TC_greyCurveBoxContent p a, #TC_inDepth li a, a.dr_techcenter, .lrwhitepapers .blue a, .edsChoiceItem h3 a, .drReports a').click(function(e){ 
		e.preventDefault();
		var redirectUrl =  $(this).attr('href');
		var sponsoredContentUrl =  redirectUrl.split('.').pop();	
		var currentdomain = window.location.host;
		var matches = redirectUrl.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
		var domain = matches && matches[1];
		// If the user defined url include other than pdf please add it in OR condition 
		if (sponsoredContentUrl == "pdf" || (domain != null && domain != currentdomain)){
			window.open(redirectUrl);
		}else{
			lb.backgroundClickable = false;
            lb.open();
            lb.showLoader();
			//adds popup option if href tag has _blank or new 
			if($(this).parents('#TC2_iwkAnalyticReports,.drReports a, #relatedContent, .reports articles,#iwkReports, #TC2_iwkAnalyticReports a, #TC2_greyCurveBoxContent p, #TC_inDepth p, #TC_greyCurveBoxContent p, #TC_inDepth li, #TC_DR, .whitepaper h3, .lrwhitepapers .blue, .edsChoiceItem h3').length > 0 && $(this).attr('target') == '_blank' || $(this).attr('target') == 'new'){
				bindElement.newwindow = 1;
			}
			else{
				bindElement.newwindow = 0;
			}
			bindElement.assetDownload({'redirectUrl':redirectUrl});
		}
	});
	
	// Sourcecode download
	$('.sourcecode').click(function(e){ 
		e.preventDefault();
		var redirectUrl = $(this).attr('href');		
		if(!ngcheckLoggedIn()){	
			bindElement.login(null, null);
		}
		else {
			bindElement.assetDownload({'redirectUrl':redirectUrl});			
		}
	});
	
	//Content Gating starts
	$('a.contentgating_article, .contentgating_dark a').click(function(e){
		e.preventDefault();
		var articleUrl = $(this).attr('href');
		$.ajax({
		   type: 'GET',
		   url: nextGenLoginInstance.contentGating,
		   data: {'islightbox' : true, 'redirectTo': articleUrl}, 
		   cache: false,
		   dataType: 'json',
		   success: function(data){
			  if(data.redirectTo){
				var options = $.url(data.redirectTo).param();
				bindElement.login(null, options);
			  }
			  else{
				window.location = articleUrl;
			  }
		   },
		   error: function (xhr){NextGen.showError(xhr);}
		});
	});
	//Content Gating ends
	
	 //LR Article Pagination Gating Starts
    $('a.article_contentgating').click(function(e){

            e.preventDefault();
            var articleUrl = $(this).attr('href');
            $.ajax({
               type: 'GET',
               url: nextGenLoginInstance.contentGating,
               data: {'redirectTo': articleUrl, 'islightbox' : true, 'articlePageGating':true},
               cache: false,
               dataType: 'json',
               success: function(data){
                      if(data.redirectTo){
                            var options = $.url(data.redirectTo).param();
                            bindElement.login(null, options);
                      }
                      else{
                            window.location = articleUrl;
                      }
               },
               error: function (xhr){NextGen.showError(xhr);}
            });
    });


//LR Article Pagination Gating Ends

	
	this.lb.closeCallback = function() {
		ng.loginSuccess = null;
		bindElement.selectedAsset = null;
	};
	
	nextGenLoginInstance = this;
	return this;
};

/*
 * Load registration form
 */
NextGen.register = function(template, options){
	if(nextGenLoginInstance && nextGenLoginInstance.lb){
		nextGenLoginInstance.lb.close();
		// open registration
		NextGenRegister(nextGenLoginInstance.options.registrationTemplate, options).register(template);
	}
}

/*
 * Load Change password form
 */
NextGen.changePassword = function(cpTemplate){ 
	NextGenRegister().changePassword(cpTemplate);
}

function NextGenRegister (template, options) {

	/*Registration Starts*/
	var ng = NextGen.getInstance();
	var bindElement = this;
	if(!template || template == ''){
		template = nextGenLoginInstance.registerTemplate;
	}
	
	this.register = function(template){
		if(nextGenLoginInstance !== null){
			nextGenLoginInstance.lb.backgroundClickable = false;
			nextGenLoginInstance.lb.open();
			nextGenLoginInstance.lb.showLoader();
				$.ajax({ 
					url: template,				
					success: function(html){
						if(html.match('id="changePasswordId"')){
							nextGenLoginInstance.lb.setHtml(html, nextGenLoginInstance.updateProfilePage);
						}else{
							nextGenLoginInstance.lb.setHtml(html, nextGenLoginInstance.registrationPage);
						}					
						bindForm(template);
					},
					cache: false,
					error: function (xhr){
						NextGen.showError(xhr);
					}
				});
		}
	};
	
	//Bind registrattion form
	var bindForm = function(template) { 
		$('#registrationForm').attr('onSubmit','return false;');
		var templateParts = $.url(template).param();
		//Site logout upon closing supplementary page
		if ( typeof(templateParts.isSupplementary) !== "undefined" && templateParts.isSupplementary ) {
			$('.nextGenContainer_closeButton #nextGenContainer_closeButton_inner').removeAttr('onclick').click (function (){
				nextGenLoginInstance.lb.close();
				$.ajax({
					url: nextGenLoginInstance.siteUrlPrefix+ nextGenLoginInstance.siteRedirectPrefix+ '/logout',
					data: 'isSupplementary=true',
					success: function(data){
						var data = $.parseJSON(data);
						//NG server logout for site complete logout
						if ( typeof(data.gateway) !== "undefined" && data.gateway !== null ) {
							NextGen.instance.authenticateGateway(data.gateway);
						}
					}
				});				
			});
		}
		$('#registrationForm').submit(function(e){
			e.preventDefault();
			var thisForm = $(this);			
			
			var submitForm = function(){
				var formData = thisForm.find(':input').serializeArray();
				var hiddenFormData = thisForm.find(':input[bypass]').serializeArray();
				for(var index = 0; index < hiddenFormData.length; index++){
					hiddenFormData[index].value = '#disabled#';
					formData.push(hiddenFormData[index]);
				}
				if($('#ngLoadingIndicator').length == 0){
					$('form#registrationForm #submit').before('<div id="ngLoadingIndicator" style="margin-left:4px;"><img src="http://twimgs.com/custom/csb/images/loading_bar_blue.gif"><br /><br /></div>');
				}

				$.ajax({
						type: 'POST',
						 url: template,
						 data: formData,
						 success: function(data, textStatus, jqXHR){
						//Registration controller returns two type of resposes HTML on load form and error & Json on success
						var ct = jqXHR.getResponseHeader("content-type") || "";
						if (ct.indexOf('html') > -1) {
							if(data.match('id="changePasswordId"')){
								nextGenLoginInstance.lb.setHtml(data, nextGenLoginInstance.updateProfilePage);
							}else{
								nextGenLoginInstance.lb.setHtml(data, nextGenLoginInstance.registrationPage);
							}
							bindForm(template);
						}
						else if (ct.indexOf('json') > -1) {
							if(data.success == true){
								// if user just registered then there will be a token
								if(data.gateway){
										NextGen.instance.authenticateGateway(data.gateway);
								}
								/*
								 * Close lightbox and refresh the page or open thankyou lightbox after registration
								 * */
								if(data.register){
										// open thank you page after completing registration
								$.ajax({ url: nextGenLoginInstance.thankyouTemplate,
									data: 'assetId='+data.asset_id,
									success: function(html){
									nextGenLoginInstance.lb.open();
										nextGenLoginInstance.lb.setHtml(html, nextGenLoginInstance.thankyouPage);
										setTimeout( function() {
											if(nextGenLoginInstance.downloadValidation != "undefined" && nextGenLoginInstance.downloadValidation == true){
	nextGenLoginInstance.assetDownload({'redirectUrl':data.successfulLoginRedirect});
											}else if(data.successfulLoginRedirect){
												window.location = decodeURIComponent(data.successfulLoginRedirect);
											}
											else if(isNGGatedContentPage()){
												window.location.reload();
											}
											else{
												nextGenLoginInstance.lb.close();
												NextGen.instance.setWelcomeMessage();
											}
										}, 1000 );
								},
								cache: false,
								error: function (xhr){NextGen.showError(xhr);}
							});
								}else if(nextGenLoginInstance.downloadValidation == true && data.successfulLoginRedirect){
		nextGenLoginInstance.assetDownload({'redirectUrl':data.successfulLoginRedirect});
	}else if(data.successfulLoginRedirect){
										window.location = decodeURIComponent(data.successfulLoginRedirect);
								}
								//Update Login whirefarme
								nextGenLoginInstance.lb.close();
								var templateParts = $.url(template).param();
								if( typeof(templateParts.isSupplementary) !== "undefined" && isNGGatedContentPage() ) {
									window.location.reload();
								}
								else if( typeof(templateParts.isSupplementary) !== "undefined" && $('.welcome').length ) {
									NextGen.instance.setWelcomeMessage();
								}
								else if(data.firstName){
									$('.welcome #firstName').text(data.firstName);
								}
							}
						}
				},
				error: function(xhr) {
						NextGen.showError(xhr);
				}
				});
			}
			
			invalidFields = [];
			var totalVisibleField = $('#registrationForm :input:visible').length;
			$('#registrationForm :input:visible').each(function(index, element){
				if($(this).attr('onblur')){
					$(this).trigger('blur');
				}

				if($(this).attr('onchange')){
					$(this).trigger('change');
				}

				if(index == totalVisibleField -1){
					if(invalidFields.length < 1 ){
						submitForm();
					}
					else{
						// find the first faild field and focus to it
						$('#registrationForm .error_highlight:first').focus();
						$('#registrationForm .error_required_highlight:first').focus();
					}
				}
			});
		});	
	};
	/* Registraion Ends*/
	
	
	/*
	 * Change password functionality starts
	*/
	this.changePassword = function(cpTemplate){ 
		nextGenLoginInstance.lb.close();
		nextGenLoginInstance.lb.backgroundClickable = true;
		nextGenLoginInstance.lb.open();
		nextGenLoginInstance.lb.showLoader();
		$.ajax({ 
			url: cpTemplate,
			success: function(html){			
				nextGenLoginInstance.lb.setHtml(html, nextGenLoginInstance.changePasswordPage);
				bindFormCp(cpTemplate);
			},
			cache: false,
			error: function (xhr){NextGen.showError(xhr);}
		});
	}
	
	var bindFormCp = function(cpTemplate){
	    $('#changepassword').attr('onSubmit','return false;');
		
	    $('#password').blur(function (){
			$('#error').html('');
		});
	    
	    $('#changepassword').submit(function(e){ 			
		   var $error="";	
		   if (jQuery.trim($("input#password").val()) == '' || (jQuery.trim($("input#confirmpassword").val()) == '')) {
				$("#error").html("Password and Confirm Password cannot be blank.");
				return false;
		   }
		   if ($("input#password").val().length < 6) {
			   $("#error").html(" Password must be 6 characters or longer.");
			   return false;
		   }
		   if ($("input#password").val() != $("input#confirmpassword").val()) {
			   $("#error").html("Passwords do not match.");$("input#password").val('');$("input#confirmpassword").val('');
			   	return false;
			}
			e.preventDefault();
			var thisForm = $(this);
			var formAction = cpTemplate;
			var formData = thisForm.find(':input:visible').serializeArray();
			var hiddenFormData = thisForm.find(':input[bypass]').serializeArray();
			for(var index = 0; index < hiddenFormData.length; index++){
				hiddenFormData[index].value = '#disabled#';
				formData.push(hiddenFormData[index]);
			}
			nextGenLoginInstance.lb.showLoader();
			$.post(formAction, formData, function(data){
				nextGenLoginInstance.lb.showLoader('Password Updated successfully ...');						
				nextGenLoginInstance.lb.close();
				if(data.redirectTo){
					NextGen.register(data.redirectTo);
				}
			});
		});
	}
	return this;
};

/*
 * Load Benefit page
 * template - callback URL
*/
NextGen.benefit = function(template){
	if(nextGenLoginInstance && nextGenLoginInstance.lb){
		nextGenLoginInstance.lb.close();
		NextGenBenifit(template);
	}
}

/*
 *Used to Load Static Content in lightbox with dynamic URL
 * template - callback URL
*/
NextGen.staticinfo = function(template){
	if(nextGenLoginInstance && nextGenLoginInstance.lb){
		nextGenLoginInstance.lb.close();
		NextGenStaticinfo(template);
	}
}
function NextGenStaticinfo (template) {
	var ng = NextGen.getInstance();
	var bindElement = this;	
	if(nextGenLoginInstance !== null){
		nextGenLoginInstance.lb.backgroundClickable = true;
		nextGenLoginInstance.lb.open();
		nextGenLoginInstance.lb.showLoader();
		$.ajax({ 
			url: template,
			success: function(html){				
				nextGenLoginInstance.lb.setHtml(html, null);
			},
			cache: true,
			error: function (xhr){NextGen.showError(xhr);}
		});
	}
}
function NextGenBenifit (template) {
	var ng = NextGen.getInstance();
	var bindElement = this;	
	if(nextGenLoginInstance !== null){
		nextGenLoginInstance.lb.backgroundClickable = true;
		nextGenLoginInstance.lb.open();
		nextGenLoginInstance.lb.showLoader();
		$.ajax({ 
			url: template,
			success: function(html){				
				nextGenLoginInstance.lb.setHtml(html, nextGenLoginInstance.benefitsPage);
			},
			cache: false,
			error: function (xhr){NextGen.showError(xhr);}
		});
	}
}

function NextGenUlinkProvider (template) {
$.ajax({ 
	url: template,
	success: function(html){				
		if(html.success == true){
			$('li#'+html.providerId).hide();
			if(!$('.providers ul li:visible').length){
			    $('fieldset.linkedproviders').hide();
			}
		}
	},
	cache: false
});
}

/*
 * Check the site is authenticated or not
 * var isNGGatedContentPage is defined in common/welcome.php
*/ 

function ngcheckLoggedIn(){
	if(typeof(authenticateUserCheck) !== "undefined" && authenticateUserCheck =='true')
		return true;
	else 
		return false;
}

/*
 * Check the page is gated or not
 * var isNGGatedContentPage is defined in most of the detail page layouts EX: deafult/layout.phtml 
*/ 
function isNGGatedContentPage(){
	if(typeof(ngGatedContentPage) !== "undefined" && ngGatedContentPage == 1)
		return true;
	else 
		return false;
}

/*
 * Check isset of isSaveforLater 
*/ 
function isSaveforLater(){
	if(typeof(saveforLater) == "undefined" || saveforLater == true)
		return true;
	else 
		return false;
}

/*
 * Load Disqus commen form
 * template - callback URL
*/
NextGen.disqusCommentForm = function(queryParem){
	var options = $.url(queryParem).param();
	nextGenLoginInstance.login(null, options);
}

/*
 * Show error indicator 
*/
NextGen.showError = function(xhr){
	var ct = xhr.getResponseHeader("content-type") || "";
						 if (ct.indexOf('html') > -1) {
						nextGenLoginInstance.lb.showError();
						}
						else{
							response=jQuery.parseJSON(xhr.responseText);
						nextGenLoginInstance.lb.showError(response.message);
						}
			setTimeout(function() {
		nextGenLoginInstance.lb.close();
	}, nextGenLoginInstance.showError);
} 

//Load Login form
NextGen.reloginForm = function(queryParem){
	$.ajax({
		url: '/logout',
		data: 'isSupplementary=true',
		success: function(data){
			var data = $.parseJSON(data);
			//NG server logout for site complete logout
			if ( typeof(data.gateway) !== "undefined" && data.gateway !== null ) {
				NextGen.instance.authenticateGateway(data.gateway);
			}
			
			var options = $.url(queryParem).param();	 
			if(nextGenLoginInstance && nextGenLoginInstance.lb){
				nextGenLoginInstance.lb.close();
				nextGenLoginInstance.login('', options);
			}
		}
	});	
	
}