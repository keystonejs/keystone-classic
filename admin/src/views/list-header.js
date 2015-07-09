var React = require('react');
var CreateForm = require('../components/CreateForm');
var Toolbar = require('../components/Toolbar');
var ListHeader = require('../components/ListHeader');

var { Button } = require('elemental');

var Header = React.createClass({
	
	displayName: 'ListHeader',
	
	getInitialState: function() {
		return {
			createIsOpen: Keystone.showCreateForm
		};
	},
	
	toggleCreate: function(visible) {
		this.setState({
			createIsOpen: visible
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
		return <CreateForm list={Keystone.list} isOpen={this.state.createIsOpen} onCancel={this.toggleCreate.bind(this, false)} values={Keystone.createFormData} err={Keystone.createFormErrors} />;
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

React.render(<Header />, document.getElementById('list-view-header'));
