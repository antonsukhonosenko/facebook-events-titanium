exports.LoginView = function(data) {

	var self = Ti.UI.createView({
		top : "0dp",
		height: "480dp",
		backgroundColor: "#ccc",
		zIndex: "100"
	});

	var buttonFacebookLogin = Ti.UI.createButton({
		title : "Facebook Connect",
		top : "150dp",
		height : "36dp"
	});

	buttonFacebookLogin.addEventListener('click', function() {
		if(Titanium.Facebook.loggedIn) {
			self.hide();
		} else {
			Titanium.Facebook.authorize();
		}
	});

	self.add(buttonFacebookLogin);

	return self;
}