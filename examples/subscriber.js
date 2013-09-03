var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Subscriber = new keystone.List('Subscriber');

Subscriber.add({
	name: { type: Types.Name },
	email: { type: Types.Email, initial: true },
	isSubscribed: { type: Boolean, default: true, label: 'Currently Subscribed?', initial: true },
	subscribedDate: { type: Date, default: Date.now },
	unsubscribedDate: { type: Date }
});

Subscriber.addPattern('standard meta');

Subscriber.schema.pre('save', function(next) {
	if (this.isModified('subscribed')) {
		if (this.subscribed)
			this.subscribedDate = date.now();
		else
			this.unsubscribedDate = date.now();
	}	
	next();
});

Subscriber.defaultColumns = 'name, email, isSubscribed';
Subscriber.register();