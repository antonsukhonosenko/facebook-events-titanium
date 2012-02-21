exports.LoginView = function(data) {

	var self = Ti.UI.createView({
		top : "0dp",
		height: "100%",
		backgroundColor: "#ccc",
		zIndex: 105
	});

	var buttonFacebookLogin = Ti.UI.createButton({
		title : "Facebook Connect",
		top : (Titanium.Platform.osname==='iphone'?"150dp":"900dp"),
		height : "40dp",
		left: (Titanium.Platform.osname==='iphone'?"5dp":"120dp"),
		right: (Titanium.Platform.osname==='iphone'?"5dp":"120dp"),
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