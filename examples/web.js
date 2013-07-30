var keystone = require('keystone');

keystone.init({
	
	'name': 'My Project',
	'brand': 'Project Admin',
	
	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',
	
	'views': 'views',
	'view engine': 'jade',
	
	'auto update': true,
	'mongo': process.env.MONGOLAB_URI || ['localhost', 'my-project'],
	
	'auth': true,
	'user model': 'User',
	'cookie secret': '--- your secret ---',
	
	'emails': 'emails',
	'mandrill api key': '--- your api key ---',
	'email rules': { find: '/images/', replace: (keystone.get('env') != 'production') ? 'http://localhost:3000/images/' : 'http://www.team9.com.au/images/' },
	
	'cloudinary config': { cloud_name: '--- your cloud name ---', api_key: '--- your api key ---', api_secret: '--- your api secret ---' }
	
});

require('./models');

keystone.set('routes', require('./routes'));
	
keystone.start();