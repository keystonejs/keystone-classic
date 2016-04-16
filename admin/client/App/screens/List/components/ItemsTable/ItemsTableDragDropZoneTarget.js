/**
 * THIS IS ORPHANED AND ISN'T RENDERED AT THE MOMENT
 * THIS WAS DONE TO FINISH THE REDUX INTEGRATION, WILL REWRITE SOON
 * - @mxstbr
 */

import React from 'react';
import { DropTarget } from 'react-dnd';

import { setCurrentPage } from '../../actions';

let timeoutID = false;

// drop target
var ItemsTableDragDropZoneTarget = React.createClass({
	displayName: 'ItemsTableDragDropZoneTarget',
	propTypes: {
		className: React.PropTypes.string,
		connectDropTarget: React.PropTypes.func,
		isOver: React.PropTypes.bool,
		pageItems: React.PropTypes.string,
	},
	componentDidUpdate () {
		if (timeoutID && !this.props.isOver) {
			clearTimeout(timeoutID);
			timeoutID = false;
		}
	},
	render () {
		const { pageItems, page, isOver, dispatch } = this.props;
		let { className } = this.props;
		if (isOver) {
			className += (page === this.props.currentPage) ? ' is-available ' : ' is-waiting ';
		}
		return this.props.connectDropTarget(
			<div
				className={className}
				onClick={(e) => {
					dispatch(setCurrentPage(page));
				}}
			>
				{pageItems}
			</div>);
	},
});

/**
 * Implements drag target.
 */
const dropTarget = {
	drop (props, monitor, component) {
		// we send manual data to endDrag to send this item to the correct page
		const { page } = props.drag;
		const targetPage = props.page;
		const pageSize = props.pageSize;

		const item = monitor.getItem();
		item.goToPage = props.page;
		item.prevSortOrder = item.sortOrder;
		// if the new page is greater, we will place the item at the beginning of the page
		// if the new page is less, we will place the item at the end of the page
		item.newSortOrder = (targetPage < page) ? (targetPage * pageSize) : (targetPage * pageSize - (pageSize - 1));

		return item;
	},
	hover (props, monitor, component) {
		if (timeoutID) {
			return;
		}
		const { page, currentPage, drag } = props;
		const original = drag;

		// self
		if (page === currentPage) {
			return;
		}
		if (monitor.isOver()) {
			timeoutID = setTimeout(() => {
				const newIndex = (original.page === page) ? original.index : (currentPage < page) ? 0 : props.pageSize;
				console.log('SET PAGE MOTHERFUCKER')
				props.dispatch(setCurrentPage(page));
				monitor.getItem().index = newIndex;

				clearTimeout(timeoutID);
				timeoutID = false;
			}, 750);
		}
	},
	canDrop (props, monitor) {
		// if we drop on a page target, move the item to the correct first or last position in the new page
		// if we want to stop this behaviour set return false
		if (!Keystone.devMode) return;

		const original = props.drag;
		// self
		if (original.page === props.page) {
			return false;
		}
		return true;
	},
};
/**
 * Specifies the props to inject into your component.
 */
function dropProps (connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
	};
};

module.exports = DropTarget('item', dropTarget, dropProps)(ItemsTableDragDropZoneTarget);
