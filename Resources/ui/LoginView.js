exports.LoginView = function(data) {

	var self = Ti.UI.createView({
		top : "0dp",
		height: "100%",
		backgroundColor: "#ccc",
		zIndex: 105
	});

	var buttonFacebookLogin = Ti.UI.createButton({
		title : "Facebook Connect",
		top : (Titanium.Platform.osname==='ipad'?"900dp":"150dp"),
		height : "40dp",
		left: (Titanium.Platform.osname==='ipad'?"120dp":"5dp"),
		right: (Titanium.Platform.osname==='ipad'?"120dp":"5dp"),
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