var React = require('react');
var CreateForm = require('../components/CreateForm');
var utils = require('keystone-utils');

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
			<div className="EditForm__header">
				<div className="container">
					{this.renderCreateButton()}
					{this.renderCreateForm()}
				</div>
			</div>
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