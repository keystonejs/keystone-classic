var React = require('react');
var utils = require('keystone-utils');
var CreateForm = require('../components/CreateForm');
var Toolbar = require('../components/Toolbar');
var ListHeader = require('../components/ListHeader');

var Button = require('elemental').Button;
var Dropdown = require('elemental').Dropdown;

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
		var props = { type: 'success' };
		if (Keystone.list.autocreate) {
			props.href = '?new' + Keystone.csrf.query;
		} else {
			props.onClick = this.toggleCreate.bind(this, true);
		}
		return (
			<Button {...props}>
				<span className="octicon octicon-plus" />
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
			<div>
				<Toolbar>
					<Toolbar.Section left>
						{this.renderCreateButton()}
						{this.renderCreateForm()}
					</Toolbar.Section>
					<Toolbar.Section right>
						<Button type="link">
							<span className="octicon octicon-cloud-download" />
							Download
						</Button>
					</Toolbar.Section>
				</Toolbar>
				<ListHeader />
			</div>
		);
	}
	
});

React.render(<View />, document.getElementById('list-view'));
