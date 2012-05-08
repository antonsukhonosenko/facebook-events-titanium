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
		width: "auto",
		left: (Titanium.Platform.osname==='ipad'?"120dp":"5dp"),
		right: (Titanium.Platform.osname==='ipad'?"120dp":"5dp"),
		backgroundImage: "/images/iphone_title_button_blue.png",
		backgroundFocusedImage: "/images/iphone_title_button_blue_focused.png",
		backgroundSelectedImage: "/images/iphone_title_button_blue_focused.png",
		backgroundColor: "green",
		font: {
			fontSize: 16,
			fontWeight: "bold",
		},
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
};