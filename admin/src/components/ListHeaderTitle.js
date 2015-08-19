import classnames from 'classnames';
import React from 'react';

var Transition = React.addons.CSSTransitionGroup;
var CurrentListStore = require('../stores/CurrentListStore');
var Popout = require('./Popout');
var PopoutList = require('./PopoutList');

var ListHeaderTitle = React.createClass({
	displayName: 'ListHeaderTitle',
	propTypes: {
		activeSort: React.PropTypes.object,
		invertSort: React.PropTypes.bool,
		popoutIsOpen: React.PropTypes.bool,
		title: React.PropTypes.string,
		openPopout: React.PropTypes.func,
		closePopout: React.PropTypes.func,
		onColumnSelect: React.PropTypes.func,
	},
	renderColumns () {
		return CurrentListStore.getAvailableColumns().map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.label}</PopoutList.Heading>;
			}

			let path = el.field.path;
			let isSelected = this.props.activeSort.path === path;

			return (
				<PopoutList.Item
					key={'column_' + el.field.path}
					icon={isSelected ? (this.props.invertSort ? 'chevron-up' : 'chevron-down') : 'dash'}
					isSelected={isSelected}
					label={el.field.label}
					onClick={() => { this.props.onColumnSelect(path); }} />
			);
		});
	},
	render () {
		return (
			<div>
				<h2 className="ListHeader__title">
					{this.props.title}
					<span> sorted by </span>
					<a id="listHeaderSortButton" href="javascript:;" onClick={this.props.openPopout}>
						{this.props.activeSort.label.toLowerCase()}
						<span className="disclosure-arrow" />
					</a>
				</h2>
				<Popout isOpen={this.props.popoutIsOpen} onCancel={this.props.closePopout} relativeToID="listHeaderSortButton">
					<Popout.Header title="Sort" />
					<Popout.Body scrollable>
						<PopoutList>
							{this.renderColumns()}
						</PopoutList>
					</Popout.Body>
				</Popout>
			</div>
		);
	}
});

module.exports = ListHeaderTitle;
