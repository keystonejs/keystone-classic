import { FormNote, FormField, FormInput } from 'elemental';
import React from 'react';
import Popout from './Popout';
import PopoutList from './PopoutList';
import vkey from 'vkey';
import CurrentListStore from '../stores/CurrentListStore';

var ListSort = React.createClass({
	displayName: 'ListSort',
	getInitialState () {
		return {
			altDown: false,
			popoutIsOpen: false,
			searchString: '',
		};
	},
	componentDidMount () {
		document.body.addEventListener('keydown', this.handleKeyDown, false);
		document.body.addEventListener('keyup', this.handleKeyUp, false);
	},
	componentWillUnmount () {
		document.body.removeEventListener('keydown', this.handleKeyDown);
		document.body.removeEventListener('keyup', this.handleKeyUp);
	},
	handleKeyDown (e) {
		if (vkey[e.keyCode] !== '<alt>') return;
		this.setState({
			altDown: true,
		});
	},
	handleKeyUp (e) {
		if (vkey[e.keyCode] !== '<alt>') return;
		this.setState({
			altDown: false,
		});
	},
	openPopout () {
		this.setState({
			popoutIsOpen: true,
		}, () => {
			this.refs.search.focus();
		});
	},
	closePopout () {
		this.setState({
			popoutIsOpen: false,
			searchString: '',
		});
	},
	handleSortSelect (path, inverted) {
		if (this.state.altDown) inverted = true;
		if (inverted) path = '-' + path;
		this.closePopout();
		CurrentListStore.setActiveSort(path);
	},
	updateSearch (e) {
		this.setState({ searchString: e.target.value });
	},
	renderSortOptions () {
		// TODO: Handle multiple sort paths
		let activeSortPath = CurrentListStore.getActiveSort().paths[0];
		let availibleColumns = CurrentListStore.getAvailableColumns();
		let { searchString } = this.state;
		let filteredColumns = availibleColumns;

		if (searchString) {
			filteredColumns = filteredColumns
				.filter(column => column.type !== 'heading')
				.filter(column => new RegExp(searchString).test(column.field.label.toLowerCase()));
		}

		return filteredColumns.map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.content}</PopoutList.Heading>;
			}

			let path = el.field.path;
			let isSelected = activeSortPath && activeSortPath.path === path;
			let isInverted = isSelected && activeSortPath.invert;
			let icon = this.state.altDown || (isSelected && !isInverted) ? 'chevron-up' : 'chevron-down';

			return (
				<PopoutList.Item
					key={'column_' + el.field.path}
					icon={icon}
					isSelected={isSelected}
					label={el.field.label}
					onClick={() => {
						this.handleSortSelect(path, isSelected && !isInverted);
					}} />
			);
		});
	},
	render () {
		// TODO: Handle multiple sort paths
		let activeSortPath = CurrentListStore.getActiveSort().paths[0];
		return (
			<span>
				{activeSortPath && (
					<span>
						<span className="ListHeader__sortedby"> sorted by </span>
						<a id="listHeaderSortButton" href="javascript:;" onClick={this.openPopout}>
							{activeSortPath.label.toLowerCase()}
							{activeSortPath.invert ? ' (descending)' : ''}
							<span className="disclosure-arrow" />
						</a>
					</span>
				)}
				<Popout isOpen={this.state.popoutIsOpen} onCancel={this.closePopout} relativeToID="listHeaderSortButton">
					<Popout.Header title="Sort" />
					<Popout.Body scrollable>
						<FormField style={{ borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' }}>
							<FormInput ref="search" value={this.state.searchString} onChange={this.updateSearch} placeholder="Find a field..." />
						</FormField>
						<PopoutList>
							{this.renderSortOptions()}
						</PopoutList>
					</Popout.Body>
					<Popout.Footer>
						<FormNote>Hold <kbd>alt</kbd> to toggle ascending/descending</FormNote>
					</Popout.Footer>
				</Popout>
			</span>
		);
	},
});

module.exports = ListSort;
