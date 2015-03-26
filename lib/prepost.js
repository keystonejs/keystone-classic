'use strict';

var _ = require( 'underscore' ),
	async = require('async');

function init(){
    this.__prepost = {
        pre  : {},
        post : {}
    };
}

function addEventListener(context, type, args){
	var event = args.shift(),
		fn = _.flatten(args);
	if( !context.__prepost[type][event] ){
		throw new Error('Event ' + event + ' is not supported.');
	}
	var handlers = context.__prepost[type]; 
	handlers[event] = handlers[event].concat(fn);
}
var methods = {
	/**
	 * Registers a pre-event handler.
	 *
	 * Valid events include:
	 * - `routes` - calls the function before any routes are matched, after all other middleware
	 *
	 * @param {String} event
	 * @param {Function} fn function to call
	 * @api public
	 */
	
    pre: function( event,
                         fn ){
		addEventListener(this, 'pre', _.toArray(arguments));
        return this;
    },
    post: function( event,
                         fn ){
		addEventListener(this, 'post', _.toArray(arguments));
        return this;
    },
    register : function( types ){
		var args = _.flatten(_.toArray(arguments));
		_.each(args, function(event){
			var temp = event.split(':'),
				type = temp[0],
				eventName = temp[1];
			if( !this.__prepost[ type ] ){
				throw new Error( "Only 'pre' and 'post' types are allowed, not '"+type+"'" );
			}
				this.__prepost[type][eventName] = [];
		}, this);
    },
	hooks : function(event, iterator, done){
		var temp = event.split(':'),
			type = temp[0],
			eventName = temp[1];
		async.eachSeries(this.__prepost[type][eventName], iterator, done);
	}
};

function mixin( instance ){
    init.call( instance );
    _.extend( instance, methods );
    return instance;
}

function create(){
    return mixin( {} );
}

module.exports = {
    mixin  : mixin,
    create : create
};
