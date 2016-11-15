import { StyleSheet } from 'aphrodite/no-important';
import React, { PropTypes } from 'react';
import {
	GlyphButton,
	InlineGroup as Group,
	InlineGroupSection as Section,
	ResponsiveText,
} from '../../../elemental';
import theme from '../../../../theme';

import ListColumnsForm from './ListColumnsForm';
import ListDownloadForm from './ListDownloadForm';
import ListHeaderSearch from './ListHeaderSearch';

import ListFiltersAdd from './Filtering/ListFiltersAdd';

function ButtonDivider ({ style, ...props }) {
	props.style = {
		borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
		paddingLeft: '0.75em',
		...style,
	};

	return <div {...props} />;
};

function CreateButton ({ listName, onClick, ...props }) {
	return (
		<GlyphButton
			block
			color="success"
			data-e2e-list-create-button="header"
			glyph="plus"
			onClick={onClick}
			position="left"
			title={`Create ${listName}`}
			{...props}
		>
			<ResponsiveText
				visibleSM="Create"
				visibleMD="Create"
				visibleLG={`Create ${listName}`}
			/>
		</GlyphButton>
	);
};

function ListHeaderToolbar ({
	// common
	dispatch,
	list,

	// expand
	expandIsActive,
	expandOnClick,

	// list
	createIsAvailable,
	createListName,
	createOnClick,

	// search
	searchHandleChange,
	searchHandleClear,
	searchHandleKeyup,
	searchValue,

	// filters
	filtersActive,
	filtersAvailable,

	// columns
	columnsAvailable,
	columnsActive,

	...props
}) {
	return (
		<Group block aphroditeStyles={classes.wrapper}>
			<Section grow aphroditeStyles={classes.search}>
				<ListHeaderSearch
					handleChange={searchHandleChange}
					handleClear={searchHandleClear}
					handleKeyup={searchHandleKeyup}
					value={searchValue}
				/>
			</Section>
			<Section grow aphroditeStyles={classes.buttons}>
				<Group block>
					<Section aphroditeStyles={classes.filter}>
						<ListFiltersAdd
							dispatch={dispatch}
							activeFilters={filtersActive}
							availableFilters={filtersAvailable}
						/>
					</Section>
					<Section aphroditeStyles={classes.columns}>
						<ListColumnsForm
							availableColumns={columnsAvailable}
							activeColumns={columnsActive}
							dispatch={dispatch}
						/>
					</Section>
					<Section aphroditeStyles={classes.download}>
						<ListDownloadForm
							activeColumns={columnsActive}
							dispatch={dispatch}
							list={list}
						/>
					</Section>
					<Section aphroditeStyles={classes.expand}>
						<ButtonDivider>
							<GlyphButton
								active={expandIsActive}
								glyph="mirror"
								onClick={expandOnClick}
								title="Expand table width"
							/>
						</ButtonDivider>
					</Section>
					{createIsAvailable && <Section aphroditeStyles={classes.create}>
						<ButtonDivider>
							<CreateButton
								listName={createListName}
								onClick={createOnClick}
							/>
						</ButtonDivider>
					</Section>}
				</Group>
			</Section>
		</Group>
	);
};

ListHeaderToolbar.propTypes = {
	columnsActive: PropTypes.array,
	columnsAvailable: PropTypes.array,
	createIsAvailable: PropTypes.bool,
	createListName: PropTypes.string,
	createOnClick: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	expandIsActive: PropTypes.bool,
	expandOnClick: PropTypes.func.isRequired,
	filtersActive: PropTypes.array,
	filtersAvailable: PropTypes.array,
	list: PropTypes.object,
	searchHandleChange: PropTypes.func.isRequired,
	searchHandleClear: PropTypes.func.isRequired,
	searchHandleKeyup: PropTypes.func.isRequired,
	searchValue: PropTypes.string,
};

const tabletGrowStyles = {
	[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
		flexGrow: 1,
	},
};

const classes = StyleSheet.create({
	// main wrapper
	wrapper: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			flexWrap: 'wrap',
		},
	},

	// button wrapper
	buttons: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			paddingLeft: 0,
		},
	},

	// cols
	expand: {
		[`@media (max-width: ${theme.breakpoint.desktopMax})`]: {
			display: 'none',
		},
	},
	filter: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			paddingLeft: 0,
			flexGrow: 1,
		},
	},
	columns: tabletGrowStyles,
	create: tabletGrowStyles,
	download: tabletGrowStyles,
	search: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			marginBottom: '0.75em',
			minWidth: '100%',
		},
	},
});

module.exports = ListHeaderToolbar;
