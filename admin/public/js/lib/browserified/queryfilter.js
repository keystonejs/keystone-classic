require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AMt3wp":[function(require,module,exports){
(function(){
	// QueryFilter
	var QueryFilter = function(data){
		this.parse(data);
		return this;
	};
	QueryFilter.create = function(data){
		return new QueryFilter(data);
	};

	QueryFilter.prototype.inverse = false;
	QueryFilter.prototype.exact = false;
	QueryFilter.prototype.name = null;
	QueryFilter.prototype.key = null;
	QueryFilter.prototype.type = null;
	QueryFilter.prototype.operator = null;
	QueryFilter.prototype.value = null;
	QueryFilter.prototype.names = {
		inverse: 'does not',
		exact: 'exactly',
		match: 'matches',
		matchInverse: 'match',
		gtOperator: 'greater than',
		ltOperator: 'less than',
		btOperator: 'between'
	};

	QueryFilter.prototype.parse = function(data){
		if ( typeof data === 'string' ) {
			this.fromString(data);
		} else {
			this.fromObject(data);
		}
		return this;
	};

	QueryFilter.prototype.toString = function(){
		var queryParts = [];
		queryParts.push(this.key);
		if ( this.type )               queryParts.push('$'+this.type);
		if ( this.inverse === true )   queryParts.push('!');
		if ( this.exact === true )     queryParts.push('=');
		if ( this.operator )           queryParts.push(this.operator);
		if ( Array.isArray(this.value) === true ) {
			queryParts.push.apply(queryParts, this.value);
		} else {
			queryParts.push(this.value.toString());
		}
		return queryParts.join(':');
	};

	QueryFilter.prototype.fromString = function(queryString){
		var me = this;
		var queryParts = queryString.split(':');
		this.inverse = false;
		this.exact = false;
		this.key = queryParts.shift();
		var values = [];
		queryParts.forEach(function(value){
			if ( value === '!' ) {
				me.inverse = true;
			}
			else if ( value === '=' ) {
				me.exact = true;
			}
			else if ( value[0] === '$' ) {
				me.type = value.substr(1);
			}
			else if ( me.names[value+'Operator'] != null ) {
				me.operator = value;
			}
			else {
				values.push(value);
			}
		});
		if ( values.length === 1 ) {
			this.value = values[0];
		} else {
			this.value = values;
		}
		return this;
	};

	QueryFilter.prototype.fromObject = function(data){
		var me = this;
		Object.keys(data || {}).forEach(function(key){
			me[key] = data[key];
		});
	};

	QueryFilter.prototype.toHumanString = function(){
		var converseParts = [];
		converseParts.push(this.name || this.key);
		
		if ( this.inverse === true ) {
			converseParts.push(this.names.inverse);
		}
		
		if ( this.exact === true ) {
			converseParts.push(this.names.exact);
		}
		
		if ( this.inverse === true ) {
			converseParts.push(this.names.matchInverse);
		} else {

			converseParts.push(this.names.match);
		}

		if ( this.operator ) {
			converseParts.push(this.names[this.operator+'Operator']);
		}

		var value = this.value;
		if ( Array.isArray(value) ) {
			if ( this.type === 'location' ) {
				value = value.join(', ');
			} else {
				value = value.join(' and ');
			}
		} else {
			value = value.toString();
		}

		converseParts.push(value);
		return converseParts.join(' ');
	};

	// QueryFilters
	var QueryFilters = function(data){
		this.filters = [];
		this.parse(data);
		return this;
	};
	QueryFilters.create = function(data){
		return new QueryFilters(data);
	};
	QueryFilters.prototype.getFilters = function(){
		return this.filters;
	};
	QueryFilters.prototype.parse = function(data){
		if ( typeof data === 'string' ) {
			this.fromString(data);
		} else if ( Array.isArray(data) ) {
			this.fromArray(data);
		}
		return this;
	};
	QueryFilters.prototype.fromString = function(data){
		this.filters = data.split(';').map(function(filter){
			return new QueryFilter(filter);
		});
		return this;
	};
	QueryFilters.prototype.fromArray = function(data){
		this.filters = data.map(function(filter){
			if ( filter instanceof QueryFilter )  return filter;
			return new QueryFilter(filter);
		});
	};
	QueryFilters.prototype.toString = function(){
		return this.filters.map(function(filter){
			return filter.toString();
		}).join(';');
	};
	QueryFilters.prototype.toHumanString = function(){
		return this.filters.map(function(filter){
			return filter.toHumanString();
		}).join(' and ');
	};

	// Export
	module.exports.QueryFilter = QueryFilter;
	module.exports.QueryFilters = QueryFilters;
})()

},{}],"queryfilter":[function(require,module,exports){
module.exports=require('AMt3wp');
},{}]},{},[])
