/**
 * Compiled inline version. (Library mode)
 */

/*jshint smarttabs:true, undef:true, latedef:true, curly:true, bitwise:true, camelcase:true */
/*globals $code */

(function(exports, undefined) {
	"use strict";

	var modules = {};

	function require(ids, callback) {
		var module, defs = [];

		for (var i = 0; i < ids.length; ++i) {
			module = modules[ids[i]] || resolve(ids[i]);
			if (!module) {
				throw 'module definition dependecy not found: ' + ids[i];
			}

			defs.push(module);
		}

		callback.apply(null, defs);
	}

	function define(id, dependencies, definition) {
		if (typeof id !== 'string') {
			throw 'invalid module definition, module id must be defined and be a string';
		}

		if (dependencies === undefined) {
			throw 'invalid module definition, dependencies must be specified';
		}

		if (definition === undefined) {
			throw 'invalid module definition, definition function must be specified';
		}

		require(dependencies, function() {
			modules[id] = definition.apply(null, arguments);
		});
	}

	function defined(id) {
		return !!modules[id];
	}

	function resolve(id) {
		var target = exports;
		var fragments = id.split(/[.\/]/);

		for (var fi = 0; fi < fragments.length; ++fi) {
			if (!target[fragments[fi]]) {
				return;
			}

			target = target[fragments[fi]];
		}

		return target;
	}

	function expose(ids) {
		for (var i = 0; i < ids.length; i++) {
			var target = exports;
			var id = ids[i];
			var fragments = id.split(/[.\/]/);

			for (var fi = 0; fi < fragments.length - 1; ++fi) {
				if (target[fragments[fi]] === undefined) {
					target[fragments[fi]] = {};
				}

				target = target[fragments[fi]];
			}

			target[fragments[fragments.length - 1]] = modules[id];
		}
	}

// Included from: js/tinymce/plugins/paste/classes/Clipboard.js

/**
 * Clipboard.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains logic for getting HTML contents out of the clipboard.
 *
 * @class tinymce.pasteplugin.Clipboard
 * @private
 */
define("tinymce/pasteplugin/Clipboard", [
	"tinymce/Env",
	"tinymce/util/Tools",
	"tinymce/util/VK",
	"tinymce/html/DomParser",
	"tinymce/html/Serializer",
	"tinymce/html/Schema"
], function(Env, Tools, VK, DomParser, Serializer, Schema) {
	function hasClipboardData() {
		// Gecko is excluded until the fix: https://bugzilla.mozilla.org/show_bug.cgi?id=850663
		return !Env.gecko && (("ClipboardEvent" in window) || (Env.webkit && "FocusEvent" in window));
	}

	return function(editor) {
		var self = this, plainTextPasteTime;

		function now() {
			return new Date().getTime();
		}

		function isPasteKeyEvent(e) {
			// Ctrl+V or Shift+Insert
			return (VK.metaKeyPressed(e) && e.keyCode == 86) || (e.shiftKey && e.keyCode == 45);
		}

		/**
		 * Gets the innerText of the specified element. It will handle edge cases
		 * and works better than textContent on Gecko.
		 *
		 * @param {Element} elm HTML element to get text from.
		 * @return {String} String of text with line feeds.
		 */
		function innerText(elm) {
			var schema = new Schema(), domParser = new DomParser({}, schema), text = '';
			var shortEndedElements = schema.getShortEndedElements();
			var ignoreElements = Tools.makeMap('script noscript style textarea video audio iframe object', ' ');
			var blockElements = editor.schema.getBlockElements();

			function walk(node) {
				var name = node.name, currentNode = node;

				if (name === 'br') {
					text += '\n';
					return;
				}

				// img/input/hr
				if (shortEndedElements[name]) {
					text += ' ';
				}

				// Ingore script, video contents
				if (ignoreElements[name]) {
					text += ' ';
					return;
				}

				if (node.type == 3) {
					text += node.value;
				}

				// Walk all children
				if (!node.shortEnded) {
					if ((node = node.firstChild)) {
						do {
							walk(node);
						} while ((node = node.next));
					}
				}

				// Add \n or \n\n for blocks or P
				if (blockElements[name] && currentNode.next) {
					text += '\n';

					if (name == 'p') {
						text += '\n';
					}
				}
			}

			walk(domParser.parse(elm.innerHTML));

			return text;
		}

		function shouldPasteAsPlainText() {
			return now() - plainTextPasteTime < 100 || self.pasteFormat == "text";
		}

		// TODO: Move this to a class?
		function process(content, items) {
			Tools.each(items, function(v) {
				if (v.constructor == RegExp) {
					content = content.replace(v, '');
				} else {
					content = content.replace(v[0], v[1]);
				}
			});

			return content;
		}

		function processHtml(html) {
			var args = editor.fire('PastePreProcess', {content: html}), dom = editor.dom;

			html = args.content;

			// Remove all data images from paste for example from Gecko
			if (!editor.settings.paste_data_images) {
				html = html.replace(/<img src=\"data:image[^>]+>/g, '');
			}

			if (editor.settings.paste_remove_styles || (editor.settings.paste_remove_styles_if_webkit !== false && Env.webkit)) {
				html = html.replace(/ style=\"[^\"]+\"/g, '');
			}

			if (!args.isDefaultPrevented()) {
				// User has bound PastePostProcess events then we need to pass it through a DOM node
				// This is not ideal but we don't want to let the browser mess up the HTML for example
				// some browsers add &nbsp; to P tags etc
				if (editor.hasEventListeners('PastePostProcess') && !args.isDefaultPrevented()) {
					// We need to attach the element to the DOM so Sizzle selectors work on the contents
					var tempBody = dom.add(editor.getBody(), 'div', {style: 'display:none'}, html);
					args = editor.fire('PastePostProcess', {node: tempBody});
					dom.remove(tempBody);
					html = args.node.innerHTML;
				}

				if (!args.isDefaultPrevented()) {
					editor.insertContent(html);
				}
			}
		}

		function processText(text) {
			text = editor.dom.encode(text).replace(/\r\n/g, '\n');

			var startBlock = editor.dom.getParent(editor.selection.getStart(), editor.dom.isBlock);

			if ((startBlock && /^(PRE|DIV)$/.test(startBlock.nodeName)) || !editor.settings.forced_root_block) {
				text = process(text, [
					[/\n/g, "<br>"]
				]);
			} else {
				text = process(text, [
					[/\n\n/g, "</p><p>"],
					[/^(.*<\/p>)(<p>)$/, '<p>$1'],
					[/\n/g, "<br />"]
				]);
			}

			processHtml(text);
		}

		function createPasteBin() {
			var scrollTop = editor.dom.getViewPort().y;

			// Create a pastebin and move the selection into the bin
			var pastebinElm = editor.dom.add(editor.getBody(), 'div', {
				contentEditable: false,
				"data-mce-bogus": "1",
				style: 'position: absolute; top: ' + scrollTop + 'px; left: 0; width: 1px; height: 1px; overflow: hidden'
			}, '<div contentEditable="true" data-mce-bogus="1">X</div>');

			editor.dom.bind(pastebinElm, 'beforedeactivate focusin focusout', function(e) {
				e.stopPropagation();
			});

			return pastebinElm;
		}

		function removePasteBin(pastebinElm) {
			editor.dom.unbind(pastebinElm);
			editor.dom.remove(pastebinElm);
		}

		editor.on('keydown', function(e) {
			// Shift+Ctrl+V
			if (VK.metaKeyPressed(e) && e.shiftKey && e.keyCode == 86) {
				plainTextPasteTime = now();
			}
		});

		// Use Clipboard API if it's available
		if (hasClipboardData()) {
			editor.on('paste', function(e) {
				var clipboardData = e.clipboardData;

				function processByContentType(contentType, processFunc) {
					for (var ti = 0; ti < clipboardData.types.length; ti++) {
						if (clipboardData.types[ti] == contentType) {
							processFunc(clipboardData.getData(contentType));
							//clipboardData.items[ti].getAsString(processFunc);
							return true;
						}
					}
				}

				if (clipboardData) {
					e.preventDefault();

					if (shouldPasteAsPlainText()) {
						// First look for HTML then look for plain text
						if (!processByContentType('text/plain', processText)) {
							processByContentType('text/html', processHtml);
						}
					} else {
						// First look for HTML then look for plain text
						if (!processByContentType('text/html', processHtml)) {
							processByContentType('text/plain', processText);
						}
					}
				}
			});
		} else {
			if (Env.ie) {
				var keyPasteTime = 0;

				editor.on('keydown', function(e) {
					if (isPasteKeyEvent(e) && !e.isDefaultPrevented()) {
						// Prevent undoManager keydown handler from making an undo level with the pastebin in it
						e.stopImmediatePropagation();

						var pastebinElm = createPasteBin();
						keyPasteTime = now();

						editor.dom.bind(pastebinElm, 'paste', function() {
							setTimeout(function() {
								editor.selection.setRng(lastRng);
								removePasteBin(pastebinElm);

								if (shouldPasteAsPlainText()) {
									processText(innerText(pastebinElm.firstChild));
								} else {
									processHtml(pastebinElm.firstChild.innerHTML);
								}
							}, 0);
						});

						var lastRng = editor.selection.getRng();
						pastebinElm.firstChild.focus();
						pastebinElm.firstChild.innerText = '';
					}
				});

				// Explorer fallback
				editor.on('init', function() {
					var dom = editor.dom;

					// Use a different method if the paste was made without using the keyboard
					// for example using the browser menu items
					editor.dom.bind(editor.getBody(), 'paste', function(e) {
						if (now() - keyPasteTime > 100) {
							var gotPasteEvent, pastebinElm = createPasteBin();

							e.preventDefault();

							dom.bind(pastebinElm, 'paste', function(e) {
								e.stopPropagation();
								gotPasteEvent = true;
							});

							var lastRng = editor.selection.getRng();

							// Select the container
							var rng = dom.doc.body.createTextRange();
							rng.moveToElementText(pastebinElm.firstChild);
							rng.execCommand('Paste');
							removePasteBin(pastebinElm);

							if (!gotPasteEvent) {
								editor.windowManager.alert('Please use Ctrl+V/Cmd+V keyboard shortcuts to paste contents.');
								return;
							}

							editor.selection.setRng(lastRng);

							if (shouldPasteAsPlainText()) {
								processText(innerText(pastebinElm.firstChild));
							} else {
								processHtml(pastebinElm.firstChild.innerHTML);
							}
						}
					});
				});
			} else {
				editor.on('init', function() {
					editor.dom.bind(editor.getBody(), 'paste', function(e) {
						var doc = editor.getDoc();

						e.preventDefault();

						// Paste as plain text when not using the keyboard
						if (e.clipboardData || doc.dataTransfer) {
							processText((e.clipboardData || doc.dataTransfer).getData('Text'));
							return;
						}

						e.preventDefault();
						editor.windowManager.alert('Please use Ctrl+V/Cmd+V keyboard shortcuts to paste contents.');
					});
				});

				// Old Gecko/WebKit/Opera fallback
				editor.on('keydown', function(e) {
					if (isPasteKeyEvent(e) && !e.isDefaultPrevented()) {
						// Prevent undoManager keydown handler from making an undo level with the pastebin in it
						e.stopImmediatePropagation();

						var pastebinElm = createPasteBin();
						var lastRng = editor.selection.getRng();

						// Hack for #6051 & #6256
						if (Env.webkit) {
							pastebinElm.contentEditable = true;
						}

						editor.selection.select(pastebinElm, true);

						editor.dom.bind(pastebinElm, 'paste', function(e) {
							e.stopPropagation();

							setTimeout(function() {
								removePasteBin(pastebinElm);
								editor.lastRng = lastRng;
								editor.selection.setRng(lastRng);

								var pastebinContents = pastebinElm.firstChild;

								// Remove last BR Safari on Mac adds trailing BR
								if (pastebinContents.lastChild && pastebinContents.lastChild.nodeName == 'BR') {
									pastebinContents.removeChild(pastebinContents.lastChild);
								}

								if (shouldPasteAsPlainText()) {
									processText(innerText(pastebinContents));
								} else {
									processHtml(pastebinContents.innerHTML);
								}
							}, 0);
						});
					}
				});
			}

			// Prevent users from dropping data images on Gecko
			if (!editor.settings.paste_data_images) {
				editor.on('drop', function(e) {
					var dataTransfer = e.dataTransfer;

					if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
						e.preventDefault();
					}
				});
			}
		}

		// Block all drag/drop events
		if (editor.paste_block_drop) {
			editor.on('dragend dragover draggesture dragdrop drop drag', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
		}

		this.paste = processHtml;
		this.pasteText = processText;
		this.innerText = innerText;
	};
});

// Included from: js/tinymce/plugins/paste/classes/WordFilter.js

/**
 * WordFilter.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class parses word HTML into proper TinyMCE markup.
 *
 * @class tinymce.pasteplugin.Quirks
 * @private
 */
define("tinymce/pasteplugin/WordFilter", [
	"tinymce/util/Tools",
	"tinymce/html/DomParser",
	"tinymce/html/Schema",
	"tinymce/html/Serializer",
	"tinymce/html/Node"
], function(Tools, DomParser, Schema, Serializer, Node) {
	function isWordContent(content) {
		return (/class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i).test(content);
	}

	function WordFilter(editor) {
		var each = Tools.each, settings = editor.settings;

		editor.on('PastePreProcess', function(e) {
			var content = e.content, retainStyleProperties, validStyles;

			retainStyleProperties = settings.paste_retain_style_properties;
			if (retainStyleProperties) {
				validStyles = Tools.makeMap(retainStyleProperties);
			}

			function process(items) {
				each(items, function(v) {
					if (v.constructor == RegExp) {
						content = content.replace(v, '');
					} else {
						content = content.replace(v[0], v[1]);
					}
				});
			}

			/**
			 * Converts fake bullet and numbered lists to real semantic OL/UL.
			 *
			 * @param {tinymce.html.Node} node Root node to convert children of.
			 */
			function convertFakeListsToProperLists(node) {
				var currentListNode, prevListNode, lastLevel = 1;

				function convertParagraphToLi(paragraphNode, listStartTextNode, listName, start) {
					var level = paragraphNode._listLevel || lastLevel;

					// Handle list nesting
					if (level != lastLevel) {
						if (level < lastLevel) {
							// Move to parent list
							if (currentListNode) {
								currentListNode = currentListNode.parent.parent;
							}
						} else {
							// Create new list
							prevListNode = currentListNode;
							currentListNode = null;
						}
					}

					if (!currentListNode || currentListNode.name != listName) {
						prevListNode = prevListNode || currentListNode;
						currentListNode = new Node(listName, 1);

						if (start > 1) {
							currentListNode.attr('start', '' + start);
						}

						paragraphNode.wrap(currentListNode);
					} else {
						currentListNode.append(paragraphNode);
					}

					paragraphNode.name = 'li';
					listStartTextNode.value = '';

					var nextNode = listStartTextNode.next;
					if (nextNode && nextNode.type == 3) {
						nextNode.value = nextNode.value.replace(/^\u00a0+/, '');
					}

					// Append list to previous list if it exists
					if (level > lastLevel && prevListNode) {
						prevListNode.lastChild.append(currentListNode);
					}

					lastLevel = level;
				}

				var paragraphs = node.getAll('p');

				for (var i = 0; i < paragraphs.length; i++) {
					node = paragraphs[i];

					if (node.name == 'p' && node.firstChild) {
						// Find first text node in paragraph
						var nodeText = '';
						var listStartTextNode = node.firstChild;

						while (listStartTextNode) {
							nodeText = listStartTextNode.value;
							if (nodeText) {
								break;
							}

							listStartTextNode = listStartTextNode.firstChild;
						}

						// Detect unordered lists look for bullets
						if (/^\s*[\u2022\u00b7\u00a7\u00d8\u25CF]\s*$/.test(nodeText)) {
							convertParagraphToLi(node, listStartTextNode, 'ul');
							continue;
						}

						// Detect ordered lists 1., a. or ixv.
						if (/^\s*\w+\.$/.test(nodeText)) {
							// Parse OL start number
							var matches = /([0-9])\./.exec(nodeText);
							var start = 1;
							if (matches) {
								start = parseInt(matches[1], 10);
							}

							convertParagraphToLi(node, listStartTextNode, 'ol', start);
							continue;
						}

						currentListNode = null;
					}
				}
			}

			function filterStyles(node, styleValue) {
				// Parse out list indent level for lists
				if (node.name === 'p') {
					var matches = /mso-list:\w+ \w+([0-9]+)/.exec(styleValue);

					if (matches) {
						node._listLevel = parseInt(matches[1], 10);
					}
				}

				if (editor.getParam("paste_retain_style_properties", "none")) {
					var outputStyle = "";

					Tools.each(editor.dom.parseStyle(styleValue), function(value, name) {
						// Convert various MS styles to W3C styles
						switch (name) {
							case "horiz-align":
								name = "text-align";
								return;

							case "vert-align":
								name = "vertical-align";
								return;

							case "font-color":
							case "mso-foreground":
								name = "color";
								return;

							case "mso-background":
							case "mso-highlight":
								name = "background";
								break;
						}

						// Output only valid styles
						if (retainStyleProperties == "all" || (validStyles && validStyles[name])) {
							outputStyle += name + ':' + value + ';';
						}
					});

					if (outputStyle) {
						return outputStyle;
					}
				}

				return null;
			}

			if (settings.paste_enable_default_filters === false) {
				return;
			}

			// Detect is the contents is Word junk HTML
			if (isWordContent(e.content)) {
				e.wordContent = true; // Mark it for other processors

				// Remove basic Word junk
				process([
					// Word comments like conditional comments etc
					/<!--[\s\S]+?-->/gi,

					// Remove comments, scripts (e.g., msoShowComment), XML tag, VML content,
					// MS Office namespaced tags, and a few other tags
					/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi,

					// Convert <s> into <strike> for line-though
					[/<(\/?)s>/gi, "<$1strike>"],

					// Replace nsbp entites to char since it's easier to handle
					[/&nbsp;/gi, "\u00a0"],

					// Convert <span style="mso-spacerun:yes">___</span> to string of alternating
					// breaking/non-breaking spaces of same length
					[/<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi,
						function(str, spaces) {
							return (spaces.length > 0) ?
								spaces.replace(/./, " ").slice(Math.floor(spaces.length/2)).split("").join("\u00a0") : "";
						}
					]
				]);

				var validElements = settings.paste_word_valid_elements;
				if (!validElements) {
					validElements = '@[style],-strong/b,-em/i,-span,-p,-ol,-ul,-li,-h1,-h2,-h3,-h4,-h5,-h6,' +
						'-table,-tr,-td[colspan|rowspan],-th,-thead,-tfoot,-tbody,-a[!href],sub,sup,strike,br';
				}

				// Setup strict schema
				var schema = new Schema({
					valid_elements: validElements
				});

				// Parse HTML into DOM structure
				var domParser = new DomParser({}, schema);

				// Filte element style attributes
				domParser.addAttributeFilter('style', function(nodes) {
					var i = nodes.length, node;

					while (i--) {
						node = nodes[i];
						node.attr('style', filterStyles(node, node.attr('style')));

						// Remove pointess spans
						if (node.name == 'span' && !node.attributes.length) {
							node.unwrap();
						}
					}
				});

				// Parse into DOM structure
				var rootNode = domParser.parse(content);

				// Process DOM
				convertFakeListsToProperLists(rootNode);

				// Serialize DOM back to HTML
				e.content = new Serializer({}, schema).serialize(rootNode);
			}
		});
	}

	WordFilter.isWordContent = isWordContent;

	return WordFilter;
});

// Included from: js/tinymce/plugins/paste/classes/Quirks.js

/**
 * Quirks.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains various fixes for browsers. These issues can not be feature
 * detected since we have no direct control over the clipboard. However we might be able
 * to remove some of these fixes once the browsers gets updated/fixed.
 *
 * @class tinymce.pasteplugin.Quirks
 * @private
 */
define("tinymce/pasteplugin/Quirks", [
	"tinymce/Env",
	"tinymce/util/Tools",
	"tinymce/pasteplugin/WordFilter"
], function(Env, Tools, WordFilter) {
	"use strict";

	return function(editor) {
		var explorerBlocksRegExp;

		function addPreProcessFilter(filterFunc) {
			editor.on('PastePreProcess', function(e) {
				e.content = filterFunc(e.content);
			});
		}

		function process(content, items) {
			Tools.each(items, function(v) {
				if (v.constructor == RegExp) {
					content = content.replace(v, '');
				} else {
					content = content.replace(v[0], v[1]);
				}
			});

			return content;
		}

		/**
		 * Removes WebKit fragment comments and converted-space spans.
		 *
		 * This:
		 *   <!--StartFragment-->a<span class="Apple-converted-space">&nbsp;</span>b<!--EndFragment-->
		 *
		 * Becomes:
		 *   a&nbsp;b
		 */
		function removeWebKitFragments(html) {
			html = process(html, [
				/^[\s\S]*<!--StartFragment-->|<!--EndFragment-->[\s\S]*$/g,        // WebKit fragment
				[/<span class="Apple-converted-space">\u00a0<\/span>/g, '\u00a0'], // WebKit &nbsp;
				/<br>$/															   // Traling BR elements
			]);

			return html;
		}

		/**
		 * Removes BR elements after block elements. IE9 has a nasty bug where it puts a BR element after each
		 * block element when pasting from word. This removes those elements.
		 *
		 * This:
		 *  <p>a</p><br><p>b</p>
		 *
		 * Becomes:
		 *  <p>a</p><p>b</p>
		 */
		function removeExplorerBrElementsAfterBlocks(html) {
			// Only filter word specific content
			if (!WordFilter.isWordContent(html)) {
				return html;
			}

			// Produce block regexp based on the block elements in schema
			if (!explorerBlocksRegExp) {
				var blockElements = [];

				Tools.each(editor.schema.getBlockElements(), function(block, blockName) {
					blockElements.push(blockName);
				});

				explorerBlocksRegExp = new RegExp(
					'(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*(<\\/?(' + blockElements.join('|') + ')[^>]*>)(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*',
					'g'
				);
			}

			// Remove BR:s from: <BLOCK>X</BLOCK><BR>
			html = process(html, [
				[explorerBlocksRegExp, '$1']
			]);

			// IE9 also adds an extra BR element for each soft-linefeed and it also adds a BR for each word wrap break
			html = process(html, [
				[/<br><br>/g, '<BR><BR>'], // Replace multiple BR elements with uppercase BR to keep them intact
				[/<br>/g, ' '],            // Replace single br elements with space since they are word wrap BR:s
				[/<BR><BR>/g, '<br>']      // Replace back the double brs but into a single BR
			]);

			return html;
		}

		// Sniff browsers and apply fixes since we can't feature detect
		if (Env.webkit) {
			addPreProcessFilter(removeWebKitFragments);
		}

		if (Env.ie) {
			addPreProcessFilter(removeExplorerBrElementsAfterBlocks);
		}
	};
});

// Included from: js/tinymce/plugins/paste/classes/Plugin.js

/**
 * Plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains the tinymce plugin logic for the paste plugin.
 *
 * @class tinymce.pasteplugin.Plugin
 * @private
 */
define("tinymce/pasteplugin/Plugin", [
	"tinymce/PluginManager",
	"tinymce/pasteplugin/Clipboard",
	"tinymce/pasteplugin/WordFilter",
	"tinymce/pasteplugin/Quirks"
], function(PluginManager, Clipboard, WordFilter, Quirks) {
	var userIsInformed;

	PluginManager.add('paste', function(editor) {
		var self = this, clipboard, settings = editor.settings;

		function togglePlainTextPaste() {
			if (clipboard.pasteFormat == "text") {
				this.active(false);
				clipboard.pasteFormat = "html";
			} else {
				clipboard.pasteFormat = "text";
				this.active(true);

				if (!userIsInformed) {
					editor.windowManager.alert(
						'Paste is now in plain text mode. Contents will now ' +
						'be pasted as plain text until you toggle this option off.'
					);

					userIsInformed = true;
				}
			}
		}

		self.clipboard = clipboard = new Clipboard(editor);
		self.quirks = new Quirks(editor);
		self.wordFilter = new WordFilter(editor);
		self.innerText = clipboard.innerText;

		if (editor.settings.paste_as_text) {
			self.clipboard.pasteFormat = "text";
		}

		if (settings.paste_preprocess) {
			editor.on('PastePreProcess', function(e) {
				settings.paste_preprocess.call(self, self, e);
			});
		}

		if (settings.paste_postprocess) {
			editor.on('PastePostProcess', function(e) {
				settings.paste_postprocess.call(self, self, e);
			});
		}

		editor.addCommand('mceInsertClipboardContent', function(ui, value) {
			if (value.content) {
				self.clipboard.paste(value.content);
			}

			if (value.text) {
				self.clipboard.pasteText(value.text);
			}
		});

		editor.addButton('pastetext', {
			icon: 'pastetext',
			tooltip: 'Paste as text',
			onclick: togglePlainTextPaste,
			active: self.clipboard.pasteFormat == "text"
		});

		editor.addMenuItem('pastetext', {
			text: 'Paste as text',
			selectable: true,
			active: clipboard.pasteFormat,
			onclick: togglePlainTextPaste
		});
	});
});

expose(["tinymce/pasteplugin/Clipboard","tinymce/pasteplugin/WordFilter","tinymce/pasteplugin/Quirks","tinymce/pasteplugin/Plugin"]);
})(this);