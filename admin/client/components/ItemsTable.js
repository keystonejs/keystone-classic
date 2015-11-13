const classnames = require('classnames');
const blacklist = require('blacklist');
const Columns = require('../columns');
const CurrentListStore = require('../stores/CurrentListStore');
const ListControl = require('./ListControl');
const React = require('react');
const ReactDOM = require('react-dom');
const { Alert } = require('elemental');
const { DragDropContext, DropTarget, DragSource } = require('react-dnd');
const HTML5Backend = require('react-dnd-html5-backend');

const CONTROL_COLUMN_WIDTH = 26;  // icon + padding

/**
 * Implements drag source.
 */
const itemSource = {
	beginDrag(props) {
		return {...props};
	},
	endDrag: function (props, monitor, component) {

		if (!monitor.didDrop()) {
			return CurrentListStore.resetItems(CurrentListStore.findItem(props.id).index);
		}
		
		const prevSortOrder = props.sortOrder;
		const newSortOrder = CurrentListStore.findClonedItem(props.index).sortOrder;
		
		// dropped on a target
		props.reorderItems(props.item, prevSortOrder, newSortOrder);
	}
}
/**
 * Implements drag target.
 */
const itemTarget = {
	
	drop(props, monitor, component) {
		return props;
	},
	hover(props, monitor, component) {
		
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
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  };
}

function connect(connect) {
	 return {
		 connectDropTarget: connect.dropTarget()
	};
};

const ItemsRow = React.createClass({
	propTypes: {
		columns: React.PropTypes.array,
		items: React.PropTypes.object,
		list: React.PropTypes.object,
		index: React.PropTypes.number.isRequired,
		id: React.PropTypes.any.isRequired,
		// Injected by React DnD:
		isDragging: React.PropTypes.bool.isRequired,
		connectDragSource: React.PropTypes.func.isRequired,
		connectDropTarget: React.PropTypes.func.isRequired,
		connectDragPreview: React.PropTypes.func.isRequired
	},
	deleteItem (item, e) {
		if (!e.altKey && !confirm('Are you sure you want to delete ' + item.name + '?')) return;
		CurrentListStore.deleteItem(item);
	},
	renderRows (item) {
		let itemId = item.id;
		let rowClassname = classnames({
			'ItemList__row--sortable': this.props.isDragging,
			'ItemList__row--selected': this.props.checkedItems[itemId],
			'ItemList__row--manage': this.props.manageMode,
			'ItemList__row--success': this.props.rowAlert.success === itemId,
			'ItemList__row--failure': this.props.rowAlert.fail === itemId,
		});
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
		
		var style = this.props.isDragging ? {
			borderLeft: '2px solid #1385e5',
			color: 'black',
			backgroundColor: 'white',
			cursor: 'move',
			opacity: 0
		} : {};		
		return (
			this.props.connectDragPreview(this.props.connectDropTarget(<tr style={{ ...style }} key={'i' + item.id} onClick={this.props.manageMode ? (e) => this.props.checkTableItem(item, e) : null} className={rowClassname}>{cells}</tr>))
		);
	},
	render() {
		return this.renderRows(this.props.item)
	}
})

const Row = DragSource('item', itemSource, collect)(DropTarget('item', itemTarget, connect)(ItemsRow));

const ItemsTable = React.createClass({
	propTypes: {
		columns: React.PropTypes.array,
		items: React.PropTypes.object,
		list: React.PropTypes.object
	},
	renderCols () {
		var cols = this.props.columns.map((col) => <col width={col.width} key={col.path} />);
		// add delete col when applicable
		if (!this.props.list.nodelete) {
			cols.unshift(<col width={CONTROL_COLUMN_WIDTH} key="delete" />);
		}
		// add sort col when applicable
		if (this.props.list.sortable) {
			cols.unshift(<col width={CONTROL_COLUMN_WIDTH} key="sortable" />);
		}
		return <colgroup>{cols}</colgroup>;
	},
	renderHeaders () {
		var cells = this.props.columns.map((col, i) => {
			// span first col for controls when present
			var span = 1;
			if (!i) {
				if (this.props.list.sortable) span++;
				if (!this.props.list.nodelete) span++;
			}
			return <th key={col.path} colSpan={span}>{col.label}</th>;
		});
		return <thead><tr>{cells}</tr></thead>;
	},
	render () {
		if (!this.props.items.results.length) return null;
		return (
			<div className="ItemList-wrapper">
				<table cellPadding="0" cellSpacing="0" className="Table ItemList">
					{this.renderCols()}
					{this.renderHeaders()}
					<tbody >
						{this.props.items.results.map((item, i) => { 
							return (
								<Row key={item.id}
									index={i}
									sortOrder={item.sortOrder}
									id={item.id}
									item={item}
									{...this.props}
								/>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
});

module.exports = DragDropContext(HTML5Backend)(ItemsTable);
