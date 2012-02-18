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
		height : "480dp",
		backgroundColor : "#fff",
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
	});
	var nameLabel = Ti.UI.createLabel({
		top : "50dp",
		height : "40dp",
		text : data.name,
	})

	var locationLabel = Ti.UI.createLabel({
		top : "90dp",
		height : "80dp",
		text : data.location,
	})

	var idLabel = Ti.UI.createLabel({
		top : "170dp",
		height : "40dp",
		text : data.id,
	})
	
	var descriptionLabel = Ti.UI.createLabel({
		top: "210dp",
		height: "200dp"
	});
	
	Ti.API.info('http:/graph.facebook.com/'+data.id+'/picture');
	
	var imageView = Ti.UI.createImageView({
		// image: 'http:/graph.facebook.com/'+data.id+'/picture',
		image: "https://graph.facebook.com/" + (data.id || 0) + "/picture?type=normal&access_token=" + Ti.Facebook.accessToken,
		top: "40dp",
		left: "200dp",
		width: "120dp",
		height: "120dp",
	})
	
	// TODO: add onclick to show larger image in fullscreen mode

	self.add(nameLabel);
	self.add(locationLabel);
	self.add(backButton);
	self.add(idLabel);
	self.add(descriptionLabel);
	
	// NOTE: works either way
	// imageView.setBackgroundImage = 'http:/graph.facebook.com/'+data.id+'/picture';
	
	self.add(imageView);

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