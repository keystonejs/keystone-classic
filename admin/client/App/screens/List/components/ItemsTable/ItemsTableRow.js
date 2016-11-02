import React from 'react';
import classnames from 'classnames';

import ListControl from '../ListControl';

import { Columns } from 'FieldTypes';
import { DropTarget, DragSource } from 'react-dnd';

import {
	setDragBase,
	resetItems,
	reorderItems,
	setRowAlert,
	moveItem,
} from '../../actions';

const ItemsRow = React.createClass({
	propTypes: {
		columns: React.PropTypes.array,
		id: React.PropTypes.any,
		index: React.PropTypes.number,
		items: React.PropTypes.object,
		list: React.PropTypes.object,
		// Injected by React DnD:
		isDragging: React.PropTypes.bool,         // eslint-disable-line react/sort-prop-types
		connectDragSource: React.PropTypes.func,  // eslint-disable-line react/sort-prop-types
		connectDropTarget: React.PropTypes.func,  // eslint-disable-line react/sort-prop-types
		connectDragPreview: React.PropTypes.func, // eslint-disable-line react/sort-prop-types
	},
	renderRow (item) {
		const itemId = item.id;
		const rowClassname = classnames({
			'ItemList__row--dragging': this.props.isDragging,
			'ItemList__row--selected': this.props.checkedItems[itemId],
			'ItemList__row--manage': this.props.manageMode,
			'ItemList__row--success': this.props.rowAlert.success === itemId,
			'ItemList__row--failure': this.props.rowAlert.fail === itemId,
		});
		// item fields
		var cells = this.props.columns.map((col, i) => {
			var ColumnType = Columns[col.type] || Columns.__unrecognised__;
			var linkTo = !i ? `${Keystone.adminPath}/${this.props.list.path}/${itemId}` : undefined;
			return <ColumnType key={col.path} list={this.props.list} col={col} data={item} linkTo={linkTo} />;
		});

		// add sortable icon when applicable
		if (this.props.list.sortable) {
			cells.unshift(<ListControl key="_sort" type="sortable" dragSource={this.props.connectDragSource} />);
		}

		// add delete/check icon when applicable
		if (!this.props.list.nodelete) {
			cells.unshift(this.props.manageMode ? (
				<ListControl key="_check" type="check" active={this.props.checkedItems[itemId]} />
			) : (
				<ListControl key="_delete" onClick={(e) => this.props.deleteTableItem(item, e)} type="delete" />
			));
		}

		var addRow = (<tr key={'i' + item.id} onClick={this.props.manageMode ? (e) => this.props.checkTableItem(item, e) : null} className={rowClassname}>{cells}</tr>);

		if (this.props.list.sortable) {
			return (
				// we could add a preview container/image
				// this.props.connectDragPreview(this.props.connectDropTarget(addRow))
				this.props.connectDropTarget(addRow)
			);
		} else {
			return (addRow);
		}
	},
	render () {
		return this.renderRow(this.props.item);
	},
});

module.exports = exports = ItemsRow;

// Expose Sortable

/**
 * Implements drag source.
 */
const dragItem = {
	beginDrag (props) {
		const send = { ...props };
		props.dispatch(setDragBase(props.item, props.index));
		return { ...send };
	},
	endDrag (props, monitor, component) {
		if (!monitor.didDrop()) {
			props.dispatch(resetItems(props.id));
			return;
		}
		const page = props.currentPage;
		const pageSize = props.pageSize;

		// If we were dropped onto a page change target, then droppedOn.prevSortOrder etc will be
		// set by that target, and we should use those values. If we were just dropped onto a new row
		// then we need to calculate these values ourselves.
		const droppedOn = monitor.getDropResult();

		const prevSortOrder = droppedOn.prevSortOrder || props.sortOrder;
		// To explain the following line, suppose we are on page 3 and there are 10 items per page.
		// Previous to this page, there are (3 - 1)*10 = 20 items before us. If we have index 6
		// on this page, then we're the 7th item to display (index starts from 0), and so we
		// want to update the display order to 20 + 7 = 27.
		const newSortOrder = droppedOn.newSortOrder || (page - 1) * pageSize + droppedOn.index + 1;

		// If we were dropped on a page change target, then droppedOn.gotToPage will be set, and we should
		// pass this to reorderItems, which will then change the page for the user.
		props.dispatch(reorderItems(props.item, prevSortOrder, newSortOrder, Number(droppedOn.goToPage)));
	},
};
/**
 * Implements drag target.
 */
const dropItem = {
	drop (props, monitor, component) {
		return { ...props };
	},
	hover (props, monitor, component) {
		// reset row alerts
		if (props.rowAlert.success || props.rowAlert.fail) {
			props.dispatch(setRowAlert({
				reset: true,
			}));
		}

		const dragged = monitor.getItem().index;
		const over = props.index;

		// self
		if (dragged === over) {
			return;
		}

		props.dispatch(moveItem(dragged, over, props));
		monitor.getItem().index = over;
	},
};

/**
 * Specifies the props to inject into your component.
 */
function dragProps (connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
		connectDragPreview: connect.dragPreview(),
	};
}

function dropProps (connect) {
	return {
		connectDropTarget: connect.dropTarget(),
	};
};

exports.Sortable = DragSource('item', dragItem, dragProps)(DropTarget('item', dropItem, dropProps)(ItemsRow));
