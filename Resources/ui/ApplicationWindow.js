//Application Window Component Constructor
exports.ApplicationWindow = function() {
	
	Ti.API.log(JSON.stringify(Titanium.Platform.osname));
	
	var _ = require('underscore')._;
	
	require('date');

	var self = Ti.UI.createWindow({
		backgroundColor : '#fff',
		fullscreen : false,
		exitOnClose : true,
		top: "0dp",
		title:'Friends Events',
		navBarHidden: false
		//width: "100%",
		//height: "100%"
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
		backgroundImage: "images/iphone_title_bar_blue.png"
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

	
	//  create table view for events
	// TODO: add tile view
	// TODO: add top bar to change tile/list view modes
	// TODO: add search field and search by name
	// TODO: search by date
	
	var tableView = Ti.UI.createTableView({
		top: "44dp",
		height: (Titanium.Platform.osname==='ipad'?"936dp":"416dp"),
		search: searchBar,
		filterAttribute : 'name',
		backgroundColor: "#fff",
		data : [{title:'loading...'}]
	}); 
	
	tableView.addEventListener('click', function(e) {
		// Ti.API.info(JSON.stringify(e.rowData.data));
		
		// TODO: bevare memory issues!! 
		// TODO: are we creating new eventView each time when we click on tableView?
		// TODO: does this affect memory?
		
		var eventView = require('ui/EventView').EventView(e.rowData.data);
		self.add(eventView);
		
		Ti.API.info(JSON.stringify(e.rowData.data));
	});
	
	self.add(tableView);
	
	buttonFacebookLogout.addEventListener('click', function(e) {
		Titanium.Facebook.logout();
		
		loginView.show();
		tableView.hide();
	});
	
	var all_my_friends = [];
	var all_events = [];
	var table_data_events = [];
	
	var process_events = function(e) {
		if(e.success) {

			var events_result = JSON.parse(e.result);

			for(var i = 0; i < events_result.data.length; i++) {

				// don't process any events from the past
				if((Date.today()-Date.parse(events_result.data[i].start_time))>0) {
					continue;
				}

				all_events.push(events_result.data[i]);

				var table_row_data = {
					data : events_result.data[i],
					hasChild : true,
					className : "event_layout",
					name : events_result.data[i].name
				};

				var row = Ti.UI.createTableViewRow(table_row_data);

				var label = Ti.UI.createLabel({
					left : "50dp",
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
			
			table_data_events = _(table_data_events).chain().uniq(false, function(obj) {
				return obj.data.id;
			}).sortBy( function(obj) { 
				// DONE: sort by start time and remove past events
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
		
		// clear before populating
		tableView.setData([]);

		Titanium.Facebook.requestWithGraphPath('me/friends', {}, 'GET', function(e) {
			if(e.success) {
				Ti.API.info("Success! Returned from FB: " + e.result);
				
				var result = JSON.parse(e.result);
				
				all_my_friends = result.data; 

				// FIXME: not all friends are taken for now, only the first page

				for (var i = 0; i < result.data.length; i++) {
					
					var friend = result.data[i];
					
					// TODO: don't add duplicates!
					// TODO: if all_events already has object with events.result.data[i].id, don't add it 
					// TODO: utilize underscore.js for above
								
					// TODO: cache all in json-based local storage
								
					// TODO: filter by where your friends are going or NOT going ;)
							
					// FIXME: not all events are taken for now, only the first page
										
					
					Titanium.Facebook.requestWithGraphPath(''+friend.id+'/events', {}, 'GET', process_events);
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

	if(Titanium.Facebook.loggedIn) {
		loginView.hide();
		tableView.show();
		populate_events();
	}

	Titanium.Facebook.appid = '187742787964643';
	Titanium.Facebook.permissions = [
		'user_events',
		'friends_events'
	];
		
	// Permissions your app needs
	Titanium.Facebook.addEventListener('login', function(e) {
		if(e.success) {
			Ti.API.info('Logged In');
			loginView.hide();
			tableView.show();
			populate_events();
			
			Titanium.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
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
