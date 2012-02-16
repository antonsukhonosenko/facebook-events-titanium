//Application Window Component Constructor
exports.ApplicationWindow = function() {

	var self = Ti.UI.createWindow({
		backgroundColor : '#fff',
		fullscreen : false,
		exitOnClose : true,
	});

	var loginView = Ti.UI.createView({
		top : "0dp",
		height: "480dp",
		backgroundColor: "fff",
	});

	var buttonFacebookLogin = Ti.UI.createButton({
		title : "Facebook Connect",
		top : "150dp",
		height : "36dp"
	});

	buttonFacebookLogin.addEventListener('click', function() {
		if(Titanium.Facebook.loggedIn) {
			loginView.hide();
		} else {
			Titanium.Facebook.authorize();
		}
	});

	loginView.add(buttonFacebookLogin);

	var buttonFacebookLogout = Ti.UI.createButton({
		title : "Facebook Disconnect",
		top : "420dp",
		height : "36dp"
	});

	buttonFacebookLogout.addEventListener('click', function(e) {
		Titanium.Facebook.logout();
		loginView.show();
	});

	self.add(buttonFacebookLogout);
	self.add(loginView);
	
	// TODO: create table view for events
	
	var populate_events = function() {
		// alert('populating');
		
		var data = {};
		
		var all_events = [];

		Titanium.Facebook.requestWithGraphPath('me/friends', data, 'GET', function(e) {
			if(e.success) {
				alert("Success! Returned from FB: " + e.result);
				
				var result = JSON.parse(e.result);
				
				// var result = eval('('+this.responseText+')');
				
				// Ti.API.log(result.data);
				// Ti.API.log(result.data[0]);

				for (var i = 0; i < result.data.length; i++) {
					
					var friend = result.data[i];
					
					Ti.API.log(friend);
					
					Titanium.Facebook.requestWithGraphPath(''+friend.id+'/events', data, 'GET', function(e) {
						if(e.success) {
						
							var events_result = JSON.parse(e.result);
							
							Ti.API.log('found events example: ' + JSON.stringify(events_result))
							all_events.push(e.result);

						} else {
							if(e.error) {
								alert(e.error);
							} else {
								alert("Unknown result");
							}
						}
					});
				}
				
				Ti.App.fireEvent('collected_events');
				
			} else {
				if(e.error) {
					alert(e.error);
				} else {
					alert("Unknown result");
				}
			}
		});
	};
	
	self.addEventListener('collected_events', function(){
		Ti.API.log('found events: '+all_events.length)
	});
	
	if(Titanium.Facebook.loggedIn) {
			loginView.hide();
			populate_events();
	}

	Titanium.Facebook.appid = '187742787964643';
	Titanium.Facebook.permissions = [
		'user_events',
		'friends_events',
	];
	// Permissions your app needs
	Titanium.Facebook.addEventListener('login', function(e) {
		if(e.success) {
			alert('Logged In');
			loginView.hide();
			populate_events();

			Titanium.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
				if(e.success) {
					alert(e.result);
				} else if(e.error) {
					alert(e.error);
				} else {
					alert('Unknown response');
				}
			});
		} else if(e.error) {
			alert(e.error);
		} else if(e.cancelled) {
			alert("Cancelled");
		}
	});
	
	return self;

};
