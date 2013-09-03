var keystone = require('keystone'),
	Types = keystone.Field.Types;

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	isAdmin: { type: Boolean, initial: true }
});

User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.addPattern('standard meta');
User.defaultColumns = 'name, email, isAdmin';
User.register();