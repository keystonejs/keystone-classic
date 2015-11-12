var React = require('react');
var ReactDOM = require('react-dom');
var Toolbar = require('./Toolbar');

var { Button, FormIconField, FormInput, ResponsiveText } = require('elemental');

var Header = React.createClass({

	displayName: 'ItemViewHeader',

	getInitialState () {
		return {
			searchString: ''
		};
	},

	componentDidUpdate (prevProps, prevState) {
		if (this.state.searchIsVisible && !prevState.searchIsVisible) {
			ReactDOM.findDOMNode(this.refs.searchField).focus();
		}
	},

	toggleCreate (visible) {
		this.props.toggleCreate(visible);
	},

	searchStringChanged (event) {
		this.setState({
			searchString: event.target.value
		});
	},

	handleEscapeKey (event) {
		const escapeKeyCode = 27;

		if (event.which === escapeKeyCode) {
			ReactDOM.findDOMNode(this.refs.searchField).blur();
		}
	},

	renderDrilldown () {
		return (
			<Toolbar.Section left>
				{this.renderDrilldownItems()}
				{this.renderSearch()}
			</Toolbar.Section>
		);
	},

	renderDrilldownItems () {

		var list = this.props.list;
		var items = this.props.data.drilldown ? this.props.data.drilldown.items : [];

		var els = items.map(function(dd) {

			var links = [];

			dd.items.forEach(function(el, i) {
				links.push(<a key={'dd' + i} href={el.href} title={dd.list.singular}>{el.label}</a>);
				if (i < dd.items.length - 1) {
					links.push(<span key={'ds' + i} className="separator">,</span>);//eslint-disable-line comma-spacing
				}
			});

			var more = dd.more ? <span>...</span> : '';

			return (
				<li>
					{links}
					{more}
				</li>
			);

		});

		if (!els.length) {
			return (
				<Button type="link" href={'/keystone/' + list.path}>
					<span className="octicon octicon-chevron-left" />
					{list.plural}
				</Button>
			);
		} else {
			// add the current list
			els.push(
				<li key="back">
					<a type="link" href={'/keystone/' + list.path}>{list.plural}</a>
				</li>
			);
			return <ul className="item-breadcrumbs" key="drilldown">{els}</ul>;
		}

	},

	renderSearch () {
		var list = this.props.list;
		return (
			<form action={'/keystone/' + list.path} className="EditForm__header__search">
				<FormIconField iconPosition="left" iconColor="primary" iconKey="search" className="EditForm__header__search-field">
					<FormInput
						ref="searchField"
						type="search"
						name="search"
						value={this.state.searchString}
						onChange={this.searchStringChanged}
						onKeyUp={this.handleEscapeKey.bind(this)}
						placeholder="Search"
						className="EditForm__header__search-input" />
				</FormIconField>
			</form>
		);
	},

	renderInfo () {
		return (
			<Toolbar.Section right>
				{this.renderCreateButton()}
			</Toolbar.Section>
		);
	},

	renderCreateButton () {
		if (this.props.list.nocreate) return null;

		var props = {};
		if (this.props.list.autocreate) {
			props.href = '?new' + Keystone.csrf.query;
		} else {
			props.onClick = this.toggleCreate.bind(this, true);
		}
		return (
			<Button type="success" {...props}>
				<span className="octicon octicon-plus" />
				<ResponsiveText hiddenXS={`New ${this.props.list.singular}`} visibleXS="Create" />
			</Button>
		);
	},

	render () {
		return (
			<Toolbar>
				{this.renderDrilldown()}
				{this.renderInfo()}
			</Toolbar>
		);
	}

});

module.exports = Header;
