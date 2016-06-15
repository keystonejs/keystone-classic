var keystone = require('../../../index.js');
var User = require('./User');

var Member = new keystone.List('Member', {
	inherits: User,
	track: true,
});

Member.register();

module.exports = Member;
