var React = require('react');
var utils = require('keystone-utils');
var CreateForm = require('../components/CreateForm');
var Toolbar = require('../components/Toolbar');

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
				<span className="octicon octicon-plus mr-5" />
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
			<Toolbar>
				<Toolbar.Section left>
					{this.renderCreateButton()}
					{this.renderCreateForm()}
				</Toolbar.Section>
				<Toolbar.Section right>
					<Button type="link">
						<span className="octicon octicon-clock mr-5" />
						Recent Filters
					</Button>
					<Button type="link">
						<span className="octicon octicon-cloud-download mr-5" />
						Download
					</Button>
				</Toolbar.Section>
			</Toolbar>
		);
	}
	
});




/*
	==============================
	SORT DROPDOWN
	==============================
*/

var ListSortDropdown = React.createClass({
	
	displayName: 'ListSortDropdown',
	
	getInitialState: function() {
		return {};
	},

	menuItems: function() {
		return Keystone.list.uiElements.map(function(item, i) {
			if (item.type === 'heading') {
				return { type: 'header', label: item.content };
			} else {
				return { type: 'item', label: utils.titlecase(item.field) };
			}
		});
	},
	
	renderDropdown: function() {
		var sort = Keystone.sort;
		var buttonLabel = 'sort by';

		if (sort.label) {
			buttonLabel = sort.label.toLowerCase();

			if (sort.inv) {
				buttonLabel += ' (descending)';
			}
		}

		return (
			<Dropdown items={this.menuItems()} component='span'>
				<a href="javascript:;">{buttonLabel}</a>
			</Dropdown>
		);
	},
	
	render: function() {
		return this.renderDropdown();
	}
	
});

React.render(<View />, document.getElementById('list-view'));
React.render(<ListSortDropdown />, document.getElementById('list-sort-dropdown'));