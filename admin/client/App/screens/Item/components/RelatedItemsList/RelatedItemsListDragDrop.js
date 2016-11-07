import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Sortable } from './RelatedItemsListRow';

class RelatedItemsListDragDrop extends Component {
	render () {
		const { items } = this.props;
		return (
			<tbody>
				{items.results.map((item, i) => {
					return (<Sortable
						key={item.id}
						index={i}
						item={item}
						{...this.props}
					/>);
				})}
			</tbody>
		);
	}
};
RelatedItemsListDragDrop.propTypes = {
	columns: PropTypes.array.isRequired,
	dispatch: React.PropTypes.func.isRequired,
	dragNewSortOrder: React.PropTypes.number,
	items: PropTypes.array.isRequired,
	list: PropTypes.object.isRequired,
	refList: PropTypes.object.isRequired,
	relatedItemId: PropTypes.string.isRequired,
	relationship: PropTypes.object.isRequired,
};

module.exports = DragDropContext(HTML5Backend)(RelatedItemsListDragDrop);
