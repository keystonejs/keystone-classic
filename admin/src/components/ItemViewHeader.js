var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var AltText = require('./AltText');

var FormInput = require('elemental').FormInput;
var FormIconField = require('elemental').FormIconField;
var InputGroup = require('elemental').InputGroup;
var Button = require('elemental').Button;

var Header = React.createClass({
	
	displayName: 'ItemViewHeader',
	
	getInitialState: function() {
		return {
			searchIsVisible: false,
			searchIsFocused: false,
			searchString: ''
		};
	},
	
	componentDidUpdate: function(prevProps, prevState) {
		if (this.state.searchIsVisible && !prevState.searchIsVisible) {
			this.refs.searchField.getDOMNode().focus();
		}
	},
	
	toggleCreate: function(visible) {
		this.props.toggleCreate(visible);
	},
	
	toggleSearch: function(visible) {
		this.setState({
			searchIsVisible: visible,
			searchIsFocused: visible,
			searchString: ''
		});
	},
	
	searchFocusChanged: function(focused) {
		this.setState({
			searchIsFocused: focused
		});
	},
	
	searchStringChanged: function(event) {
		this.setState({
			searchString: event.target.value
		});
	},
	
	renderDrilldown: function() {
		if (this.state.searchIsVisible) return null;
		/* eslint-disable no-script-url */
		return (
			<ul className="item-header__left item-header__list item-breadcrumbs" key="drilldown">
				{this.renderDrilldownItems()}
				<li className="hidden-xs">
					{this.renderSearch()}
				</li>
			</ul>
		);
		/* eslint-enable */
	},
	
	renderDrilldownItems: function() {
		
		var list = this.props.list,
			items = this.props.drilldown.items;
		
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
		
		var backIcon = (!els.length) ? <span className="octicon octicon-list-unordered mr-5" /> : '';
		
		els.push(
			<li key="back">
				<Button type="link" href={'/keystone/' + list.path}>
					{backIcon}
					All {list.plural}
				</Button>
			</li>
		);
		
		return els;
		
	},
	
	renderSearch: function() {
		var list = this.props.list;
		return (
			<form action={'/keystone/' + list.path} className="item-header__search">
				<FormIconField iconPosition="left" iconColor="default" iconKey="search" className="item-header__search-field">
					<FormInput
						ref="searchField"
						type="search"
						name="search"
						value={this.state.searchString}
						onChange={this.searchStringChanged}
						onFocus={this.searchFocusChanged.bind(this, true)}
						onBlur={this.searchFocusChanged.bind(this, false)}
						placeholder="Search"
						className="item-header__search-input" />
				</FormIconField>
			</form>
		);
	},
	
	renderInfo: function() {
		return (
			<ul className="item-header__right item-header__list">
				{this.renderKeyOrId()}
				{this.renderCreateButton()}
			</ul>
		);
	},
	
	renderKeyOrId: function() {
		var list = this.props.list;
		if (list.autokey && this.props.data[list.autokey.path]) {
			var autokeyLabel = list.autokey.path.substr(0,1).toUpperCase() + list.autokey.path.substr(1) + ': ';
			return (
				<li className="hidden-xs">
					<AltText
						normal={autokeyLabel + this.props.data[list.autokey.path]}
						modified={'ID: ' + this.props.data.id}
						className="item-header__list-text"
					/>
				</li>	
			);
		}
		return <li>id: {this.props.data.id}</li>;
	},
	
	renderCreateButton: function() {
		if (this.props.list.nocreate) return null;
		/* eslint-disable no-script-url */
		return (
			<li>
				<Button type="link-success" onClick={this.toggleCreate.bind(this, true)}>
					<span className="octicon octicon-plus mr-5" />
					New {this.props.list.singular}
				</Button>
			</li>
		);
		/* eslint-enable */
	},
	
	render: function() {
		return (
			<div className="item-header">
				<div className="container">
					{this.renderDrilldown()}
					{this.renderInfo()}
				</div>
			</div>
		);
	}
	
});

module.exports = Header;
