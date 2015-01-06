var _ = require('underscore'),
	React = require('react'),
	Fields = require('../../fields');

var Toolbar = React.createClass({
	
	displayName: 'Toolbar',
	
	getInitialState: function() {
		return {
			searchIsVisible: true,
			searchString: ''
		};
	},
	
	toggleSearch: function(on) {
		this.setState({
			searchIsVisible: on
		});
	},
	
	renderDrilldown: function() {
		if (this.state.searchIsVisible) return null;
		return (
			<ul className="item-breadcrumbs">
				<li>
					<a href="javascript:;" title={'Search ' + this.props.list.plural} onClick={this.toggleSearch.bind(this, true)}>
						<span className="ion-search"></span>
					</a>
				</li>
				{this.renderDrilldownItems()}
			</ul>
		);
	},
	
	renderDrilldownItems: function() {
		
		var list = this.props.list,
			items = this.props.drilldown.items;
		
		var els = items.map(function(dd) {
			
			var links = [];
			
			dd.items.forEach(function(el, i) {
				links.push(<a href={el.href} title={dd.list.singular}>{el.label}</a>);
				if (i < dd.items.length - 1) {
					links.push(<span>,</span>);
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
		
		var backIcon = (!els.length) ? <span className="mr-5 ion-arrow-left-c"></span> : '';
		
		els.push(
			<li>
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
		return (
			<div className="searchbox">
				<form action={'/keystone/' + list.path} className="form-inline searchbox-form">
					<div className="searchbox-field">
						<input type="search" name="search" placeholder={'Search ' + list.plural} className="form-control searchbox-input" />
					</div>
					<div className="searchbox-button">
						<button type="submit" className="btn btn-default searchbox-submit">Search</button>
					</div>
					<button type="button" className="btn btn-link btn-cancel" onClick={this.toggleSearch.bind(this, false)}>Cancel</button>
				</form>
			</div>
		);
	},
	
	renderInfo: function() {
		return (
			null
		);
	},
	
	renderCreateButton: function() {
		return (
			null
		);
	},
	
	render: function() {
		return (
			<div>
				{this.renderDrilldown()}
				{this.renderSearch()}
				{this.renderInfo()}
				{this.renderCreateButton()}
			</div>
		);
	}
	
});

module.exports = Toolbar;
