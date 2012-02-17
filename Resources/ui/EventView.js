/**
 * @author Anton Sukhonosenko
 */

exports.EventView = function(data) {

	// TODO: add back button
	// TODO: add ability to checkin using Facebook Places
	// TODO: rsvp and ban events
	// TODO: event image and scroll view
	
	var self = Ti.UI.createView({
		top : "0dp",
		height : "480dp",
		backgroundColor : "fff",
	});
		
/*	var topBar = Ti.UI.createToolbar({
		color: "blue",
		top: "0dp",
		height: "36dp"
		
	});
*/
	
	var backButton = Ti.UI.createButton({
		title: "Back",
		top: "5dp",
		left: "5dp",
		width: "64dp",
		height: "36dp"
	});
	
	backButton.addEventListener('click', function(e){
		
		// TODO: bevare memory issues!! 
		// TODO: are we creating new eventView each time when we click on tableView?
		// TODO: does this affect memory?
		
		self.hide();
	});
	
	var nameLabel = Ti.UI.createLabel({
		top: "50dp",
		height: "40dp",
		text: data.name,
	})
	
	var locationLabel = Ti.UI.createLabel({
		top: "90dp",
		height: "80dp",
		text: data.location,
	})
	
	var idLabel = Ti.UI.createLabel({
		top: "170dp",
		height: "40dp",
		text: data.id,
	})
	
	self.add(nameLabel);
	self.add(locationLabel);
	self.add(backButton);
	self.add(idLabel);
	
	// TODO: add list of friends who RSVP that
	
	return self;
}