import React from 'react';
import Markdown from 'react-markdown';

import Col from './Col';
import Row from './Row';
import FieldSpec from './FieldSpec';

const ExplorerFieldType = React.createClass({
	getInitialState () {
		return {
			readmeIsVisible: !!this.props.readme,
			filter: this.props.FilterComponent.getDefaultValue(),
			value: this.props.value,
		};
	},
	componentWillReceiveProps (newProps) {
		if (this.props.params.type === newProps.params.type) return;

		this.setState({
			filter: newProps.FilterComponent.getDefaultValue(),
			readmeIsVisible: newProps.readme
				? this.state.readmeIsVisible
				: false,
			value: newProps.value,
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
	toggleReadme () {
		this.setState({ readmeIsVisible: !this.state.readmeIsVisible });
	},
	render () {
		const { FieldComponent, FilterComponent, readme, toggleSidebar } = this.props;
		const { readmeIsVisible } = this.state;
		const specs = Array.isArray(this.props.spec) ? this.props.spec : [this.props.spec];

		return (
			<div className="fx-page">
				<div className="fx-page__header">
					<div className="fx-page__header__title">
						<button
							className="fx-page__header__button fx-page__header__button--sidebar mega-octicon octicon-three-bars"
							onClick={toggleSidebar}
							type="button"
						/>
						{FieldComponent.type}
					</div>
					{!!readme && (
						<button
							className="fx-page__header__button fx-page__header__button--readme mega-octicon octicon-file-text"
							onClick={this.toggleReadme}
							title={readmeIsVisible ? 'Hide Readme' : 'Show Readme'}
							type="button"
						/>
					)}
				</div>
				<div className="fx-page__content">
					<Row>
						<Col>
							<div className="fx-page__content__inner">
								{specs.map((spec, i) => (
									<FieldSpec
										key={spec.path}
										i={i}
										FieldComponent={FieldComponent}
										FilterComponent={FilterComponent}
										spec={spec}
										readmeIsVisible={readmeIsVisible}
									/>
								))}
							</div>
						</Col>
						{!!readmeIsVisible && (
							<Col width={380}>
								<Markdown
									className="Markdown"
									source={readme}
								/>
							</Col>
						)}
					</Row>
				</div>
			</div>
		);
	},
});

module.exports = ExplorerFieldType;
