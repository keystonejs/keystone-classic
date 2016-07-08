import React from 'react';
import { Link, Router, Route, browserHistory, IndexRoute } from 'react-router';
import ReactDOM from 'react-dom';
import FieldType from './field';

const TypeKeys = {
	Text: [
		'Color',
		'Email',
		'Key',
		'Name',
		'Text',
		'Textarea',
		'Textarray',
		'Url',
	],
	Date: [
		'Date',
		'Datetime',
	],
	Number: [],
	Miscellaneous: [
		'Boolean',
		'Password',
	],
};

const App = (props) => {
	return (
		<div className="fx-wrapper">
			<div className="fx-sidebar">
				<div className="fx-sidebar__header">{props.params.type
					? <Link to="/" className="fx-sidebar__header__link">Exploring</Link>
					: 'Ready'}
				</div>
				{Object.keys(TypeKeys).map(section => {
					const types = TypeKeys[section].map(type => {

						const itemClassName = props.params.type === type
							? 'fx-sidebar__item fx-sidebar__item--active'
							: 'fx-sidebar__item';

						return (
							<Link key={type} to={`/${section}/${type}`} className={itemClassName}>
								{upcase(type)}
							</Link>
						);
					});

					const sectionClassName = props.params.section === section
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
			<div className="fx-body">{props.children}</div>
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
			<Route path=":section/:type" component={FieldType} />
		</Route>
	</Router>,
	document.getElementById('explorer')
);

function upcase (str) {
	return (str.substr(0, 1).toUpperCase() + str.substr(1));
};
