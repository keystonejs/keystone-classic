import { FormNote, FormField, FormInput } from '../../../elemental';
import React, { PropTypes } from 'react';
import vkey from 'vkey';

import Kbd from '../../../shared/Kbd';
import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';

var ListSort = React.createClass({
	displayName: 'ListSort',
	propTypes: {
		handleSortSelect: PropTypes.func.isRequired,
	},
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
	handleSortSelect (path, inverted) {
		if (this.state.altDown) inverted = true;
		this.props.handleSortSelect(path, inverted);
		this.closePopout();
	},
	openPopout () {
		this.setState({
			popoutIsOpen: true,
		});
	},
	closePopout () {
		this.setState({
			popoutIsOpen: false,
			searchString: '',
		});
	},
	updateSearch (e) {
		this.setState({ searchString: e.target.value });
	},
	renderSortOptions () {
		// TODO: Handle multiple sort paths
		const activeSortPath = this.props.activeSort.paths[0];
		const availibleColumns = this.props.availableColumns;
		const { searchString } = this.state;
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

			const path = el.field.path;
			const isSelected = activeSortPath && activeSortPath.path === path;
			const isInverted = isSelected && activeSortPath.invert;
			const icon = this.state.altDown || (isSelected && !isInverted) ? 'chevron-up' : 'chevron-down';

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
		const activeSortPath = this.props.activeSort.paths[0];
		const formFieldStyles = { borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' };

		return (
			<span>
				{activeSortPath && (
					<span>
						<span style={{ color: '#999' }}> sorted by </span>
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
						<FormField style={formFieldStyles}>
							<FormInput
								autoFocus
								value={this.state.searchString}
								onChange={this.updateSearch}
								placeholder="Find a field..."
							/>
						</FormField>
						<PopoutList>
							{this.renderSortOptions()}
						</PopoutList>
					</Popout.Body>

					<Popout.Footer>
						<FormNote>Hold <Kbd>alt</Kbd> to toggle ascending/descending</FormNote>
					</Popout.Footer>
				</Popout>
			</span>
		);
	},
});

module.exports = ListSort;
