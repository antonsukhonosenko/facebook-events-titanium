//Application Window Component Constructor
exports.ApplicationWindow = function() {
	
	Ti.API.log(JSON.stringify(Titanium.Platform.osname));
	
	var _ = require('underscore')._;
	
	require('date'); // This adds Date.js library, extending standard Date() object
	
	// TODO: use Ti.UI.iPad split view for iPad version

	var self = Ti.UI.createWindow({
		backgroundColor : '#fff',
		fullscreen : false,
		exitOnClose : true,
		top: "0dp",
		title:'Friends Events',
		navBarHidden: false,
	});

	// invoke loginView
	
	var loginView = require('ui/LoginView').LoginView();
	self.add(loginView);
	
	var headerLabel = Ti.UI.createLabel({
		text: "Friends events",
		top: "0dp",
		height: "44dp",
		textAlign:'center',
		color:"#fff",
		font: {
			fontSize: 18,
			fontWeight: "bold"
		},
		zIndex: 100,
		backgroundImage: "images/iphone_title_bar_blue.png",
		backgroundRepeat: true,
		width: "100%",
	});

	var buttonFacebookLogout = Ti.UI.createButton({
		title: "Logout",
		top: "8dp",
		height: "29dp",
		width: "64dp",
		right: "5dp",
		color: "white",
		selectedColor: "gray",
		font: {
			fontSize: 12,
			fontWeight: "bold"
		},
		backgroundImage: "images/iphone_title_button_blue.png",
		backgroundFocusedImage: "images/iphone_title_button_blue_focused.png",
		backgroundSelectedImage: "images/iphone_title_button_blue_focused.png",		
		zIndex: 102
	});

	var searchBar = Ti.UI.createSearchBar({
		autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		hintText: "search...",
		top: "0dp"
	});

	self.add(headerLabel);
	self.add(buttonFacebookLogout);
	
	var tableView = Ti.UI.createTableView({
		top: "44dp",
		height: (Titanium.Platform.osname==='ipad'?"936dp":"416dp"),
		search: searchBar,
		filterAttribute : 'name',
		backgroundColor: "#fff",
		data : [{title:'loading...'}]
	}); 
	
	var search_value = "";
	
	tableView.addEventListener('click', function(e) {
		var eventView = require('ui/EventView').EventView(e.rowData.data, all_my_friends);
		self.add(eventView);
		
		Ti.API.info(JSON.stringify(e.rowData.data));
	});
	
	self.add(tableView);
	
	buttonFacebookLogout.addEventListener('click', function(e) {
		Titanium.Facebook.logout();
		loginView.show();
		tableView.hide();
	});
	
	var all_my_friends		= [];
	var table_data_events	= [];
	
	var process_events = function(e) {
		if(e.success) {

			var events_result = JSON.parse(e.result);

			for(var i = 0; i < events_result.data.length; i++) {

				// don't process any events from the past
				if((Date.today()-Date.parse(events_result.data[i].start_time))>0) {
					continue;
				}

				var table_row_data = {
					data : events_result.data[i],
					hasChild : true,
					className : "event_layout",
					name : events_result.data[i].name
				};

				var row = Ti.UI.createTableViewRow(table_row_data);

				var label = Ti.UI.createLabel({
					left : "50dp",
					top  : "0dp",
					height: "44dp", 
					text : events_result.data[i].name,
					font : {
						fontSize : 12
					}
				});

				var image = Ti.UI.createImageView({
					top : "0dp",
					left : "0dp",
					width : "44dp",
					height : "44dp",
					image : "https://graph.facebook.com/" + (events_result.data[i].id || 0) + "/picture?type=small&access_token=" + Ti.Facebook.accessToken
				});

				row.add(label);
				row.add(image);

				table_data_events.push(row);
			}
			
			// remove duplicates and sort table
			table_data_events = _(table_data_events).chain().uniq(false, function(obj) {
				return obj.data.id;
			}).sortBy( function(obj) { 
				return obj.data.start_time;
			}).value();

			tableView.setData(table_data_events);

		} else {
			if(e.error) {
				Ti.API.info(e.error);
			} else {
				Ti.API.info("Unknown result");
			}
		}
	};

	var populate_events = function() {

		tableView.setData([]);

		Ti.Facebook.requestWithGraphPath('me/friends', {"limit":0}, 'GET', function(e) {
			if(e.success) {
				var result = JSON.parse(e.result);
				
				// Ti.API.info('Friends: '+ e.result);

				all_my_friends = result.data;
				
				Ti.API.info('Friends found: '+ result.data.length);

				// FIXME: not all friends are taken for now, only the first page

				for (var i = 0; i < result.data.length; i++) {
					
					var friend = result.data[i];

					// TODO: cache all in json-based local storage
					// TODO: filter by where your friends are going or NOT going ;)
					
					Ti.Facebook.requestWithGraphPath(''+friend.id+'/events', {"limit":0}, 'GET', process_events);
				}
				
			} else {
				if(e.error) {
					Ti.API.info(e.error);
				} else {
					Ti.API.info("Unknown result");
				}
			}
		});
	};

	if(Ti.Facebook.loggedIn) {
		loginView.hide();
		tableView.show();
		populate_events();
	}

	Ti.Facebook.appid = '187742787964643';
	Ti.Facebook.permissions = [
		'user_events',
		'friends_events',
		'rsvp_event',
		'publish_checkins'
	];
		
	// Permissions your app needs
	Ti.Facebook.addEventListener('login', function(e) {
		if(e.success) {
			Ti.API.info('Logged In');
			loginView.hide();
			tableView.show();
			populate_events();
			
			Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
				if(e.success) {
					Ti.API.info(e.result);
					// Ti.API.info('access_token = ', Titanium.Facebook.getAccessToken());
				} else if(e.error) {
					Ti.API.info(e.error);
				} else {
					Ti.API.info('Unknown response');
				}
			});
		} else if(e.error) {
			Ti.API.info(e.error);
		} else if(e.cancelled) {
			Ti.API.info("Cancelled");
		}
	});
	
	return self;

};
