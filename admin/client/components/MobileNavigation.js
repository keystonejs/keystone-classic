import React from 'react';
import Transition from 'react-addons-css-transition-group';

var MobileListItem = React.createClass({
	displayName: 'MobileListItem',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		href: React.PropTypes.string.isRequired,
	},
	render () {
		return (
			<a className={this.props.className} href={this.props.href} tabIndex="-1">
				{this.props.children}
			</a>
		);
	},
});

var MobileSectionItem = React.createClass({
	displayName: 'MobileSectionItem',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		currentListKey: React.PropTypes.string,
		href: React.PropTypes.string.isRequired,
		lists: React.PropTypes.array,
	},
	renderLists () {
		if (!this.props.lists || this.props.lists.length <= 1) return null;

		let navLists = this.props.lists.map((item) => {
			let href = item.external ? item.path : `${Keystone.adminPath}/${item.path}`;
			let className = (this.props.currentListKey && this.props.currentListKey === item.path) ? 'MobileNavigation__list-item is-active' : 'MobileNavigation__list-item';

			return (
				<MobileListItem key={item.path} href={href} className={className}>
					{item.label}
				</MobileListItem>
			);
		});

		return (
			<div className="MobileNavigation__lists">
				{navLists}
			</div>
		);
	},
	render () {
		return (
			<div className={this.props.className}>
				<a className="MobileNavigation__section-item" href={this.props.href} tabIndex="-1">
					{this.props.children}
				</a>
				{this.renderLists()}
			</div>
		);
	},
});

var MobileNavigation = React.createClass({
	displayName: 'MobileNavigation',
	propTypes: {
		brand: React.PropTypes.string,
		currentListKey: React.PropTypes.string,
		currentSectionKey: React.PropTypes.string,
		sections: React.PropTypes.array.isRequired,
		signoutUrl: React.PropTypes.string,
	},
	getInitialState () {
		return {
			barIsVisible: false,
		};
	},
	componentDidMount () {
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount () {
		window.removeEventListener('resize', this.handleResize);
	},
	handleResize () {
		this.setState({
			barIsVisible: window.innerWidth < 768,
		});
	},
	toggleMenu () {
		this[this.state.menuIsVisible ? 'hideMenu' : 'showMenu']();
	},
	showMenu () {
		this.setState({
			menuIsVisible: true,
		});

		document.body.style.overflow = 'hidden';
		document.body.addEventListener('keyup', this.handleEscapeKey, false);
	},
	hideMenu () {
		this.setState({
			menuIsVisible: false,
		});

		document.body.style.overflow = null;
		document.body.removeEventListener('keyup', this.handleEscapeKey, false);
	},
	handleEscapeKey (event) {
		const escapeKeyCode = 27;

		if (event.which === escapeKeyCode) {
			this.hideMenu();
		}
	},
	renderNavigation () {
		if (!this.props.sections || !this.props.sections.length) return null;

		return this.props.sections.map((section) => {
			let href = section.lists[0].external ? section.lists[0].path : `${Keystone.adminPath}/${section.lists[0].path}`;
			let className = (this.props.currentSectionKey && this.props.currentSectionKey === section.key) ? 'MobileNavigation__section is-active' : 'MobileNavigation__section';

			return (
				<MobileSectionItem key={section.key} className={className} href={href} lists={section.lists} currentListKey={this.props.currentListKey}>
					{section.label}
				</MobileSectionItem>
			);
		});
	},
	renderBlockout () {
		if (!this.state.menuIsVisible) return null;

		return <div className="MobileNavigation__blockout" onClick={this.toggleMenu} />;
	},
	renderMenu () {
		if (!this.state.menuIsVisible) return null;

		return (
			<nav className="MobileNavigation__menu">
				<div className="MobileNavigation__sections">
					{this.renderNavigation()}
				</div>
			</nav>
		);
	},
	render () {
		if (!this.state.barIsVisible) return null;

		return (
			<div className="MobileNavigation">
				<div className="MobileNavigation__bar">
					<button type="button" onClick={this.toggleMenu} className="MobileNavigation__bar__button MobileNavigation__bar__button--menu">
						<span className={'MobileNavigation__bar__icon octicon octicon-' + (this.state.menuIsVisible ? 'x' : 'three-bars')} />
					</button>
					<span className="MobileNavigation__bar__label">{this.props.brand}</span>
					<a href={this.props.signoutUrl} className="MobileNavigation__bar__button MobileNavigation__bar__button--signout">
						<span className="MobileNavigation__bar__icon octicon octicon-sign-out" />
					</a>
				</div>
				<div className="MobileNavigation__bar--placeholder" />
				<Transition transitionName="MobileNavigation__menu" transitionEnterTimeout={260} transitionLeaveTimeout={200}>
					{this.renderMenu()}
				</Transition>
				<Transition transitionName="react-transitiongroup-fade">
					{this.renderBlockout()}
				</Transition>
			</div>
		);
	},
});

module.exports = MobileNavigation;
