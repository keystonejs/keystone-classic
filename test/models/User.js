var keystone = require('../../index.js');
var Types = keystone.Field.Types;

var User = new keystone.List('User', {
    autokey: { path: 'key', from: 'name', unique: true },
    track: true
});

User.add({
    name: { type: Types.Name, required: true, index: true },
    email: { type: Types.Email, initial: true, index: true },
    password: { type: Types.Password, initial: true },
    resetPasswordKey: { type: String, hidden: true },
    isAdmin: { type: Types.Boolean }
});

User.schema.virtual('canAccessKeystone').get(function() {
    return this.isAdmin;
});

User.defaultColumns = 'name, email, isAdmin';
User.register();

module.exports = User;
