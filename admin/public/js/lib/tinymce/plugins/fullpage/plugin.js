(function () {
var fullpage = (function () {
    'use strict';

    var Cell = function (initial) {
      var value = initial;
      var get = function () {
        return value;
      };
      var set = function (v) {
        value = v;
      };
      var clone = function () {
        return Cell(get());
      };
      return {
        get: get,
        set: set,
        clone: clone
      };
    };

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    var global$2 = tinymce.util.Tools.resolve('tinymce.html.DomParser');

    var global$3 = tinymce.util.Tools.resolve('tinymce.html.Node');

    var global$4 = tinymce.util.Tools.resolve('tinymce.html.Serializer');

    var shouldHideInSourceView = function (editor) {
      return editor.getParam('fullpage_hide_in_source_view');
    };
    var getDefaultXmlPi = function (editor) {
      return editor.getParam('fullpage_default_xml_pi');
    };
    var getDefaultEncoding = function (editor) {
      return editor.getParam('fullpage_default_encoding');
    };
    var getDefaultFontFamily = function (editor) {
      return editor.getParam('fullpage_default_font_family');
    };
    var getDefaultFontSize = function (editor) {
      return editor.getParam('fullpage_default_font_size');
    };
    var getDefaultTextColor = function (editor) {
      return editor.getParam('fullpage_default_text_color');
    };
    var getDefaultTitle = function (editor) {
      return editor.getParam('fullpage_default_title');
    };
    var getDefaultDocType = function (editor) {
      return editor.getParam('fullpage_default_doctype', '<!DOCTYPE html>');
    };
    var Settings = {
      shouldHideInSourceView: shouldHideInSourceView,
      getDefaultXmlPi: getDefaultXmlPi,
      getDefaultEncoding: getDefaultEncoding,
      getDefaultFontFamily: getDefaultFontFamily,
      getDefaultFontSize: getDefaultFontSize,
      getDefaultTextColor: getDefaultTextColor,
      getDefaultTitle: getDefaultTitle,
      getDefaultDocType: getDefaultDocType
    };

    var parseHeader = function (head) {
      return global$2({
        validate: false,
        root_name: '#document'
      }).parse(head);
    };
    var htmlToData = function (editor, head) {
      var headerFragment = parseHeader(head);
      var data = {};
      var elm, matches;
      function getAttr(elm, name) {
        var value = elm.attr(name);
        return value || '';
      }
      data.fontface = Settings.getDefaultFontFamily(editor);
      data.fontsize = Settings.getDefaultFontSize(editor);
      elm = headerFragment.firstChild;
      if (elm.type === 7) {
        data.xml_pi = true;
        matches = /encoding="([^"]+)"/.exec(elm.value);
        if (matches) {
          data.docencoding = matches[1];
        }
      }
      elm = headerFragment.getAll('#doctype')[0];
      if (elm) {
        data.doctype = '<!DOCTYPE' + elm.value + '>';
      }
      elm = headerFragment.getAll('title')[0];
      if (elm && elm.firstChild) {
        data.title = elm.firstChild.value;
      }
      global$1.each(headerFragment.getAll('meta'), function (meta) {
        var name = meta.attr('name');
        var httpEquiv = meta.attr('http-equiv');
        var matches;
        if (name) {
          data[name.toLowerCase()] = meta.attr('content');
        } else if (httpEquiv === 'Content-Type') {
          matches = /charset\s*=\s*(.*)\s*/gi.exec(meta.attr('content'));
          if (matches) {
            data.docencoding = matches[1];
          }
        }
      });
      elm = headerFragment.getAll('html')[0];
      if (elm) {
        data.langcode = getAttr(elm, 'lang') || getAttr(elm, 'xml:lang');
      }
      data.stylesheets = [];
      global$1.each(headerFragment.getAll('link'), function (link) {
        if (link.attr('rel') === 'stylesheet') {
          data.stylesheets.push(link.attr('href'));
        }
      });
      elm = headerFragment.getAll('body')[0];
      if (elm) {
        data.langdir = getAttr(elm, 'dir');
        data.style = getAttr(elm, 'style');
        data.visited_color = getAttr(elm, 'vlink');
        data.link_color = getAttr(elm, 'link');
        data.active_color = getAttr(elm, 'alink');
      }
      return data;
    };
    var dataToHtml = function (editor, data, head) {
      var headerFragment, headElement, html, elm, value;
      var dom = editor.dom;
      function setAttr(elm, name, value) {
        elm.attr(name, value ? value : undefined);
      }
      function addHeadNode(node) {
        if (headElement.firstChild) {
          headElement.insert(node, headElement.firstChild);
        } else {
          headElement.append(node);
        }
      }
      headerFragment = parseHeader(head);
      headElement = headerFragment.getAll('head')[0];
      if (!headElement) {
        elm = headerFragment.getAll('html')[0];
        headElement = new global$3('head', 1);
        if (elm.firstChild) {
          elm.insert(headElement, elm.firstChild, true);
        } else {
          elm.append(headElement);
        }
      }
      elm = headerFragment.firstChild;
      if (data.xml_pi) {
        value = 'version="1.0"';
        if (data.docencoding) {
          value += ' encoding="' + data.docencoding + '"';
        }
        if (elm.type !== 7) {
          elm = new global$3('xml', 7);
          headerFragment.insert(elm, headerFragment.firstChild, true);
        }
        elm.value = value;
      } else if (elm && elm.type === 7) {
        elm.remove();
      }
      elm = headerFragment.getAll('#doctype')[0];
      if (data.doctype) {
        if (!elm) {
          elm = new global$3('#doctype', 10);
          if (data.xml_pi) {
            headerFragment.insert(elm, headerFragment.firstChild);
          } else {
            addHeadNode(elm);
          }
        }
        elm.value = data.doctype.substring(9, data.doctype.length - 1);
      } else if (elm) {
        elm.remove();
      }
      elm = null;
      global$1.each(headerFragment.getAll('meta'), function (meta) {
        if (meta.attr('http-equiv') === 'Content-Type') {
          elm = meta;
        }
      });
      if (data.docencoding) {
        if (!elm) {
          elm = new global$3('meta', 1);
          elm.attr('http-equiv', 'Content-Type');
          elm.shortEnded = true;
          addHeadNode(elm);
        }
        elm.attr('content', 'text/html; charset=' + data.docencoding);
      } else if (elm) {
        elm.remove();
      }
      elm = headerFragment.getAll('title')[0];
      if (data.title) {
        if (!elm) {
          elm = new global$3('title', 1);
          addHeadNode(elm);
        } else {
          elm.empty();
        }
        elm.append(new global$3('#text', 3)).value = data.title;
      } else if (elm) {
        elm.remove();
      }
      global$1.each('keywords,description,author,copyright,robots'.split(','), function (name) {
        var nodes = headerFragment.getAll('meta');
        var i, meta;
        var value = data[name];
        for (i = 0; i < nodes.length; i++) {
          meta = nodes[i];
          if (meta.attr('name') === name) {
            if (value) {
              meta.attr('content', value);
            } else {
              meta.remove();
            }
            return;
          }
        }
        if (value) {
          elm = new global$3('meta', 1);
          elm.attr('name', name);
          elm.attr('content', value);
          elm.shortEnded = true;
          addHeadNode(elm);
        }
      });
      var currentStyleSheetsMap = {};
      global$1.each(headerFragment.getAll('link'), function (stylesheet) {
        if (stylesheet.attr('rel') === 'stylesheet') {
          currentStyleSheetsMap[stylesheet.attr('href')] = stylesheet;
        }
      });
      global$1.each(data.stylesheets, function (stylesheet) {
        if (!currentStyleSheetsMap[stylesheet]) {
          elm = new global$3('link', 1);
          elm.attr({
            rel: 'stylesheet',
            text: 'text/css',
            href: stylesheet
          });
          elm.shortEnded = true;
          addHeadNode(elm);
        }
        delete currentStyleSheetsMap[stylesheet];
      });
      global$1.each(currentStyleSheetsMap, function (stylesheet) {
        stylesheet.remove();
      });
      elm = headerFragment.getAll('body')[0];
      if (elm) {
        setAttr(elm, 'dir', data.langdir);
        setAttr(elm, 'style', data.style);
        setAttr(elm, 'vlink', data.visited_color);
        setAttr(elm, 'link', data.link_color);
        setAttr(elm, 'alink', data.active_color);
        dom.setAttribs(editor.getBody(), {
          style: data.style,
          dir: data.dir,
          vLink: data.visited_color,
          link: data.link_color,
          aLink: data.active_color
        });
      }
      elm = headerFragment.getAll('html')[0];
      if (elm) {
        setAttr(elm, 'lang', data.langcode);
        setAttr(elm, 'xml:lang', data.langcode);
      }
      if (!headElement.firstChild) {
        headElement.remove();
      }
      html = global$4({
        validate: false,
        indent: true,
        apply_source_formatting: true,
        indent_before: 'head,html,body,meta,title,script,link,style',
        indent_after: 'head,html,body,meta,title,script,link,style'
      }).serialize(headerFragment);
      return html.substring(0, html.indexOf('</body>'));
    };
    var Parser = {
      parseHeader: parseHeader,
      htmlToData: htmlToData,
      dataToHtml: dataToHtml
    };

    var open = function (editor, headState) {
      var data = Parser.htmlToData(editor, headState.get());
      editor.windowManager.open({
        title: 'Document properties',
        data: data,
        defaults: {
          type: 'textbox',
          size: 40
        },
        body: [
          {
            name: 'title',
            label: 'Title'
          },
          {
            name: 'keywords',
            label: 'Keywords'
          },
          {
            name: 'description',
            label: 'Description'
          },
          {
            name: 'robots',
            label: 'Robots'
          },
          {
            name: 'author',
            label: 'Author'
          },
          {
            name: 'docencoding',
            label: 'Encoding'
          }
        ],
        onSubmit: function (e) {
          var headHtml = Parser.dataToHtml(editor, global$1.extend(data, e.data), headState.get());
          headState.set(headHtml);
        }
      });
    };
    var Dialog = { open: open };

    var register = function (editor, headState) {
      editor.addCommand('mceFullPageProperties', function () {
        Dialog.open(editor, headState);
      });
    };
    var Commands = { register: register };

    var protectHtml = function (protect, html) {
      global$1.each(protect, function (pattern) {
        html = html.replace(pattern, function (str) {
          return '<!--mce:protected ' + escape(str) + '-->';
        });
      });
      return html;
    };
    var unprotectHtml = function (html) {
      return html.replace(/<!--mce:protected ([\s\S]*?)-->/g, function (a, m) {
        return unescape(m);
      });
    };
    var Protect = {
      protectHtml: protectHtml,
      unprotectHtml: unprotectHtml
    };

    var each = global$1.each;
    var low = function (s) {
      return s.replace(/<\/?[A-Z]+/g, function (a) {
        return a.toLowerCase();
      });
    };
    var handleSetContent = function (editor, headState, footState, evt) {
      var startPos, endPos, content, headerFragment, styles = '';
      var dom = editor.dom;
      var elm;
      if (evt.selection) {
        return;
      }
      content = Protect.protectHtml(editor.settings.protect, evt.content);
      if (evt.format === 'raw' && headState.get()) {
        return;
      }
      if (evt.source_view && Settings.shouldHideInSourceView(editor)) {
        return;
      }
      if (content.length === 0 && !evt.source_view) {
        content = global$1.trim(headState.get()) + '\n' + global$1.trim(content) + '\n' + global$1.trim(footState.get());
      }
      content = content.replace(/<(\/?)BODY/gi, '<$1body');
      startPos = content.indexOf('<body');
      if (startPos !== -1) {
        startPos = content.indexOf('>', startPos);
        headState.set(low(content.substring(0, startPos + 1)));
        endPos = content.indexOf('</body', startPos);
        if (endPos === -1) {
          endPos = content.length;
        }
        evt.content = global$1.trim(content.substring(startPos + 1, endPos));
        footState.set(low(content.substring(endPos)));
      } else {
        headState.set(getDefaultHeader(editor));
        footState.set('\n</body>\n</html>');
      }
      headerFragment = Parser.parseHeader(headState.get());
      each(headerFragment.getAll('style'), function (node) {
        if (node.firstChild) {
          styles += node.firstChild.value;
        }
      });
      elm = headerFragment.getAll('body')[0];
      if (elm) {
        dom.setAttribs(editor.getBody(), {
          style: elm.attr('style') || '',
          dir: elm.attr('dir') || '',
          vLink: elm.attr('vlink') || '',
          link: elm.attr('link') || '',
          aLink: elm.attr('alink') || ''
        });
      }
      dom.remove('fullpage_styles');
      var headElm = editor.getDoc().getElementsByTagName('head')[0];
      if (styles) {
        dom.add(headElm, 'style', { id: 'fullpage_styles' }, styles);
        elm = dom.get('fullpage_styles');
        if (elm.styleSheet) {
          elm.styleSheet.cssText = styles;
        }
      }
      var currentStyleSheetsMap = {};
      global$1.each(headElm.getElementsByTagName('link'), function (stylesheet) {
        if (stylesheet.rel === 'stylesheet' && stylesheet.getAttribute('data-mce-fullpage')) {
          currentStyleSheetsMap[stylesheet.href] = stylesheet;
        }
      });
      global$1.each(headerFragment.getAll('link'), function (stylesheet) {
        var href = stylesheet.attr('href');
        if (!href) {
          return true;
        }
        if (!currentStyleSheetsMap[href] && stylesheet.attr('rel') === 'stylesheet') {
          dom.add(headElm, 'link', {
            'rel': 'stylesheet',
            'text': 'text/css',
            'href': href,
            'data-mce-fullpage': '1'
          });
        }
        delete currentStyleSheetsMap[href];
      });
      global$1.each(currentStyleSheetsMap, function (stylesheet) {
        stylesheet.parentNode.removeChild(stylesheet);
      });
    };
    var getDefaultHeader = function (editor) {
      var header = '', value, styles = '';
      if (Settings.getDefaultXmlPi(editor)) {
        var piEncoding = Settings.getDefaultEncoding(editor);
        header += '<?xml version="1.0" encoding="' + (piEncoding ? piEncoding : 'ISO-8859-1') + '" ?>\n';
      }
      header += Settings.getDefaultDocType(editor);
      header += '\n<html>\n<head>\n';
      if (value = Settings.getDefaultTitle(editor)) {
        header += '<title>' + value + '</title>\n';
      }
      if (value = Settings.getDefaultEncoding(editor)) {
        header += '<meta http-equiv="Content-Type" content="text/html; charset=' + value + '" />\n';
      }
      if (value = Settings.getDefaultFontFamily(editor)) {
        styles += 'font-family: ' + value + ';';
      }
      if (value = Settings.getDefaultFontSize(editor)) {
        styles += 'font-size: ' + value + ';';
      }
      if (value = Settings.getDefaultTextColor(editor)) {
        styles += 'color: ' + value + ';';
      }
      header += '</head>\n<body' + (styles ? ' style="' + styles + '"' : '') + '>\n';
      return header;
    };
    var handleGetContent = function (editor, head, foot, evt) {
      if (!evt.selection && (!evt.source_view || !Settings.shouldHideInSourceView(editor))) {
        evt.content = Protect.unprotectHtml(global$1.trim(head) + '\n' + global$1.trim(evt.content) + '\n' + global$1.trim(foot));
      }
    };
    var setup = function (editor, headState, footState) {
      editor.on('BeforeSetContent', function (evt) {
        handleSetContent(editor, headState, footState, evt);
      });
      editor.on('GetContent', function (evt) {
        handleGetContent(editor, headState.get(), footState.get(), evt);
      });
    };
    var FilterContent = { setup: setup };

    var register$1 = function (editor) {
      editor.addButton('fullpage', {
        title: 'Document properties',
        cmd: 'mceFullPageProperties'
      });
      editor.addMenuItem('fullpage', {
        text: 'Document properties',
        cmd: 'mceFullPageProperties',
        context: 'file'
      });
    };
    var Buttons = { register: register$1 };

    global.add('fullpage', function (editor) {
      var headState = Cell(''), footState = Cell('');
      Commands.register(editor, headState);
      Buttons.register(editor);
      FilterContent.setup(editor, headState, footState);
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
