//Application Window Component Constructor
exports.ApplicationWindow = function() {
	
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		fullscreen: false,
		exitOnClose: true,
	});
	
	self.addEventListener('facebook_login', function(e) {
		alert(e);
	});
	
	var buttonFacebookLogout = Ti.UI.createButton({
		title: "Facebook Disconnect",
		top: "150dp",
		height: "36dp"		
	});
	
	buttonFacebookLogout.addEventListener('click', function(e){
		Titanium.Facebook.logout();
		Titanium.Facebook.authorize();	
	});
	
	self.add(buttonFacebookLogout);
	
	Titanium.Facebook.appid = '187742787964643';
	Titanium.Facebook.permissions = ['publish_stream'];
	// Permissions your app needs
	Titanium.Facebook.addEventListener('login', function(e) {
		if(e.success) {
			alert('Logged In');
			Titanium.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
				if(e.success) {
					alert(e.result);
					Ti.App.fireEvent('facebook_login', e.result);
				} else if(e.error) {
					alert(e.error);
				} else {
					alert('Unknown response');
				}
			});
		} else if(e.error) {
			alert(e.error);
		} else if(e.cancelled) {
			alert("Cancelled");
		}
	});
	
	Titanium.Facebook.authorize();
	
	return self;
};