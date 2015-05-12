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
			<ul className="item-breadcrumbs" key="drilldown">
				<li>
					<a href="javascript:;" title={'Search ' + this.props.list.plural} onClick={this.toggleSearch.bind(this, true)}>
						<span className="octicon octicon-search" />
					</a>
				</li>
				{this.renderDrilldownItems()}
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
		
		var backIcon = (!els.length) ? <span className="octicon octicon-chevron-left mr-5" /> : '';
		
		els.push(
			<li key="back">
				<a href={'/keystone/' + list.path} title={'Back to ' + list.plural}>
					{backIcon}
					{list.plural}
				</a>
			</li>
		);
		
		return els;
		
	},
	
	renderSearch: function() {
		if (!this.state.searchIsVisible) return null;
		var list = this.props.list;
		var submitButtonType = this.state.searchIsFocused ? 'primary' : 'default';
		return (
			<div className="searchbox" key="search">
				<form action={'/keystone/' + list.path} className="form-inline searchbox-form">
					<FormIconField iconPosition="left" iconColor="default" iconKey="search" style={{ float: 'left', margin: 0, width: 240 }}>
						<FormInput
							ref="searchField"
							type="search"
							name="search"
							value={this.state.searchString}
							onChange={this.searchStringChanged}
							onFocus={this.searchFocusChanged.bind(this, true)}
							onBlur={this.searchFocusChanged.bind(this, false)}
							placeholder={'Search ' + list.plural} />
					</FormIconField>
					<Button type="link-cancel" onClick={this.toggleSearch.bind(this, false)}>Cancel</Button>
				</form>
			</div>
		);
	},
	
	renderInfo: function() {
		return (
			<ul className="item-toolbar-info">
				{this.renderKeyOrId()}
				{this.renderCreateButton()}
			</ul>
		);
	},
	
	renderKeyOrId: function() {
		var list = this.props.list;
		if (list.autokey && this.props.data[list.autokey.path]) {
			return (
				<li>
					<AltText
						normal={list.autokey.path + ': ' + this.props.data[list.autokey.path]}
						modified={'id: ' + this.props.data.id}
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
				<Button type="link" onClick={this.toggleCreate.bind(this, true)} className="item-toolbar-create-button">
					<span className="octicon octicon-plus mr-5" />
					New {this.props.list.singular}
				</Button>
			</li>
		);
		/* eslint-enable */
	},
	
	render: function() {
		return (
			<div>
				<div className="item-toolbar item-toolbar--header hidden-xs">
					<ReactCSSTransitionGroup transitionName="ToolbarToggle" className="ToolbarToggle-wrapper" component="div">
						{this.renderDrilldown()}
						{this.renderSearch()}
					</ReactCSSTransitionGroup>
					{this.renderInfo()}
				</div>
			</div>
		);
	}
	
});

module.exports = Header;
