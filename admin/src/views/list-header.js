var React = require('react');
var CreateForm = require('../components/CreateForm');
var DownloadForm = require('../components/DownloadForm');
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
	
	toggleCreateModal: function(visible) {
		this.setState({
			createIsOpen: visible
		});
	},
	
	toggleDownloadModal: function(visible) {
		this.setState({
			downloadIsOpen: visible
		});
	},
	
	renderCreateButton: function() {
		var props = { type: 'success' };
		if (Keystone.list.autocreate) {
			props.href = '?new' + Keystone.csrf.query;
		} else {
			props.onClick = this.toggleCreateModal.bind(this, true);
		}
		return (
			<Button {...props}>
				<span className="octicon octicon-plus" />
				Create {Keystone.list.singular}
			</Button>
		);
	},
	
	renderCreateForm: function() {
		return <CreateForm list={Keystone.list} isOpen={this.state.createIsOpen} onCancel={this.toggleCreateModal.bind(this, false)} values={Keystone.createFormData} err={Keystone.createFormErrors} />;
	},
	
	renderDownloadButton: function() {
		return (
			<Button type="link" onClick={this.toggleDownloadModal.bind(this, true)}>
				<span className="octicon octicon-cloud-download" />
				Download CSV/JSON
			</Button>
		);
	},
	
	renderDownloadForm: function() {
		return <DownloadForm list={Keystone.list} isOpen={this.state.downloadIsOpen} onCancel={this.toggleDownloadModal.bind(this, false)} />;
	},
	
	render: function() {
		if (Keystone.list.nocreate) return null;
		return (
			<div>
				<Toolbar>
					<Toolbar.Section left>
						{this.renderCreateButton()}
					</Toolbar.Section>
					<Toolbar.Section right>
						{this.renderDownloadButton()}
					</Toolbar.Section>
				</Toolbar>
				<ListHeader />
				{this.renderCreateForm()}
				{this.renderDownloadForm()}
			</div>
		);
	}
	
});

React.render(<Header />, document.getElementById('list-view-header'));
