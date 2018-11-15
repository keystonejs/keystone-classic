(function () {
var legacyoutput = (function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    var overrideFormats = function (editor) {
      var alignElements = 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', fontSizes = global$1.explode(editor.settings.font_size_style_values), schema = editor.schema;
      editor.formatter.register({
        alignleft: {
          selector: alignElements,
          attributes: { align: 'left' }
        },
        aligncenter: {
          selector: alignElements,
          attributes: { align: 'center' }
        },
        alignright: {
          selector: alignElements,
          attributes: { align: 'right' }
        },
        alignjustify: {
          selector: alignElements,
          attributes: { align: 'justify' }
        },
        bold: [
          {
            inline: 'b',
            remove: 'all'
          },
          {
            inline: 'strong',
            remove: 'all'
          },
          {
            inline: 'span',
            styles: { fontWeight: 'bold' }
          }
        ],
        italic: [
          {
            inline: 'i',
            remove: 'all'
          },
          {
            inline: 'em',
            remove: 'all'
          },
          {
            inline: 'span',
            styles: { fontStyle: 'italic' }
          }
        ],
        underline: [
          {
            inline: 'u',
            remove: 'all'
          },
          {
            inline: 'span',
            styles: { textDecoration: 'underline' },
            exact: true
          }
        ],
        strikethrough: [
          {
            inline: 'strike',
            remove: 'all'
          },
          {
            inline: 'span',
            styles: { textDecoration: 'line-through' },
            exact: true
          }
        ],
        fontname: {
          inline: 'font',
          attributes: { face: '%value' }
        },
        fontsize: {
          inline: 'font',
          attributes: {
            size: function (vars) {
              return global$1.inArray(fontSizes, vars.value) + 1;
            }
          }
        },
        forecolor: {
          inline: 'font',
          attributes: { color: '%value' }
        },
        hilitecolor: {
          inline: 'font',
          styles: { backgroundColor: '%value' }
        }
      });
      global$1.each('b,i,u,strike'.split(','), function (name) {
        schema.addValidElements(name + '[*]');
      });
      if (!schema.getElementRule('font')) {
        schema.addValidElements('font[face|size|color|style]');
      }
      global$1.each(alignElements.split(','), function (name) {
        var rule = schema.getElementRule(name);
        if (rule) {
          if (!rule.attributes.align) {
            rule.attributes.align = {};
            rule.attributesOrder.push('align');
          }
        }
      });
    };
    var setup = function (editor) {
      editor.settings.inline_styles = false;
      editor.on('init', function () {
        overrideFormats(editor);
      });
    };
    var Formats = { setup: setup };

    var register = function (editor) {
      editor.addButton('fontsizeselect', function () {
        var items = [], defaultFontsizeFormats = '8pt=1 10pt=2 12pt=3 14pt=4 18pt=5 24pt=6 36pt=7';
        var fontsizeFormats = editor.settings.fontsizeFormats || defaultFontsizeFormats;
        editor.$.each(fontsizeFormats.split(' '), function (i, item) {
          var text = item, value = item;
          var values = item.split('=');
          if (values.length > 1) {
            text = values[0];
            value = values[1];
          }
          items.push({
            text: text,
            value: value
          });
        });
        return {
          type: 'listbox',
          text: 'Font Sizes',
          tooltip: 'Font Sizes',
          values: items,
          fixedWidth: true,
          onPostRender: function () {
            var self = this;
            editor.on('NodeChange', function () {
              var fontElm;
              fontElm = editor.dom.getParent(editor.selection.getNode(), 'font');
              if (fontElm) {
                self.value(fontElm.size);
              } else {
                self.value('');
              }
            });
          },
          onclick: function (e) {
            if (e.control.settings.value) {
              editor.execCommand('FontSize', false, e.control.settings.value);
            }
          }
        };
      });
      editor.addButton('fontselect', function () {
        function createFormats(formats) {
          formats = formats.replace(/;$/, '').split(';');
          var i = formats.length;
          while (i--) {
            formats[i] = formats[i].split('=');
          }
          return formats;
        }
        var defaultFontsFormats = 'Andale Mono=andale mono,monospace;' + 'Arial=arial,helvetica,sans-serif;' + 'Arial Black=arial black,sans-serif;' + 'Book Antiqua=book antiqua,palatino,serif;' + 'Comic Sans MS=comic sans ms,sans-serif;' + 'Courier New=courier new,courier,monospace;' + 'Georgia=georgia,palatino,serif;' + 'Helvetica=helvetica,arial,sans-serif;' + 'Impact=impact,sans-serif;' + 'Symbol=symbol;' + 'Tahoma=tahoma,arial,helvetica,sans-serif;' + 'Terminal=terminal,monaco,monospace;' + 'Times New Roman=times new roman,times,serif;' + 'Trebuchet MS=trebuchet ms,geneva,sans-serif;' + 'Verdana=verdana,geneva,sans-serif;' + 'Webdings=webdings;' + 'Wingdings=wingdings,zapf dingbats';
        var items = [], fonts = createFormats(editor.settings.font_formats || defaultFontsFormats);
        editor.$.each(fonts, function (i, font) {
          items.push({
            text: { raw: font[0] },
            value: font[1],
            textStyle: font[1].indexOf('dings') === -1 ? 'font-family:' + font[1] : ''
          });
        });
        return {
          type: 'listbox',
          text: 'Font Family',
          tooltip: 'Font Family',
          values: items,
          fixedWidth: true,
          onPostRender: function () {
            var self = this;
            editor.on('NodeChange', function () {
              var fontElm;
              fontElm = editor.dom.getParent(editor.selection.getNode(), 'font');
              if (fontElm) {
                self.value(fontElm.face);
              } else {
                self.value('');
              }
            });
          },
          onselect: function (e) {
            if (e.control.settings.value) {
              editor.execCommand('FontName', false, e.control.settings.value);
            }
          }
        };
      });
    };
    var Buttons = { register: register };

    global.add('legacyoutput', function (editor) {
      Formats.setup(editor);
      Buttons.register(editor);
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
