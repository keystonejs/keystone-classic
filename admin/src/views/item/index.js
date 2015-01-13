var React = require('react'),
	EditForm = require('./EditForm'),
	Toolbar = require('./Toolbar');

module.exports = {
	render: function(view) {
		React.render(<Toolbar list={view.list} data={view.item} drilldown={view.drilldown} />, document.getElementById('item-toolbar'));
		React.render(<EditForm list={view.list} data={view.item} />, document.getElementById('item-form'));
	}
};
