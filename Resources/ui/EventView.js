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
	});

	var scrollView = Titanium.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		top : "45dp",
		showVerticalScrollIndicator : true,
	});
	
	var backButton = Ti.UI.createButton({
		title : "Back",
		top : "5dp",
		left : "5dp",
		width : "64dp",
		height : "36dp"
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
		top: "0dp",
		left: "0dp",
		height: "30dp",
		width: "200dp",
		text: data.name,
		font: {
			fontSize: 12
		}
	})

	var locationLabel = Ti.UI.createLabel({
		top : "30dp",
		left: "0dp",
		height : "40dp",
		width: "200dp",
		text : data.location,
				font: {
			fontSize: 12
		}
	})
	
	var descriptionLabel = Ti.UI.createLabel({
		top: "130dp",
		height: "auto",
		font: {
			fontSize: 12
		}
	});
	
	Ti.API.info('http:/graph.facebook.com/'+data.id+'/picture');
	
	var imageView = Ti.UI.createImageView({
		image: "https://graph.facebook.com/" + (data.id || 0) + "/picture?type=large&access_token=" + Ti.Facebook.accessToken,
		top: "0dp",
		left: "200dp",
		width: "120dp",
		height: "120dp",
	})
	
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
}