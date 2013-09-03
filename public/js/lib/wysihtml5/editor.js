!function($, wysi) {
	
	var templates = {
		// "font-styles": "<li class='dropdown'>" +
		// 					"<a class='btn dropdown-toggle' data-toggle='dropdown' href='#'>" +
		// 						"<i class='icon-edit-size'></i>&nbsp;<span class='current-font'>Style</span>&nbsp;<b class='caret'></b>" +
		// 					"</a>" +
		// 					"<ul class='dropdown-menu'>" +
		// 						"<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='div'>Normal text</a></li>" +
		// 						"<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h2'>Heading</a></li>" +
		// 						"<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h3'>Subheading</a></li>" +
		// 					"</ul>" +
		// 				"</li>",
		"emphasis":		 "<li>" +
							"<div class='btn-group btn-group-sm'>" +		
								"<a class='btn btn-default' data-wysihtml5-command='bold' title='CTRL+B'><i class='icon-edit-bold'></i></a>" +
								"<a class='btn btn-default' data-wysihtml5-command='italic' title='CTRL+I'><i class='icon-edit-italic'></i></a>" +
							"</div>" +
						"</li>",
		"lists": 		"<li>" +
							"<div class='btn-group btn-group-sm'>" +
								"<a class='btn btn-default' data-wysihtml5-command='insertUnorderedList' title='Unordered List'><i class='icon-edit-list'></i></a>" +
								"<a class='btn btn-default' data-wysihtml5-command='insertOrderedList' title='Ordered List'><i class='icon-edit-list-order'></i></a>" +
								"<a class='btn btn-default' data-wysihtml5-command='Indent' title='Indent'><i class='icon-edit-indent'></i></a>" +
								"<a class='btn btn-default' data-wysihtml5-command='Outdent' title='Outdent'><i class='icon-edit-outdent'></i></a>" +
							"</div>" +
						"</li>",
		"assets":		"<li>" +
		//					"<div class='btn-group btn-group-sm'>" +
		//						"<a class='btn btn-default btn-sm insert-image' data-wysihtml5-command='insertImage' title='Insert Image' href='javascript:;'><i class='icon-edit-image'></i></a>" +
								"<a class='btn btn-default btn-sm insert-link' data-wysihtml5-command='createLink' title='Insert Link' href='javascript:;'><i class='icon-edit-link'></i></a>" +
		//					"</div>" +
						"</li>",
		"source":		"<li>" +
							"<a class='btn btn-default btn-sm' data-wysihtml5-action='change_view'>" +
								"<i class='icon-edit-code'></i>" +
							"</a>" +
						"</li>"
	};
	
	var dialogsHTML =
		'<li data-wysihtml5-dialog="createLink" style="display: none;">' +
			'<span class="ui-wysiwyg-dialog">' +
				//'<label>' +
					//'Link:' +
					'<input data-wysihtml5-dialog-field="href" value="" placeholder="Add a link to a website, e.g http://www.keystonejs.com">' +
				//'</label>' +
				'<a class="ok-btn" data-wysihtml5-dialog-action="save"><i class="icon-ok"></i></a>' +
				'<a class="remove-btn" data-wysihtml5-dialog-action="cancel"><i class="icon-remove"></i></a>' +
			'</span>' +
			//'<span class="ui-wysiwyg-hint">Add a link to a website. Use the entire link including the <em>http://</em>, for example: <em>http://www.keystonejs.com</em></span>' +
		'</li>' +
		
		'<li data-wysihtml5-dialog="insertImage" style="display: none;">' +
			'<span class="ui-wysiwyg-dialog">' +
			//'<label>' +
				//'Link:' +
				'<input data-wysihtml5-dialog-field="src" value="">' +
			//'</label>' +
			'<a class="ok-btn" data-wysihtml5-dialog-action="save" href="javascript:;"><i class="icon-ok"></i></a>' +
			'<a class="remove-btn" data-wysihtml5-dialog-action="cancel" href="javascript:;"><i class="icon-remove"></i></a>' +
			'</span>' +
			'<span class="ui-wysiwyg-hint">Insert an image via a link. Use the entire link including the <em>http://</em>, for example: <em>http://website.com/image.jpg</em></span>' +
		'</li>' +
		
		'';
	
	var defaultOptions = {
		"font-styles": true,
		"emphasis": true,
		"lists": true,
		"assets": true,
		"source": true
	};
	
	var parserRules = {
		tags: {
			b:	{},
			i:	{},
			br: {},
			ol: {},
			ul: {},
			li: {},
			h1: {},
			h2: {},
			h3: {},
			h4: {},
			div: {},
			p: {},
			span: {},
			a:	{
				set_attributes: {
					target: "_blank",
					rel:	"nofollow"
				},
				check_attributes: {
					href:	"url" // important to avoid XSS
				}
			},
			iframe: {
				check_attributes: {
					src:	"url", // important to avoid XSS,
					width:	"numberPercentage",
					height:	"numberPercentage"
				}
			}
		}
	};

	var Wysihtml5 = function(el, options) {
		this.el = el;
		this.toolbar = this.createToolbar(el, options || defaultOptions);
		this.editor = new wysi.Editor(this.el.attr('id'), {
			toolbar: this.toolbar.attr('id'),
			parserRules: parserRules
		});
		var self = this;
		this.editor.observe("change_view", function(currentView) {
			if (currentView == 'textarea')
				self.toolbar.find("a[data-wysihtml5-action='change_view']").addClass('active');
			else
				self.toolbar.find("a[data-wysihtml5-action='change_view']").removeClass('active');
		});
		/*
		Need something to handle clicks from the style dropdown to the editor, this ain't quite it...
		$('iframe.wysihtml5-sandbox').each(function(i, el){
			$(el.contentWindow).off('focus.wysihtml5').on({
				'focus.wysihtml5' : function(){
					 $('li.dropdown').removeClass('open');
				 }
			});
		});
		*/
	};
	
	Wysihtml5.prototype = {
		
		constructor: Wysihtml5,
		
		createToolbar: function(el, options) {
			
			var toolbar = $("<ul/>", {
					id : el.attr('id') + "-wysihtml5-toolbar",
					"class" : "wysihtml5-toolbar",
					style: "display:none"
				});

			for(var key in defaultOptions)
			{
				var value;
				
				if(options[key] != undefined)
				{
					if(options[key] == true)
						value = true;
				}
				else
				{
					value = defaultOptions[key];
				}
				
				if(value == true)
					toolbar.append(templates[key]);
			}
			
			var self = this;
			
			/*
			Could select the current format in the style dropdown, not like this though...
			toolbar.find("a[data-wysihtml5-command='formatBlock']").click(function(e) {
				var el = $(e.srcElement);
				self.toolbar.find('.current-font').text(el.html() )
			});
			*/
			
			this.el.before(toolbar);
			
			$(dialogsHTML).appendTo(toolbar);
			
			return toolbar;
		}
		
	};

	$.fn.wysihtml5 = function (options) {
		return this.each(function () {
				var $this = $(this);
				$this.data('wysihtml5', new Wysihtml5($this, options));
			});
	};

	$.fn.wysihtml5.Constructor = Wysihtml5;
	
}(jQuery, wysihtml5);

jQuery(function($) {
	
	$('textarea.wysiwyg').each(function() {
	
		var $field = $(this);
		
		if (!$field.prop('id'))
			$field.prop('id', 'ui-wysiwyg-' + new Date().getTime());
		
		$field.wysihtml5();
		
		setTimeout(function() {
			$field.addClass('code');
		}, 1000);
	
	});
	
});