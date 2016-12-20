import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';

import { Columns } from 'FieldTypes';

import {
	reorderItems,
	resetItems,
	moveItem,
} from '../../actions';

import ListControl from '../../../List/components/ListControl';

class RelatedItemsListRow extends Component {
	render () {
		const { columns, item, connectDragSource, connectDropTarget, refList } = this.props;
		const cells = columns.map((col, i) => {
			const ColumnType = Columns[col.type] || Columns.__unrecognised__;
			const linkTo = !i ? `${Keystone.adminPath}/${refList.path}/${item.id}` : undefined;
			return <ColumnType key={col.path} list={refList} col={col} data={item} linkTo={linkTo} />;
		});

		// add sortable icon when applicable
		if (connectDragSource) {
			cells.unshift(<ListControl key="_sort" type="sortable" dragSource={connectDragSource} />);
		}

		const row = (<tr key={'i' + item.id}>{cells}</tr>);

		if (connectDropTarget) {
			return connectDropTarget(row);
		} else {
			return row;
		}
	}
}
RelatedItemsListRow.propTypes = {
	columns: PropTypes.array.isRequired,
	dispatch: PropTypes.func.isRequired,
	dragNewSortOrder: React.PropTypes.number,
	index: PropTypes.number,
	item: PropTypes.object.isRequired,
	refList: PropTypes.object.isRequired,
	relatedItemId: PropTypes.string.isRequired,
	relationship: PropTypes.object.isRequired,
	// Injected by React DnD:
	isDragging: PropTypes.bool,         // eslint-disable-line react/sort-prop-types
	connectDragSource: PropTypes.func,  // eslint-disable-line react/sort-prop-types
	connectDropTarget: PropTypes.func,  // eslint-disable-line react/sort-prop-types
	connectDragPreview: PropTypes.func, // eslint-disable-line react/sort-prop-types
};

module.exports = exports = RelatedItemsListRow;

// Expose Sortable

/**
 * Implements drag source.
 */
const dragItem = {
	beginDrag (props) {
		const send = { ...props };
		// props.dispatch(setDragBase(props.item, props.index));
		return { ...send };
	},
	endDrag (props, monitor, component) {
		// Dropped outside of the drop target, reset rows
		if (!monitor.didDrop()) {
			props.dispatch(resetItems());
			return;
		}

		const draggedItem = props.item;
		const prevSortOrder = draggedItem.sortOrder;
		const newSortOrder = props.dragNewSortOrder;

		// Dropping on self
		if (prevSortOrder === newSortOrder) {
			props.dispatch(resetItems());
			return;
		}

		// dropped on a target
		const { columns, refList, relationship, relatedItemId, item } = props;
		props.dispatch(reorderItems({ columns, refList, relationship, relatedItemId, item, prevSortOrder, newSortOrder }));
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
		// if (props.rowAlert.success || props.rowAlert.fail) {
			// props.dispatch(setRowAlert({
			// 	reset: true,
			// }));
		// }

		const dragged = monitor.getItem().index;
		const over = props.index;

		// self
		if (dragged === over) {
			return;
		}

		// Since the items are moved on hover, we need to store the new sort order from the dragged over item so we can use it to reorder when the item is dropped.
		props.dispatch(moveItem({
			prevIndex: dragged,
			newIndex: over,
			relationshipPath: props.relationship.path,
			newSortOrder: props.item.sortOrder,
		}));
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

// exports.Sortable = RelatedItemsListRow;
exports.Sortable = DragSource('item', dragItem, dragProps)(DropTarget('item', dropItem, dropProps)(RelatedItemsListRow));
