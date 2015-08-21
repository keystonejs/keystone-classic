import blacklist from 'blacklist';
import classnames from 'classnames';
import React from 'react';

var PopoutListItem = React.createClass({
	displayName: 'PopoutListItem',
	propTypes: {
		icon: React.PropTypes.string,
		iconHover: React.PropTypes.string,
		iconHoverAlt: React.PropTypes.string,
		isSelected: React.PropTypes.bool,
		label: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func,
	},
	getInitialState () {
		return {
			currentIcon: this.props.icon
		};
	},
	setToActive (e) {
		this.setState({ currentIcon: e.altKey ? this.props.iconHoverAlt : this.props.iconHover });
	},
	setToInactive (e) {
		this.setState({ currentIcon: this.props.icon });
	},
	renderIcon () {
		if (!this.props.icon) return null;
		let iconClassname = classnames('PopoutList__item__icon octicon', ('octicon-' + this.state.currentIcon));

		return <span className={iconClassname} />;
	},
	render () {
		let itemClassname = classnames('PopoutList__item', {
			'is-selected': this.props.isSelected
		});
		let props = blacklist(this.props, 'className', 'icon', 'isSelected', 'label');
		return (
			<button
				type="button"
				title={this.props.label}
				className={itemClassname}
				onFocus={this.setToActive}
				onBlur={this.setToInactive}
				onMouseOver={this.setToActive}
				onMouseOut={this.setToInactive}
				{...props}
				>
				{this.renderIcon()}
				<span className="PopoutList__item__label">{this.props.label}</span>
			</button>
		);
	}
});

module.exports = PopoutListItem;
