var React = require('react');

var Table = React.createClass({
	
	displayName: 'ListTable',
	
	render: function() {
		return (
			<div>
				Table will go here.
			</div>
		);
	}
	
});

var target = document.getElementById('list-view-table');
if (target) {
	React.render(<Table />, target);
}
