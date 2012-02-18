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
		backgroundColor : "fff",
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

	self.add(nameLabel);
	self.add(locationLabel);
	self.add(backButton);
	self.add(idLabel);
	self.add(descriptionLabel);

	// TODO: add list of friends who RSVP that

	Titanium.Facebook.requestWithGraphPath('/' + data.id, {}, 'GET', function(e) {
		if(e.success) {
			var current_event = JSON.parse(e.result);
			descriptionLabel.text = current_event.description;
			Ti.API.info(e.result);
			
			// TODO: get owner with another request (/#{current_event.owner.id})
			// TODO: get his picture to show in events list tile view
			// TODO: cache all in json-based local storage
			
		} else {
			if(e.error) {
				alert(e.error);
			} else {
				alert("Unknown result");
			}
		}
	});
	
	return self;
}