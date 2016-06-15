/*
 This updates finds the e2e User and sets its properties, including setting the isAdmin property to true.  
 e2e will check that setting in the admin UI.  
 */
exports.options = {
	verbose: true,
	strict: true
};

exports.create = {
	User: [{
		'name.first': 'e2e',
		'name.last': 'user',
		'name.full': 'e2e user',
		email: 'user@test.e2e',
		password: 'test',
		isAdmin: true,
		__ref: 'e2e_user'
	},
	{
		'name.first': 'e2e',
		'name.last': 'member',
		'name.full': 'e2e member',
		email: 'member@test.e2e',
		password: 'test',
		isAdmin: true,
		isMember: true,
		__ref: 'e2e_member'
	}],
};
