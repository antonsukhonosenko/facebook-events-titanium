/**
 * @author Anton Sukhonosenko
 */

exports.EventView = function(data, friends) {

	// TODO: request additional info via graph API request
	// TODO: add ability to checkin using Facebook Places
	// TODO: rsvp and ban events
	// TODO: event image and scroll view
	
	var _ = require('underscore')._;
	require('date');  // This adds Date.js library, extending standard Date() object

	var self = Ti.UI.createView({
		top : "0dp",
		height : "100%",
		backgroundColor : "#fff",
		zIndex: 103
	});

	self.friends = friends;
	
	var headerLabel = Ti.UI.createLabel({
		text: "Event Details",
		top: "0dp",
		height: "44dp",
		width: "100%",
		textAlign:'center',
		color:"#fff",
		font: {
			fontSize: 18,
			fontWeight: "bold"
		},
		zIndex: 100,
		backgroundImage: "/images/iphone_title_bar_blue.png" // FIXME: strange <Error>: CGContextConcatCTM: invalid context 0x0 etc etc. yet it works
	});
	
	self.add(headerLabel);

	var scrollView = Titanium.UI.createScrollView({
		contentWidth : Titanium.Platform.osname==='iphone'?"320dp":"768dp",
		contentHeight : 'auto',
		top : "45dp",
		showVerticalScrollIndicator : true
	});
	
	var backButton = Ti.UI.createButton({
		title : "Back",
		top : "8dp",
		left : "5dp",
		width : "50dp",
		height : "29dp",
		color: "white",
		selectedColor: "gray",
		font: {
			fontSize: 12,
			fontWeight: "bold"
		},
		backgroundImage: "/images/iphone_title_button_blue.png",
		backgroundFocusedImage: "/images/iphone_title_button_blue_focused.png",
		backgroundSelectedImage: "/images/iphone_title_button_blue_focused.png",
		zIndex: 102
	});

	backButton.addEventListener('click', function(e) {

		// TODO: beware memory issues!!
		// TODO: are we creating new eventView each time when we click on tableView?
		// TODO: does this affect memory?

		self.hide();
		
		// TODO: following is a humble attempt to manage memory issues
		
		// self.remove();
		// self = null;
	});
	
	var nameLabel = Ti.UI.createLabel({
		top: "5dp",
		left: "5dp",
		right: "5dp",
		height: "44dp",
		width: Titanium.Platform.osname==='iphone'?"320dp":"768dp",
		textAlign: "center",
		text: data.name,
		font: {
			fontSize: 18,
			fontWeight: "bold"
		}
	});
	
	var imageView = Ti.UI.createImageView({
		image: "https://graph.facebook.com/" + (data.id || 0) + "/picture?type=large&access_token=" + Ti.Facebook.accessToken,
		top: "50dp",
		right: "5dp",
		width: Titanium.Platform.osname==='iphone'?"320dp":"768dp",
		height: "120dp"
	});
	
	imageView.touchEnabled = true;
	
	imageView.addEventListener('click', function(e) {
		
		var largeImageView = Ti.UI.createImageView({
			image: "https://graph.facebook.com/" + (data.id || 0) + "/picture?type=large&access_token=" + Ti.Facebook.accessToken,
			top: "0dp",
			height: "100%",
			width: "100%",
			zIndex: 200,
			backgroundColor: "#000",
			opacity: 0.0
		});
		
		self.add(largeImageView);

		var animation = Titanium.UI.createAnimation();
		animation.opacity = 1.0;
		animation.duration = 300;
		
		largeImageView.animate(animation);
		
		largeImageView.addEventListener('click', function(e){
			animation.opacity = 0.0;
			animation.duration = 300;
			animation.addEventListener('complete', function(e){
				self.remove(largeImageView);
				largeImageView = null;
			});
			largeImageView.animate(animation);
		});
		
	});

	var locationLabel = Ti.UI.createLabel({
		top : "180dp",
		left: "5dp",
		right: "5dp",
		height : "40dp",
		width: Titanium.Platform.osname==='iphone'?"320dp":"768dp",
		textAlign: "center",
		text : data.location,
		font: {
			fontSize: 12
		}
	});
	
	var dateLabel = Ti.UI.createLabel({
		top: "230dp",
		left: "5dp",
		right: "5dp",
		height : "40dp",
		width: Titanium.Platform.osname==='iphone'?"320dp":"768dp",
		textAlign: "center",
		text : Date.parse(data.start_time).toString("HH:mm, dd-MMM-yyyy"),
		font: {
			fontSize: 12
		}
	});
	
	// RSVP buttons
	// TODO: if this event is in user's me/events, highlight button accordingly
	
	var attend = Ti.UI.createButton({
		top: "280dp",
		left: "5dp",
		height: "30dp",
		width: "100dp",
		title: "I'm attending"
	})
	
	var maybe = Ti.UI.createButton({
		top: "280dp",
		left: "110dp",
		height: "30dp",
		width: "100dp",
		title: "Don't know"		
	})
	
	var reject = Ti.UI.createButton({
		top: "280dp",
		left: "215dp",
		height: "30dp",
		width: "100dp",
		title: "No"			
	})
	
	attend.addEventListener('click', function(e) {
		Ti.API.info(data.id);
		Titanium.Facebook.requestWithGraphPath('/' + data.id + '/attending', {}, 'POST', function(e) {
			if(e.success) {
				Ti.API.info(e.result);
			} else {
				if(e.error) {
					Ti.API.info(e.error);
				} else {
					Ti.API.info("Unknown result");
				}
			}
		});
	});
	
	maybe.addEventListener('click', function(e) {
		Ti.API.info(data.id);
		Titanium.Facebook.requestWithGraphPath('/' + data.id + '/maybe', {}, 'POST', function(e) {
			if(e.success) {
				Ti.API.info(e.result);
			} else {
				if(e.error) {
					Ti.API.info(e.error);
				} else {
					Ti.API.info("Unknown result");
				}
			}
		});
	});
	
	reject.addEventListener('click', function(e) {
		Ti.API.info(data.id);
		Titanium.Facebook.requestWithGraphPath('/' + data.id + '/declined', {}, 'POST', function(e) {
			if(e.success) {
				Ti.API.info(e.result);
			} else {
				if(e.error) {
					Ti.API.info(e.error);
				} else {
					Ti.API.info("Unknown result");
				}
			}
		});
	});
	
	

	scrollView.add(nameLabel);
	scrollView.add(locationLabel);
	scrollView.add(dateLabel);
	
	scrollView.add(attend);
	scrollView.add(maybe);
	scrollView.add(reject);

	scrollView.add(imageView);

	self.add(backButton);
	self.add(scrollView);

	Titanium.Facebook.requestWithGraphPath('/' + data.id, {"limit": 0}, 'GET', function(e) {
		if(e.success) {
			var current_event = JSON.parse(e.result);
			
			var descriptionLabel = Ti.UI.createLabel({
				text: current_event.description,
				top: "390dp",
				height: "auto",
				width: "auto",
				left: "5dp",
				width: Titanium.Platform.osname==='iphone'?"320dp":"768dp",		
				font: {
					fontSize: 12
				}
			});
			
			scrollView.add(descriptionLabel);
			
			Ti.API.info(e.result);
			
			// TODO: get event image from https://graph.facebook.com/331218348435/picture request to show in events list tile view
			// TODO: maybe get owner with another request (/#{current_event.owner.id})
			// TODO: cache all in json-based local storage
			
		} else {
			if(e.error) {
				Ti.API.info(e.error);
			} else {
				Ti.API.info("Unknown result");
			}
		}
	});
	
	// get all users who will attend
	// TODO: add list of friends who RSVP that
	// for this, check returned list against list of your friends (with underscore)
	// AVOID dozens of get requests to /attending/user_id!!

	Titanium.Facebook.requestWithGraphPath('/' + data.id + '/attending', {"limit": 0}, 'GET', function(e) {
		if(e.success) {
			Ti.API.info("Invited users: " + e.result);
			Ti.API.info("Friends: " + JSON.stringify(self.friends));
			
			var attending_ids = _.pluck(JSON.parse(e.result).data, 'id');
			var friends_ids = _.pluck(self.friends, 'id');
			var attending_friends_ids = _.intersect(attending_ids, friends_ids);

			Ti.API.info("Attending friends: "+ attending_friends_ids.length);
			
			var i = -1;
			_(attending_friends_ids).each(function (friend_id) {
				// http://graph.facebook.com/{friendId}/picture
				var userpic = Ti.UI.createImageView({
					image: "https://graph.facebook.com/" + (friend_id || 0) + "/picture?type=large&access_token=" + Ti.Facebook.accessToken,
					top: "320dp",
					left: (++i*64+2),
					height: "64dp",
					width: "64dp",
				});

				scrollView.add(userpic);
			});
			
		} else {
			if(e.error) {
				Ti.API.info(e.error);
			} else {
				Ti.API.info("Unknown result");
			}
		}
	});
	
	return self;
};