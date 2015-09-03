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
		onColumnSelect: React.PropTypes.func,
	},
	renderColumns () {
		return CurrentListStore.getAvailableColumns().map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.label}</PopoutList.Heading>;
			}

			let path = el.field.path;
			let isSelected = false;// TODO this.props.activeSort.path === path;

			return (
				<PopoutList.Item
					key={'column_' + el.field.path}
					icon={isSelected ? (this.props.invertSort ? 'chevron-up' : 'chevron-down') : 'dash'}
					iconHover={isSelected ? (this.props.invertSort ? 'chevron-down' : 'chevron-up') : 'chevron-down'}
					iconHoverAlt={isSelected ? (this.props.invertSort ? 'chevron-up' : 'chevron-down') : 'chevron-up'}
					isSelected={isSelected}
					label={el.field.label}
					onClick={(e) => { this.props.onColumnSelect(e, path); }} />
			);
		});
	},
	render () {
		return (
			<div>
				<h2 className="ListHeader__title">
					{this.props.title}
					{/*
					TODO
					<span> sorted by </span>
					<a id="listHeaderSortButton" href="javascript:;" onClick={this.props.openPopout}>
						{this.props.activeSort.label.toLowerCase()}
						{this.props.invertSort ? ' (asc)' : ' (desc)'}
						<span className="disclosure-arrow" />
					</a>*/}
				</h2>
				{/*
				TODO
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
				*/}
			</div>
		);
	}
});

module.exports = ListHeaderTitle;
