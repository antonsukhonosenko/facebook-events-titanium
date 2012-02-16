//Application Window Component Constructor
exports.LoginWindow = function() {

	var self = Ti.UI.createWindow({
		backgroundColor : '#fff',
		fullscreen : false,
		exitOnClose : true,
	});

	
	return self;
};
