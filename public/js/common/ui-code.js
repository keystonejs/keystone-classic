jQuery(function($) {
	if (!window.CodeMirror)
		return;

	$("textarea.dev-code").each(function(index, element) {
		var $element = $(element);
		var lang = $element.data('dev-lang');
		var mime = $element.data('dev-mime');


		CodeMirror.commands.autocomplete = function(cm) {
			var mode = cm.options.mode;
			var hint = null;

			switch(mode) {
				case "text/x-coffeescript": hint = CodeMirror.hint.coffeescript; break;
				case "text/css":
				case "text/x-less":
				case "text/x-sass":
					hint = CodeMirror.hint.css; break;
				case "text/html": hint = CodeMirror.hint.html; break;
				case "text/javascript": hint = CodeMirror.hint.javascript; break;
				case "text/x-python": hint = CodeMirror.hint.python; break;
				case "text/x-sql": hint = CodeMirror.hint.sql; break;
				case "text/xml": hint = CodeMirror.hint.xml; break;
			}

			CodeMirror.showHint(cm, CodeMirror.hint.anyword);

			if(hint != null) {
				CodeMirror.showHint(cm, hint);
			}
		};


		var editor = CodeMirror.fromTextArea(element, {
			mode: mime,
			lineNumbers: true,
        	extraKeys: {"Ctrl-Space": "autocomplete"},
        	autoCloseTags: true,
			styleActiveLine: true,
			autoCloseBrackets: true,
			matchBrackets: true
		});


		if(lang == "js" || lang == "json") {
			editor.setOption("gutters", ["CodeMirror-lint-markers"]);
			editor.setOption("lintWith", CodeMirror.javascriptValidator);
		}
	});
});
