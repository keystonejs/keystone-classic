var React = require('react');
var ListHeader = require('../components/ListHeader');

var Header = React.createClass({
	displayName: 'Header',
	
	render: function() {
		if (Keystone.list.nocreate) return null;
				
		return <ListHeader />;
	}
	
});

React.render(<Header />, document.getElementById('list-view-header'));
