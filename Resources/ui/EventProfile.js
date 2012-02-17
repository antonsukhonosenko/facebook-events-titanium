/**
 * @author Anton Sukhonosenko
 */

exports.EventProfile = function(data) {

	// TODO: add back button

	var self = Ti.UI.createView({
		top : "0dp",
		height : "480dp",
		backgroundColor : "fff",
	});
	
	var nameLabel = Ti.UI.createLabel({
		top: "0dp",
		height: "40dp",
		text: data.name,
	})
	
	var locationLabel = Ti.UI.createLabel({
		top: "40dp",
		height: "80dp",
		text: data.location,
	})
	
	self.add(nameLabel);
	self.add(locationLabel);
	
	// TODO: add list of friends who RSVP that
	
	return self;
}