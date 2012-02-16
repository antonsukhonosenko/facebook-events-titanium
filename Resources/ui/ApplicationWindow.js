//Application Window Component Constructor
exports.ApplicationWindow = function() {

	function eliminateDuplicates(arr) {
		var i, len = arr.length, out = [], obj = {};

		for( i = 0; i < len; i++) {
			obj[arr[i]] = 0;
		}
		for(i in obj) {
			out.push(i);
		}
		return out;
	}

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
	
	var tableView = Ti.UI.createTableView({
		top: "0dp",
		height: "400dp",
	}); 
	
	self.add(tableView);
	
	var all_events = [];
	var table_data_events = [];
	
	Ti.App.addEventListener('collected_events', function(e){
		Ti.API.log('in the event');
		Ti.API.log('found events: '+ all_events.length);
		alert("found events: "+ all_events.length);
	});
	
	var populate_events = function() {
		// alert('populating');
		
		var data = {};

		Titanium.Facebook.requestWithGraphPath('me/friends', data, 'GET', function(e) {
			if(e.success) {
				alert("Success! Returned from FB: " + e.result);
				
				var result = JSON.parse(e.result);
				
				// var result = eval('('+this.responseText+')');
				
				// Ti.API.log(result.data);
				// Ti.API.log(result.data[0]);
				
				var i = 0;

				for (i = 0; i < result.data.length; i++) {
					
					var friend = result.data[i];
					
					// Ti.API.log(friend);
					
					Titanium.Facebook.requestWithGraphPath(''+friend.id+'/events', data, 'GET', function(e) {
						if(e.success) {
						
							var events_result = JSON.parse(e.result);
							
							for (var i = 0; i < events_result.length; i++) {
								
							}
							
							// all_events.concat(events_result.data).unique();
							
							all_events.push(events_result.data);
							eliminateDuplicates(all_events);
							
							// Ti.API.log("collected_events: " + all_events.length);
							
							for (var i = 0; i < all_events.length; i++) {
								table_data_events.push({title: all_events[i].name});
								Ti.API.log(JSON.stringify(all_events));
							}
							
							tableView.setData(table_data_events);

						} else {
							if(e.error) {
								alert(e.error);
							} else {
								alert("Unknown result");
							}
						}
					});
				}
				
			} else {
				if(e.error) {
					alert(e.error);
				} else {
					alert("Unknown result");
				}
			}
		});
	};
	
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
