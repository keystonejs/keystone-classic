import React, { Children, cloneElement } from 'react';
import { Link, Router, Route, browserHistory, IndexRoute } from 'react-router';
import ReactDOM from 'react-dom';
import FieldType from './field';

const Types = {
	Boolean: require('../types/boolean/test/explorer'),
	// Code: require('../types/code/test/explorer'), // Not ready
	Color: require('../types/color/test/explorer'),
	Date: require('../types/date/test/explorer'),
	Datearray: require('../types/datearray/test/explorer'),
	Datetime: require('../types/datetime/test/explorer'),
	Email: require('../types/email/test/explorer'),
	Geopoint: require('../types/geopoint/test/explorer'),
	Key: require('../types/key/test/explorer'),
	Location: require('../types/location/test/explorer'),
	Money: require('../types/money/test/explorer'),
	Name: require('../types/name/test/explorer'),
	Number: require('../types/number/test/explorer'),
	Numberarray: require('../types/numberarray/test/explorer'),
	Password: require('../types/password/test/explorer'),
	Select: require('../types/select/test/explorer'),
	Text: require('../types/text/test/explorer'),
	Textarea: require('../types/textarea/test/explorer'),
	Textarray: require('../types/textarray/test/explorer'),
	Url: require('../types/url/test/explorer'),
};

function generateNavSections (arr) {
	const navSections = {};
	arr.forEach((t) => {
		if (!navSections[t.section]) navSections[t.section] = [];
	});
	arr.forEach(t => navSections[t.section].push(t.spec.label));

	return navSections;
}

const navSections = generateNavSections(Object.keys(Types).map(i => Types[i]));

const App = (props) => {
	return (
		<div className="fx-wrapper">
			<div className="fx-sidebar">
				<div className="fx-sidebar__header">{props.params.type
					? <Link to="/" className="fx-sidebar__header__link">Exploring</Link>
					: 'Ready'}
				</div>
				{Object.keys(navSections).map(section => {
					let currentSection;
					const types = navSections[section].map(type => {

						if (Types[props.params.type]) {
							currentSection = Types[props.params.type].section;
						}

						const itemClassName = props.params.type === type
							? 'fx-sidebar__item fx-sidebar__item--active'
							: 'fx-sidebar__item';

						return (
							<Link key={type} to={`/${type}`} className={itemClassName}>
								{type}
							</Link>
						);
					});

					const sectionClassName = currentSection === section
						? 'fx-sidebar__section fx-sidebar__section--active'
						: 'fx-sidebar__section';

					return (
						<div key={section} className={sectionClassName}>
							<div key={section} className="fx-sidebar__section__title">{section}</div>
							{types}
						</div>
					);
				})}
			</div>
			<div className="fx-body">{Children.map(props.children, (child) => {
				if (!props.params.type) return child;

				const Type = Types[props.params.type];

				return cloneElement(child, {
					FieldComponent: Type.Field,
					FilterComponent: Type.Filter,
					filter: Type.Filter.getDefaultValue(),
					readme: Type.readme,
					section: Type.section,
					spec: Type.spec,
					value: Type.value,
				});
			})}</div>
		</div>
	);
};

const Home = (props) => {
	return (
		<div className="fx-welcome">
			<div className="fx-welcome__inner">
				<h1 className="fx-welcome__heading">Welcome!</h1>
				<div className="fx-welcome__content">Select a field on the left to begin exploring...</div>
			</div>
		</div>
	);
};

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path=":type" component={FieldType} />
		</Route>
	</Router>,
	document.getElementById('explorer')
);

function upcase (str = '') {
	return (str.substr(0, 1).toUpperCase() + str.substr(1));
};
