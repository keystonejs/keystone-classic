module.exports = function initViewEngine (keystone, app) {
	// Allow usage of custom view engines
	if (this.get('custom engine')) {
		app.engine(this.get('view engine'), this.get('custom engine'));
	}

	// Set location of view templates and view engine
	app.set('views', this.getPath('views') || path.sep + 'views');
	app.set('view engine', this.get('view engine'));
};
