import classnames from 'classnames';
import CurrentListStore from '../stores/CurrentListStore';
import Popout from './Popout';
import PopoutList from './PopoutList';
import React from 'react';
import vkey from 'vkey';
import { FormNote } from 'elemental';

const Transition = React.addons.CSSTransitionGroup;

var ListHeaderTitle = React.createClass({
	displayName: 'ListHeaderTitle',
	propTypes: {
		activeSort: React.PropTypes.object,
		invertSort: React.PropTypes.bool,
		popoutIsOpen: React.PropTypes.bool,
		title: React.PropTypes.string,
		openPopout: React.PropTypes.func,
		closePopout: React.PropTypes.func,
		onSortChange: React.PropTypes.func,
	},
	renderColumns () {
		// TODO: Handle multiple sort paths
		let { activeSort } = this.props;
		let activeSortPath = activeSort && activeSort.paths.length && activeSort.paths[0];

		return CurrentListStore.getAvailableColumns().map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.label}</PopoutList.Heading>;
			}

			let path = el.field.path;
			let isSelected = activeSortPath && activeSortPath.path === path;
			let isInverted = isSelected && activeSortPath.inverted;

			return (
				<PopoutList.Item
					key={'column_' + el.field.path}
					icon={isSelected ? (isInverted ? 'chevron-up' : 'chevron-down') : 'dash'}
					iconHover={isSelected ? (isInverted ? 'chevron-down' : 'chevron-up') : 'chevron-down'}
					iconHoverAlt={isSelected ? (isInverted ? 'chevron-up' : 'chevron-down') : 'chevron-up'}
					isSelected={isSelected}
					label={el.field.label}
					onClick={(e) => { this.props.onSortChange(e, path); }} />
			);
		});
	},
	renderSort () {
		// TODO: Handle multiple sort paths
		let { activeSort } = this.props;
		if (!activeSort || !activeSort.paths.length) return;
		let activeSortPath = activeSort.paths[0];

		return (
			<span>
			 	<span className="ListHeader__sortedby"> sorted by </span>
				<a id="listHeaderSortButton" href="javascript:;" onClick={this.props.openPopout}>
					{activeSortPath.label.toLowerCase()}
					{activeSortPath.invert ? ' (descending)' : ''}
					<span className="disclosure-arrow" />
				</a>
			</span>
		)
	},
	render () {
		return (
			<div>
				<h2 className="ListHeader__title">
					{this.props.title}
					{this.renderSort()}
				</h2>
				<Popout isOpen={this.props.popoutIsOpen} onCancel={this.props.closePopout} relativeToID="listHeaderSortButton">
					<Popout.Header title="Sort" />
					<Popout.Body scrollable>
						<PopoutList>
							{this.renderColumns()}
						</PopoutList>
					</Popout.Body>
					<Popout.Footer>
						<FormNote>Hold <kbd>alt</kbd> to toggle ascending/descending</FormNote>
					</Popout.Footer>
				</Popout>
			</div>
		);
	}
});

module.exports = ListHeaderTitle;
