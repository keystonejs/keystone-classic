(function () {
var template = (function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var curry = function (f) {
      var x = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        x[_i - 1] = arguments[_i];
      }
      var args = new Array(arguments.length - 1);
      for (var i = 1; i < arguments.length; i++)
        args[i - 1] = arguments[i];
      return function () {
        var x = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          x[_i] = arguments[_i];
        }
        var newArgs = new Array(arguments.length);
        for (var j = 0; j < newArgs.length; j++)
          newArgs[j] = arguments[j];
        var all = args.concat(newArgs);
        return f.apply(null, all);
      };
    };

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    var global$2 = tinymce.util.Tools.resolve('tinymce.util.XHR');

    var global$3 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    var getCreationDateClasses = function (editor) {
      return editor.getParam('template_cdate_classes', 'cdate');
    };
    var getModificationDateClasses = function (editor) {
      return editor.getParam('template_mdate_classes', 'mdate');
    };
    var getSelectedContentClasses = function (editor) {
      return editor.getParam('template_selected_content_classes', 'selcontent');
    };
    var getPreviewReplaceValues = function (editor) {
      return editor.getParam('template_preview_replace_values');
    };
    var getTemplateReplaceValues = function (editor) {
      return editor.getParam('template_replace_values');
    };
    var getTemplates = function (editorSettings) {
      return editorSettings.templates;
    };
    var getCdateFormat = function (editor) {
      return editor.getParam('template_cdate_format', editor.getLang('template.cdate_format'));
    };
    var getMdateFormat = function (editor) {
      return editor.getParam('template_mdate_format', editor.getLang('template.mdate_format'));
    };
    var getDialogWidth = function (editor) {
      return editor.getParam('template_popup_width', 600);
    };
    var getDialogHeight = function (editor) {
      return Math.min(global$3.DOM.getViewPort().h, editor.getParam('template_popup_height', 500));
    };
    var Settings = {
      getCreationDateClasses: getCreationDateClasses,
      getModificationDateClasses: getModificationDateClasses,
      getSelectedContentClasses: getSelectedContentClasses,
      getPreviewReplaceValues: getPreviewReplaceValues,
      getTemplateReplaceValues: getTemplateReplaceValues,
      getTemplates: getTemplates,
      getCdateFormat: getCdateFormat,
      getMdateFormat: getMdateFormat,
      getDialogWidth: getDialogWidth,
      getDialogHeight: getDialogHeight
    };

    var addZeros = function (value, len) {
      value = '' + value;
      if (value.length < len) {
        for (var i = 0; i < len - value.length; i++) {
          value = '0' + value;
        }
      }
      return value;
    };
    var getDateTime = function (editor, fmt, date) {
      var daysShort = 'Sun Mon Tue Wed Thu Fri Sat Sun'.split(' ');
      var daysLong = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(' ');
      var monthsShort = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
      var monthsLong = 'January February March April May June July August September October November December'.split(' ');
      date = date || new Date();
      fmt = fmt.replace('%D', '%m/%d/%Y');
      fmt = fmt.replace('%r', '%I:%M:%S %p');
      fmt = fmt.replace('%Y', '' + date.getFullYear());
      fmt = fmt.replace('%y', '' + date.getYear());
      fmt = fmt.replace('%m', addZeros(date.getMonth() + 1, 2));
      fmt = fmt.replace('%d', addZeros(date.getDate(), 2));
      fmt = fmt.replace('%H', '' + addZeros(date.getHours(), 2));
      fmt = fmt.replace('%M', '' + addZeros(date.getMinutes(), 2));
      fmt = fmt.replace('%S', '' + addZeros(date.getSeconds(), 2));
      fmt = fmt.replace('%I', '' + ((date.getHours() + 11) % 12 + 1));
      fmt = fmt.replace('%p', '' + (date.getHours() < 12 ? 'AM' : 'PM'));
      fmt = fmt.replace('%B', '' + editor.translate(monthsLong[date.getMonth()]));
      fmt = fmt.replace('%b', '' + editor.translate(monthsShort[date.getMonth()]));
      fmt = fmt.replace('%A', '' + editor.translate(daysLong[date.getDay()]));
      fmt = fmt.replace('%a', '' + editor.translate(daysShort[date.getDay()]));
      fmt = fmt.replace('%%', '%');
      return fmt;
    };
    var DateTimeHelper = { getDateTime: getDateTime };

    var createTemplateList = function (editorSettings, callback) {
      return function () {
        var templateList = Settings.getTemplates(editorSettings);
        if (typeof templateList === 'function') {
          templateList(callback);
          return;
        }
        if (typeof templateList === 'string') {
          global$2.send({
            url: templateList,
            success: function (text) {
              callback(JSON.parse(text));
            }
          });
        } else {
          callback(templateList);
        }
      };
    };
    var replaceTemplateValues = function (editor, html, templateValues) {
      global$1.each(templateValues, function (v, k) {
        if (typeof v === 'function') {
          v = v(k);
        }
        html = html.replace(new RegExp('\\{\\$' + k + '\\}', 'g'), v);
      });
      return html;
    };
    var replaceVals = function (editor, e) {
      var dom = editor.dom, vl = Settings.getTemplateReplaceValues(editor);
      global$1.each(dom.select('*', e), function (e) {
        global$1.each(vl, function (v, k) {
          if (dom.hasClass(e, k)) {
            if (typeof vl[k] === 'function') {
              vl[k](e);
            }
          }
        });
      });
    };
    var hasClass = function (n, c) {
      return new RegExp('\\b' + c + '\\b', 'g').test(n.className);
    };
    var insertTemplate = function (editor, ui, html) {
      var el;
      var n;
      var dom = editor.dom;
      var sel = editor.selection.getContent();
      html = replaceTemplateValues(editor, html, Settings.getTemplateReplaceValues(editor));
      el = dom.create('div', null, html);
      n = dom.select('.mceTmpl', el);
      if (n && n.length > 0) {
        el = dom.create('div', null);
        el.appendChild(n[0].cloneNode(true));
      }
      global$1.each(dom.select('*', el), function (n) {
        if (hasClass(n, Settings.getCreationDateClasses(editor).replace(/\s+/g, '|'))) {
          n.innerHTML = DateTimeHelper.getDateTime(editor, Settings.getCdateFormat(editor));
        }
        if (hasClass(n, Settings.getModificationDateClasses(editor).replace(/\s+/g, '|'))) {
          n.innerHTML = DateTimeHelper.getDateTime(editor, Settings.getMdateFormat(editor));
        }
        if (hasClass(n, Settings.getSelectedContentClasses(editor).replace(/\s+/g, '|'))) {
          n.innerHTML = sel;
        }
      });
      replaceVals(editor, el);
      editor.execCommand('mceInsertContent', false, el.innerHTML);
      editor.addVisual();
    };
    var Templates = {
      createTemplateList: createTemplateList,
      replaceTemplateValues: replaceTemplateValues,
      replaceVals: replaceVals,
      insertTemplate: insertTemplate
    };

    var register = function (editor) {
      editor.addCommand('mceInsertTemplate', curry(Templates.insertTemplate, editor));
    };
    var Commands = { register: register };

    var setup = function (editor) {
      editor.on('PreProcess', function (o) {
        var dom = editor.dom, dateFormat = Settings.getMdateFormat(editor);
        global$1.each(dom.select('div', o.node), function (e) {
          if (dom.hasClass(e, 'mceTmpl')) {
            global$1.each(dom.select('*', e), function (e) {
              if (dom.hasClass(e, editor.getParam('template_mdate_classes', 'mdate').replace(/\s+/g, '|'))) {
                e.innerHTML = DateTimeHelper.getDateTime(editor, dateFormat);
              }
            });
            Templates.replaceVals(editor, e);
          }
        });
      });
    };
    var FilterContent = { setup: setup };

    var insertIframeHtml = function (editor, win, html) {
      if (html.indexOf('<html>') === -1) {
        var contentCssLinks_1 = '';
        global$1.each(editor.contentCSS, function (url) {
          contentCssLinks_1 += '<link type="text/css" rel="stylesheet" href="' + editor.documentBaseURI.toAbsolute(url) + '">';
        });
        var bodyClass = editor.settings.body_class || '';
        if (bodyClass.indexOf('=') !== -1) {
          bodyClass = editor.getParam('body_class', '', 'hash');
          bodyClass = bodyClass[editor.id] || '';
        }
        html = '<!DOCTYPE html>' + '<html>' + '<head>' + contentCssLinks_1 + '</head>' + '<body class="' + bodyClass + '">' + html + '</body>' + '</html>';
      }
      html = Templates.replaceTemplateValues(editor, html, Settings.getPreviewReplaceValues(editor));
      var doc = win.find('iframe')[0].getEl().contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
    };
    var open = function (editor, templateList) {
      var win;
      var values = [];
      var templateHtml;
      if (!templateList || templateList.length === 0) {
        var message = editor.translate('No templates defined.');
        editor.notificationManager.open({
          text: message,
          type: 'info'
        });
        return;
      }
      global$1.each(templateList, function (template) {
        values.push({
          selected: !values.length,
          text: template.title,
          value: {
            url: template.url,
            content: template.content,
            description: template.description
          }
        });
      });
      var onSelectTemplate = function (e) {
        var value = e.control.value();
        if (value.url) {
          global$2.send({
            url: value.url,
            success: function (html) {
              templateHtml = html;
              insertIframeHtml(editor, win, templateHtml);
            }
          });
        } else {
          templateHtml = value.content;
          insertIframeHtml(editor, win, templateHtml);
        }
        win.find('#description')[0].text(e.control.value().description);
      };
      win = editor.windowManager.open({
        title: 'Insert template',
        layout: 'flex',
        direction: 'column',
        align: 'stretch',
        padding: 15,
        spacing: 10,
        items: [
          {
            type: 'form',
            flex: 0,
            padding: 0,
            items: [{
                type: 'container',
                label: 'Templates',
                items: {
                  type: 'listbox',
                  label: 'Templates',
                  name: 'template',
                  values: values,
                  onselect: onSelectTemplate
                }
              }]
          },
          {
            type: 'label',
            name: 'description',
            label: 'Description',
            text: '\xA0'
          },
          {
            type: 'iframe',
            flex: 1,
            border: 1
          }
        ],
        onsubmit: function () {
          Templates.insertTemplate(editor, false, templateHtml);
        },
        minWidth: Settings.getDialogWidth(editor),
        minHeight: Settings.getDialogHeight(editor)
      });
      win.find('listbox')[0].fire('select');
    };
    var Dialog = { open: open };

    var showDialog = function (editor) {
      return function (templates) {
        Dialog.open(editor, templates);
      };
    };
    var register$1 = function (editor) {
      editor.addButton('template', {
        title: 'Insert template',
        onclick: Templates.createTemplateList(editor.settings, showDialog(editor))
      });
      editor.addMenuItem('template', {
        text: 'Template',
        onclick: Templates.createTemplateList(editor.settings, showDialog(editor)),
        icon: 'template',
        context: 'insert'
      });
    };
    var Buttons = { register: register$1 };

    global.add('template', function (editor) {
      Buttons.register(editor);
      Commands.register(editor);
      FilterContent.setup(editor);
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
