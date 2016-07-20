import Domify from 'react-domify';
import React from 'react';

import Col from './Col';
import Row from './Row';

const ExplorerFieldType = React.createClass({
	getInitialState () {
		return {
			filter: this.props.FilterComponent.getDefaultValue(),
			value: this.props.value,
		};
	},
	onFieldChange (e) {
		var logValue = typeof e.value === 'string' ? `"${e.value}"` : e.value;
		console.log(`${this.props.FieldComponent.type} field value changed:`, logValue);
		this.setState({
			value: e.value,
		});
	},
	onFilterChange (value) {
		console.log(`${this.props.FieldComponent.type} filter value changed:`, value);
		this.setState({
			filter: value,
		});
	},
	render () {
		const { FieldComponent, FilterComponent, readmeIsVisible, spec } = this.props;
		const className = this.props.i ? 'fx-page__field__bordered' : undefined;
		return (
			<div className={className}>
				<div className="fx-page__field">
					<Row>
						<Col width={readmeIsVisible ? 300 : null} style={{ minWidth: 300, maxWidth: 640 }}>
							<FieldComponent
								{...spec}
								onChange={this.onFieldChange}
								value={this.state.value}
							/>
						</Col>
						<Col>
							<div style={{ marginLeft: 30, marginTop: 26 }}>
								<Domify
									className="Domify"
									value={{ value: this.state.value }}
								/>
							</div>
						</Col>
					</Row>
				</div>
				<div className="fx-page__filter">
					<div className="fx-page__filter__title">Filter</div>
					<Row>
						<Col width={300}>
							<FilterComponent
								field={spec}
								filter={this.state.filter}
								onChange={this.onFilterChange}
							/>
						</Col>
						<Col>
							<div style={{ marginLeft: 30 }}>
								<Domify
									className="Domify"
									value={this.state.filter}
								/>
							</div>
						</Col>
					</Row>
				</div>
			</div>
		);
	},
});

module.exports = ExplorerFieldType;
