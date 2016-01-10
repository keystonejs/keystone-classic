import React from 'react';
import classnames from 'classnames';

import Columns from '../columns';
import CurrentListStore from '../stores/CurrentListStore';
import ListControl from './ListControl';

import { DropTarget, DragSource } from 'react-dnd';


const ItemsRow = React.createClass({
	propTypes: {
		columns: React.PropTypes.array,
		items: React.PropTypes.object,
		list: React.PropTypes.object,
		index: React.PropTypes.number,
		id: React.PropTypes.any,
		// Injected by React DnD:
		isDragging: React.PropTypes.bool,
		connectDragSource: React.PropTypes.func,
		connectDropTarget: React.PropTypes.func,
		connectDragPreview: React.PropTypes.func
	},
	renderRow (item) {
		let itemId = item.id;
		let rowClassname = classnames({
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
		
		if(this.props.list.sortable) {	
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
	}
});

module.exports = exports = ItemsRow;

// Expose Sortable

/**
 * Implements drag source.
 */
const dragItem = {
	beginDrag (props) {
		let send = { ...props };
		CurrentListStore.setDragBase(props.item, props.index);
		return { ...send };
	},
	endDrag (props, monitor, component) {
		
		if (!monitor.didDrop()) {
			return CurrentListStore.resetItems(CurrentListStore.findClonedItemById(props.id).index);
		}
		
		const base = CurrentListStore.getDragBase();
		const page = CurrentListStore.getCurrentPage();
		const droppedOn = monitor.getDropResult();
		// some drops provide the data for us in prevSortOrder
		const prevSortOrder = droppedOn.prevSortOrder ? droppedOn.prevSortOrder : props.sortOrder;
		// use a given newSortOrder prop or retrieve from the cloned items list
		let newSortOrder = droppedOn.newSortOrder ? droppedOn.newSortOrder : CurrentListStore.findClonedItemByIndex(droppedOn.index).sortOrder;

		// self
		if (prevSortOrder === newSortOrder) {
			if(base.page !== page) {
				// we were dropped on ourself, but not on our original page
				if(droppedOn.index === 0) {
					// item is first in the list
					// save to the sortOrder of the 2nd item - 1
					newSortOrder = CurrentListStore.findClonedItemByIndex(1).sortOrder - 1;
					droppedOn.goToPage = Number(page) - 1;
				} else {
					// item is last in the list
					// save to the sortOrder of the 2nd to last item - 1
					newSortOrder = CurrentListStore.findClonedItemByIndex(droppedOn.index - 1).sortOrder + 1;
					droppedOn.goToPage = Number(page) + 1;
				}
				if (!newSortOrder || !droppedOn.goToPage) {
					// something is wrong so reset
					return CurrentListStore.resetItems(CurrentListStore.findClonedItemById(props.id).index);
				}
			} else {
				return CurrentListStore.resetItems(CurrentListStore.findClonedItemById(props.id).index);
			}
		}
		// dropped on a target
		// droppedOn.goToPage is an optional page override for dropping items on a new page target
		CurrentListStore.reorderItems(props.item, prevSortOrder, newSortOrder, Number(droppedOn.goToPage));
	}
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
		if(props.rowAlert.success || props.rowAlert.fail) {
			CurrentListStore.rowAlert('reset');
		}
		
		const dragged = monitor.getItem().index;
		const over = props.index;

		// self
		if (dragged === over) {
		  return;
		}

		CurrentListStore.moveItem(dragged, over, props);
		monitor.getItem().index = over;
	}
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
		 connectDropTarget: connect.dropTarget()
	};
};

exports.Sortable = DragSource('item', dragItem, dragProps)(DropTarget('item', dropItem, dropProps)(ItemsRow));

