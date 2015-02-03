var React = require('react'),
	CreateForm = require('../../components/CreateForm'),
	EditForm = require('../../components/EditForm'),
	Header = require('./Header');

var View = React.createClass({
	
	displayName: 'ItemView',
	
	getInitialState: function() {
		return {
			createIsVisible: false
		};
	},
	
	toggleCreate: function(visible) {
		this.setState({
			createIsVisible: visible
		});
	},
	
	renderCreateForm: function() {
		if (!this.state.createIsVisible) return null;
		return <CreateForm list={Keystone.list} animate onCancel={this.toggleCreate.bind(this, false)} />
	},
	
	render: function() {
		return (
			<div>
				{this.renderCreateForm()}
				<Header list={Keystone.list} data={Keystone.item} drilldown={Keystone.drilldown} toggleCreate={this.toggleCreate} />
				<EditForm list={Keystone.list} data={Keystone.item} />
			</div>
		);
	}
	
});

exports.render = function() {
	React.render(<View />, document.getElementById('item-view'));
};
