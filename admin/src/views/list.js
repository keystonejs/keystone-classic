var React = require('react');
var CreateForm = require('../components/CreateForm');

var Button = require('elemental').Button;

var View = React.createClass({
	
	displayName: 'ListView',
	
	getInitialState: function() {
		return {
			createIsVisible: Keystone.showCreateForm,
			animateCreateForm: false
		};
	},
	
	toggleCreate: function(visible) {
		this.setState({
			createIsVisible: visible,
			animateCreateForm: true
		});
	},
	
	renderCreateButton: function() {
		if (Keystone.list.autocreate) {
			return (
				<Button type="success" href={'?new' + Keystone.csrf.query}>
					<span className="octicon octicon-plus mr-5 mr-5" />
					Create {Keystone.list.singular}
				</Button>
			);
		}
		return (
			<Button type="success" onClick={this.toggleCreate.bind(this, true)}>
				<span className="octicon octicon-plus mr-5 mr-5" />
				Create {Keystone.list.singular}
			</Button>
		);
	},
	
	renderCreateForm: function() {
		if (!this.state.createIsVisible) return null;
		return <CreateForm list={Keystone.list} animate={this.state.animateCreateForm} onCancel={this.toggleCreate.bind(this, false)} values={Keystone.createFormData} err={Keystone.createFormErrors} />;
	},
	
	render: function() {
		if (Keystone.list.nocreate) return null;
		return (
			<div className="toolbar toolbar--create">
				{this.renderCreateButton()}
				{this.renderCreateForm()}
			</div>
		);
	}
	
});

React.render(<View />, document.getElementById('list-view'));
