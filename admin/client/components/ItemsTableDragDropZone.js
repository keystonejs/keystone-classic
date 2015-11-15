import React from 'react';
import CurrentListStore from '../stores/CurrentListStore';
import DropZoneTarget from './ItemsTableDragDropZoneTarget';
import classnames from 'classnames';

var ItemsTableDragDropZone = React.createClass({
	displayName: 'ItemsTableDragDropZone',
	propTypes: {
		columns: React.PropTypes.array,
		items: React.PropTypes.object,
		list: React.PropTypes.object,
		connectDropTarget: React.PropTypes.func,
	},
	renderPageDrops () {
		let { items, list } = this.props;
		let currentPage = CurrentListStore.getCurrentPage();
		let pageSize = CurrentListStore.getPageSize();
				
		let totalPages = Math.ceil(items.count / pageSize);
		
		let pages = [];
		for (let i = 0; i < totalPages; i++) {
			let page = i + 1;
			let pageItems = '' + (page * pageSize - (pageSize - 1)) + ' - ' + (page * pageSize);
			let current = (page === currentPage);
			let className = classnames('ItemList__dropzone--page', {
				'is-active': current,
			});
			/* eslint-disable no-loop-func */
			pages.push(<DropZoneTarget key={'page_' + page} page={page} className={className} pageItems={pageItems}  />);
			/* eslint-enable */
		}
			
		let cols = this.props.columns.length;
		if (this.props.list.sortable) cols++;
		if (!this.props.list.nodelete) cols++;
		return (
			<tr>
				<td colSpan={cols}  >
					<div className="ItemList__dropzone" >
						{pages}
						<div className="clearfix" />
					</div>
				</td>
			</tr>
		);
	},
	render () {
		return this.renderPageDrops();
	}
});



module.exports = ItemsTableDragDropZone;
