import Domify from 'react-domify';
import React from 'react';
import Markdown from 'react-markdown';

const Types = {
	Boolean: require('../types/boolean/test/explorer'),
	Color: require('../types/color/test/explorer'),
	Date: require('../types/date/test/explorer'),
	Datetime: require('../types/datetime/test/explorer'),
	Email: require('../types/email/test/explorer'),
	Key: require('../types/key/test/explorer'),
	Name: require('../types/name/test/explorer'),
	Password: require('../types/password/test/explorer'),
	Text: require('../types/text/test/explorer'),
	Textarea: require('../types/textarea/test/explorer'),
	Textarray: require('../types/textarray/test/explorer'),
	Url: require('../types/url/test/explorer'),
};

const Row = (props) => {
	const styles = {
		display: 'flex',
		flexWrap: 'wrap',
		marginLeft: -10,
		marginRight: -10,
		...props.style,
	};

	return (
		<div
			{...props}
			className={props.className || 'Row'}
			style={styles}
			/>
	);
};

const Col = (props) => {
	const styles = {
		flex: props.width ? null : '1 1 0',
		minHeight: 1,
		paddingLeft: 10,
		paddingRight: 10,
		width: props.width || '100%',
		...props.style,
	};

	return (
		<div
			{...props}
			className={props.className || 'Col'}
			style={styles}
			/>
	);
};

const ExplorerFieldType = React.createClass({
	getInitialState () {
		const FilterComponent = Types[this.props.params.type].Filter;
		return {
			readmeIsVisible: true,
			filter: FilterComponent.getDefaultValue(),
			value: Types[this.props.params.type].value,
		};
	},
	componentWillReceiveProps (newProps) {
		if (this.props.params.type === newProps.params.type) return;
		const FilterComponent = Types[newProps.params.type].Filter;
		this.setState({
			value: Types[newProps.params.type].value,
			filter: FilterComponent.getDefaultValue(),
		});
	},
	onFieldChange (e) {
		var logValue = typeof e.value === 'string' ? `"${e.value}"` : e.value;
		console.log(`${this.props.params.type} field value changed:`, logValue);
		this.setState({
			value: e.value,
		});
	},
	onFilterChange (value) {
		console.log(`${this.props.params.type} filter value changed:`, value);
		this.setState({
			filter: value,
		});
	},
	render () {
		const { type } = this.props.params;
		const { readmeIsVisible } = this.state;
		// const Readme = Types[type].Readme;
		const FieldComponent = Types[type].Field;
		const FilterComponent = Types[type].Filter;
		const spec = Types[type].spec;
		return (
			<div className="fx-page">
				<div className="fx-page__header">
					<div className="fx-page__header__title">{type}</div>
					<button
						className="fx-page__header__button mega-octicon octicon-file-text"
						onClick={() => this.setState({ readmeIsVisible: !readmeIsVisible })}
						title={readmeIsVisible ? 'Hide Readme' : 'Show Readme'}
						type="button"
					/>
				</div>
				<div className="fx-page__content">
					<Row>
						<Col>
							<div className="fx-page__content__inner">
								<Row>
									<Col width={300}>
										<FieldComponent
											{...spec}
											onChange={this.onFieldChange}
											value={this.state.value}
										/>
									</Col>
									<Col>
										<Domify
											className="Domify"
											value={{ value: this.state.value }}
										/>
									</Col>
								</Row>
								<h3>Filter</h3>
								<Row>
									<Col width={300}>
										<FilterComponent
											field={spec}
											filter={this.state.filter}
											onChange={this.onFilterChange}
										/>
									</Col>
									<Col>
										<Domify
											className="Domify"
											value={this.state.filter}
										/>
									</Col>
								</Row>
							</div>
						</Col>
						{!!readmeIsVisible && (
							<Col width={380}>
								<Markdown
									className="Markdown"
									source={STUB_README}
								/>
							</Col>
						)}
					</Row>
				</div>
			</div>
		);
	},
});

const STUB_README = `
# Boolean Field

Stores a \`Boolean\` in the model.

## Methods

### \`format\`

Returns the string \`"true"\` or \`"false"\`.

### \`updateItem\`

Because \`FormData\` can only submit \`String\` values, and HTML Forms won't submit fields at all when checkbox inputs are not checked, there are a few unusual behaviours when updating Boolean fields:

* The stored value is always updated, even when \`undefined\` is provided
* Any falsy value, including \`undefined\`, \`null\`, \`false\`, \`""\` and \`0\` will store \`false\`
* The string \`"false"\` will store \`false\`
* Any other truthy string will store \`true\`
* Any truthy number will store \`true\`
* The boolean \`true\` will store \`true\`

There is no way to use \`updateItem\` to remove Boolean field values from the item.

### \`validateInput\`

Ensures the value can be interpreted using the rules above. Other complex values (objects that aren't null, dates, arrays, etc) are not valid input.

### \`validateRequiredInput\`

Ensures the value matches one of the rules above that will store \`true\`
`;

module.exports = ExplorerFieldType;
