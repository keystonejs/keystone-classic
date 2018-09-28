/*
* @Author: django-wong
* @Date:   2018-09-29 00:23:58
* @Last Modified by:   django-wong
* @Last Modified time: 2018-09-29 02:28:33
*/

import Field from '../Field';
import React from 'react';
import GrapesJs from 'grapesjs';
import evalDependsOn from '../../utils/evalDependsOn';
import { FormInput } from '../../../admin/client/App/elemental';


var lastId = 0;

function getId () {
	return 'keystone-pages-' + lastId++;
}

module.exports = Field.create({

	displayName: 'PageField',
	statics: {
		type: 'Page'
	},

	getInitialState () {
		return {
			id: getId()
		};
	},

	componentDidMount () {
		this.initGrapesJs();
	},

	initGrapesJs () {
		var self = this;
		var opts = this.getOptions();
		this.editor = GrapesJs.init(opts);
		this.initButtons();
		window.editor = this.editor;
	},

	initButtons () {
		var editor = this.editor;
		editor.Panels.addButton('options', {
			id: 'button-save',
			className: 'fa fa-save',
			command: function () {
				console.info(editor.getHtml());
			}
		});
	},

	getOptions () {
		var opts = {
			container: '#' + this.state.id,
			fromElement: true,
			width: this.props.width,
			height: this.props.height
		};
		return opts;
	},

	renderField () {
		var style = {
			height: this.props.height,
			width: this.props.width
		};
		return (
			<div id={this.state.id} style={style}>
				<p>Hello World</p>
			</div>
		);
	},

	renderValue () {
		return (
			<FormInput multiline noedit>
				{this.props.value}
			</FormInput>
		)
	}

});
