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
		id: React.PropTypes.any.isRequired,
		// Injected by React DnD:
		isDragging: React.PropTypes.bool,
		connectDragSource: React.PropTypes.func,
		connectDropTarget: React.PropTypes.func,
		connectDragPreview: React.PropTypes.func
	},
	deleteItem (item, e) {
		if (!e.altKey && !confirm('Are you sure you want to delete ' + item.name + '?')) return;
		CurrentListStore.deleteItem(item);
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
			var linkTo = !i ? `/keystone/${this.props.list.path}/${itemId}` : undefined;
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
				<ListControl key="_delete" onClick={(e) => this.deleteItem(item, e)} type="delete" />
			));
		}
		
		var addRow = (<tr key={'i' + item.id} onClick={this.props.manageMode ? (e) => this.props.checkTableItem(item, e) : null} className={rowClassname}>{cells}</tr>);
		
		if(this.props.list.sortable) {	
			return (
				this.props.connectDragPreview(this.props.connectDropTarget(addRow))
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
const itemSource = {
	beginDrag (props) {
		return { ...props };
	},
	endDrag: function (props, monitor, component) {
		
		const prevSortOrder = props.sortOrder;
		const newSortOrder = CurrentListStore.findClonedItem(props.index).sortOrder;
		
		// self
		if (prevSortOrder === newSortOrder) {
		  return;
		}
		
		if (!monitor.didDrop()) {
			return CurrentListStore.resetItems(CurrentListStore.findItem(props.id).index);
		}
		
		// dropped on a target
		props.reorderItems(props.item, prevSortOrder, newSortOrder);
	}
};
/**
 * Implements drag target.
 */
const itemTarget = {
	
	drop (props, monitor, component) {
		return props;
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

		props.moveItem(dragged, over);
		monitor.getItem().index = over;
	}
};

/**
 * Specifies the props to inject into your component.
 */
function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  };
}

function connect (connect) {
	 return {
		 connectDropTarget: connect.dropTarget()
	};
};

exports.Sortable = DragSource('item', itemSource, collect)(DropTarget('item', itemTarget, connect)(ItemsRow));

