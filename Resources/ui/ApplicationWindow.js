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
			tableView.show();
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
		tableView.hide();
	});

	self.add(buttonFacebookLogout);
	self.add(loginView);
	
	// TODO: create table view for events
	
	var tableView = Ti.UI.createTableView({
		top: "0dp",
		height: "400dp",
	}); 
	
	tableView.addEventListener('click', function(e) {
		// alert(JSON.stringify(e.rowData.data));
		
		var EventProfile = require('ui/EventProfile').EventProfile(e.rowData.data);
		self.add(EventProfile);
		
		Ti.API.info(JSON.stringify(e.rowData.data));
	});
	
	self.add(tableView);
	
	var all_my_friends = [];
	var all_events = [];
	var table_data_events = [];

	var populate_events = function() {

		Titanium.Facebook.requestWithGraphPath('me/friends', {}, 'GET', function(e) {
			if(e.success) {
				alert("Success! Returned from FB: " + e.result);
				
				var result = JSON.parse(e.result);
				
				all_my_friends = result.data; 

				// FIXME: not all friends are taken for now, only the first page

				for (var i = 0; i < result.data.length; i++) {
					
					var friend = result.data[i];
					
					Titanium.Facebook.requestWithGraphPath(''+friend.id+'/events', {}, 'GET', function(e) {
						if(e.success) {
						
							var events_result = JSON.parse(e.result);
							
							// FIXME: not all events are taken for now, only the first page
							
							for (var i = 0; i < events_result.data.length; i++) {
								
								// TODO: don't add suplicates!
								
								all_events.push(events_result.data[i]);
								table_data_events.push({
									title: events_result.data[i].name, 
									data: events_result.data[i]
									});
							}
							
							// all_events.concat(events_result.data).unique();
							// all_events.push(events_result.data);

							// eliminateDuplicates(all_events);  // FIXME: seems to not work
							
							// Ti.API.log("total number of events: " + all_events.length);
							
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
			tableView.show();
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
			tableView.show();
			populate_events();
			
			Titanium.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
				if(e.success) {
					alert(e.result);
					// alert('access_token = ', Titanium.Facebook.getAccessToken());
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
