import React from 'react';
import CurrentListStore from '../stores/CurrentListStore';
import DropZoneTarget from './ItemsTableDragDropZoneTarget';
import classnames from 'classnames';

var ItemsTableDragDropZone = React.createClass({
	displayName: 'ItemsTableDragDropZone',
	propTypes: {
		columns: React.PropTypes.array,
		connectDropTarget: React.PropTypes.func,
		items: React.PropTypes.object,
		list: React.PropTypes.object,
	},
	renderPageDrops () {
		const { items, list } = this.props;
		const currentPage = CurrentListStore.getCurrentPage();
		const pageSize = CurrentListStore.getPageSize();

		const totalPages = Math.ceil(items.count / pageSize);
		const style = { display: totalPages > 1 ? null : 'none' };

		const pages = [];
		for (let i = 0; i < totalPages; i++) {
			const page = i + 1;
			const pageItems = '' + (page * pageSize - (pageSize - 1)) + ' - ' + (page * pageSize);
			const current = (page === currentPage);
			const className = classnames('ItemList__dropzone--page', {
				'is-active': current,
			});
			/* eslint-disable no-loop-func */
			pages.push(<DropZoneTarget key={'page_' + page} page={page} className={className} pageItems={pageItems} />);
			/* eslint-enable */
		}

		let cols = this.props.columns.length;
		if (this.props.list.sortable) cols++;
		if (!this.props.list.nodelete) cols++;
		return (
			<tr style={style}>
				<td colSpan={cols} >
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
	},
});

module.exports = ItemsTableDragDropZone;
