/**
 * @author Anton Sukhonosenko
 */

exports.EventView = function(data) {

	// TODO: request additional info via graph API request
	// TODO: add ability to checkin using Facebook Places
	// TODO: rsvp and ban events
	// TODO: event image and scroll view

	var self = Ti.UI.createView({
		top : "0dp",
		height : "100%",
		backgroundColor : "#fff",
		zIndex: 103
	});
	
	var headerLabel = Ti.UI.createLabel({
		text: "Event Details",
		top: "0dp",
		height: "44dp",
		textAlign:'center',
		color:"#fff",
		font: {
			fontSize: 18,
			fontWeight: "bold"
		},
		zIndex: 100,
		backgroundImage: "images/iphone_title_bar_blue.png" // FIXME: strange <Error>: CGContextConcatCTM: invalid context 0x0 etc etc. yet it works
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
		backgroundImage: "images/iphone_title_button_blue.png",
		backgroundFocusedImage: "images/iphone_title_button_blue_focused.png",
		backgroundSelectedImage: "images/iphone_title_button_blue_focused.png",
		zIndex: 102
	});

	backButton.addEventListener('click', function(e) {

		// TODO: bevare memory issues!!
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
		
		Ti.API.info('clicked');
		
		var largeImageView = Ti.UI.createImageView({
			image: "https://graph.facebook.com/" + (data.id || 0) + "/picture?type=large&access_token=" + Ti.Facebook.accessToken,
			top: "0dp",
			height: "100%",
			zIndex: 200,
			backgroundColor: "#000"
		});
		
		self.add(largeImageView);
		
		largeImageView.addEventListener('click', function(e){
			largeImageView.hide();
		});
		
	});

	var locationLabel = Ti.UI.createLabel({
		top : "180dp",
		left: "5dp",
		right: "5dp",
		height : "40dp",
		width: Titanium.Platform.osname==='iphone'?"320dp":"768dp",
		textAlign: "left",
		text : data.location,
		font: {
			fontSize: 12
		}
	});
	
	var descriptionLabel = Ti.UI.createLabel({
		top: "230dp",
		height: "auto",
		left: "5dp",
		right: "5dp",
		width: Titanium.Platform.osname==='iphone'?"320dp":"768dp",		
		font: {
			fontSize: 12
		}
	});
	
	// TODO: add onclick to show larger image in fullscreen mode

	scrollView.add(nameLabel);
	scrollView.add(locationLabel);
	scrollView.add(descriptionLabel);
	
	scrollView.add(imageView);

	self.add(backButton);
	self.add(scrollView);

	// TODO: add list of friends who RSVP that

	Titanium.Facebook.requestWithGraphPath('/' + data.id, {}, 'GET', function(e) {
		if(e.success) {
			var current_event = JSON.parse(e.result);
			descriptionLabel.text = current_event.description;
			Ti.API.info(e.result);
			
			// TODO: get event image from https://graph.facebook.com/331218348435/picture request to show in events list tile view
			// TODO: maybe get owner with another request (/#{current_event.owner.id})
			// TODO: cache all in json-based local storage
			
		} else {
			if(e.error) {
				// alert(e.error);
			} else {
				// alert("Unknown result");
			}
		}
	});
	
	return self;
};