var React = require('react'),
	Field = require('../Field');

// Scope jQuery and the bootstrap-markdown editor so it will mount
var $ = require('jquery');
require('./lib/bootstrap-markdown');

// Append/remove ### surround the selection
// Source: https://github.com/toopay/bootstrap-markdown/blob/master/js/bootstrap-markdown.js#L909
var headingCallback = function (e, hType) {
	var chunk, cursor, selected = e.getSelection(), content = e.getContent(), pointer, prevChar;

	if (selected.length == 0) {
		// Give extra word
		chunk = e.__localize('heading text');
	} else {
		chunk = selected.text + '\n';
	}

	// transform selection and set the cursor into chunked text
	if ((pointer = hType.length+1, content.substr(selected.start-pointer,pointer) == hType+' ')
		|| (pointer = hType.length, content.substr(selected.start-pointer,pointer) == hType)) {
		e.setSelection(selected.start-pointer,selected.end);
		e.replaceSelection(chunk);
		cursor = selected.start-pointer;
	} else if (selected.start > 0 && (prevChar = content.substr(selected.start-1,1), !!prevChar && prevChar != '\n')) {
		e.replaceSelection('\n\n'+hType+' '+chunk);
		cursor = selected.start+hType.length+3;
	} else {
		// Empty string before element
		e.replaceSelection(hType+' '+chunk);
		cursor = selected.start+hType.length+1;
	}

	// Set the cursor
	e.setSelection(cursor,cursor+chunk.length);
};

var renderMarkdown = function (component) {
	// dependsOn means that sometimes the component is mounted as a null, so account for that & noop
	if(!component.refs.markdownTextarea) {
		return;
	}

	var options = {
		autofocus: false,
		savable: false,
		resize: 'vertical',

		// Heading buttons
		additionalButtons: [{
			name: 'groupHeaders',
			data: [{
				name: 'cmdH1',
				title: 'Heading 1',
				btnText: 'H1',
				callback: function(e){
					headingCallback(e, '#');
				}
			},{
				name: 'cmdH2',
				title: 'Heading 2',
				btnText: 'H2',
				callback: function(e){
					headingCallback(e, '##');
				}
			},{
				name: 'cmdH3',
				title: 'Heading 3',
				btnText: 'H3',
				callback: function(e){
					headingCallback(e, '###');
				}
			},{
				name: 'cmdH4',
				title: 'Heading 4',
				btnText: 'H4',
				callback: function(e){
					headingCallback(e, '####');
				}
			}]
		}],

		// Insert Header buttons into the toolbar
		reorderButtonGroups: ['groupFont', 'groupHeaders', 'groupLink', 'groupMisc', 'groupUtil']
	};
	
	$(component.refs.markdownTextarea.getDOMNode()).markdown(options);
};

module.exports = Field.create({
	
	displayName: 'MarkdownField',
	
	// only have access to `refs` once component is mounted
	componentDidMount: function() {
		renderMarkdown(this);
	},

	// only have access to `refs` once component is mounted
	componentDidUpdate : function() {
		renderMarkdown(this);
	},
	
	renderField: function() {
		var styles = {
			padding: 8
		};
		return (
			<div className="md-editor">
				<textarea name={this.props.paths.md} style={styles} defaultValue={this.props.value.md} ref="markdownTextarea" className="form-control markdown code"></textarea>
			</div>
		);
	}
});
