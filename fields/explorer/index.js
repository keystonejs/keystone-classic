import React from 'react';
import { Link, Router, Route, browserHistory, IndexRoute } from 'react-router';
import ReactDOM from 'react-dom';
import FieldType from './field';
const TypeKeys = [
	'Boolean',
	'Color',
	'Date',
	'Datetime',
	'Email',
	'Key',
	'Name',
	'Password',
	'Text',
	'Textarea',
	'Textarray',
	'Url',
];

const App = (props) => {
	return (
		<div className="fx-wrapper">
			<div className="fx-sidebar">
				<div className="fx-sidebar__header">{props.params.type
					? 'Exploring'
					: 'Ready'}
				</div>
				{TypeKeys.map(type => {
					const klass = `fx-sidebar__item${props.params.type === type
						? ' fx-sidebar__item--active'
						: ''}`;
					return (
						<Link key={type} to={type} className={klass}>
							{upcase(type)}
						</Link>
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
			<Route path=":type" component={FieldType} />
		</Route>
	</Router>,
	document.getElementById('explorer')
);

function upcase (str) {
	return (str.substr(0, 1).toUpperCase() + str.substr(1));
};
