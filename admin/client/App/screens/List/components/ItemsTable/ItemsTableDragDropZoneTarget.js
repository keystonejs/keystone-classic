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
		// Work out the new sort order. If the new page is greater, we'll put it at the start of the page, and
		// if it's smaller we'll put it at the end of the page.
		item.newSortOrder = (targetPage < page) ? (targetPage * pageSize) : (targetPage * pageSize - (pageSize - 1));
		return item;
	},
	/*
	* TODO Work out if it's possible to implement this in a way that works.
	hover (props, monitor, component) {
		if (timeoutID) {
			return;
		}
		const { page, currentPage } = props;

		// self
		if (page === currentPage) {
			return;
		}

		if (monitor.isOver()) {
			timeoutID = setTimeout(() => {
				// If user hovers over the target for a while change the page.
				// TODO Get this working. Currently, it looks like it's going to work, but when you
				// drop onto a new page, no drop events are fired, and react-dnd doesn't have a way to
				// manually force them to happen. Not sure what to do here.
				props.dispatch(setCurrentPage(props.page));


				clearTimeout(timeoutID);
				timeoutID = false;
			}, 750);
		}
	},
	*/
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
