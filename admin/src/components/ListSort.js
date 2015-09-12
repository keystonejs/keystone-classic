import { FormNote } from 'elemental';
import classNames from 'classnames';
import React from 'react';
import Popout from './Popout';
import PopoutList from './PopoutList';

import CurrentListStore from '../stores/CurrentListStore';

const Transition = React.addons.CSSTransitionGroup;

var ListSort = React.createClass({
	displayName: 'ListSort',
	getInitialState () {
		return {
			popoutIsOpen: false,
			...this.getStateFromStore()
		};
	},
	componentDidMount () {
		CurrentListStore.addChangeListener(this.updateStateFromStore);
	},
	componentWillUnmount () {
		CurrentListStore.removeChangeListener(this.updateStateFromStore);
	},
	getStateFromStore () {
		return {
			activeSort: CurrentListStore.getActiveSort()
		};
	},
	updateStateFromStore () {
		this.setState(this.getStateFromStore());
	},
	openPopout () {
		this.setState({
			popoutIsOpen: true
		});
	},
	closePopout () {
		this.setState({
			popoutIsOpen: false
		});
	},
	handleSortSelect (e, sort) {
		this.closePopout();
		CurrentListStore.setActiveSort(sort);
	},
	renderColumns () {
		// TODO: Handle multiple sort paths
		let activeSortPath = this.state.activeSort && this.state.activeSort.paths[0];

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
					onClick={(e) => { this.handleSortSelect(e, path); }} />
			);
		});
	},
	render () {
		// TODO: Handle multiple sort paths
		let activeSortPath = this.state.activeSort && this.state.activeSort.paths[0];
		return (
			<span>
				{activeSortPath && (
					<span>
						<span className="ListHeader__sortedby"> sorted by </span>
						<a id="listHeaderSortButton" href="javascript:;" onClick={this.openPopout}>
							{activeSortPath.label.toLowerCase()}
							{activeSortPath.invert ? ' (descending)' : ''}
							<span className="disclosure-arrow" />
						</a>
					</span>
				)}
				<Popout isOpen={this.state.popoutIsOpen} onCancel={this.closePopout} relativeToID="listHeaderSortButton">
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
			</span>
		);
	}
});

module.exports = ListSort;
