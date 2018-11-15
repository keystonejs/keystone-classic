(function () {
var pagebreak = (function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var global$1 = tinymce.util.Tools.resolve('tinymce.Env');

    var getSeparatorHtml = function (editor) {
      return editor.getParam('pagebreak_separator', '<!-- pagebreak -->');
    };
    var shouldSplitBlock = function (editor) {
      return editor.getParam('pagebreak_split_block', false);
    };
    var Settings = {
      getSeparatorHtml: getSeparatorHtml,
      shouldSplitBlock: shouldSplitBlock
    };

    var getPageBreakClass = function () {
      return 'mce-pagebreak';
    };
    var getPlaceholderHtml = function () {
      return '<img src="' + global$1.transparentSrc + '" class="' + getPageBreakClass() + '" data-mce-resize="false" data-mce-placeholder />';
    };
    var setup = function (editor) {
      var separatorHtml = Settings.getSeparatorHtml(editor);
      var pageBreakSeparatorRegExp = new RegExp(separatorHtml.replace(/[\?\.\*\[\]\(\)\{\}\+\^\$\:]/g, function (a) {
        return '\\' + a;
      }), 'gi');
      editor.on('BeforeSetContent', function (e) {
        e.content = e.content.replace(pageBreakSeparatorRegExp, getPlaceholderHtml());
      });
      editor.on('PreInit', function () {
        editor.serializer.addNodeFilter('img', function (nodes) {
          var i = nodes.length, node, className;
          while (i--) {
            node = nodes[i];
            className = node.attr('class');
            if (className && className.indexOf('mce-pagebreak') !== -1) {
              var parentNode = node.parent;
              if (editor.schema.getBlockElements()[parentNode.name] && Settings.shouldSplitBlock(editor)) {
                parentNode.type = 3;
                parentNode.value = separatorHtml;
                parentNode.raw = true;
                node.remove();
                continue;
              }
              node.type = 3;
              node.value = separatorHtml;
              node.raw = true;
            }
          }
        });
      });
    };
    var FilterContent = {
      setup: setup,
      getPlaceholderHtml: getPlaceholderHtml,
      getPageBreakClass: getPageBreakClass
    };

    var register = function (editor) {
      editor.addCommand('mcePageBreak', function () {
        if (editor.settings.pagebreak_split_block) {
          editor.insertContent('<p>' + FilterContent.getPlaceholderHtml() + '</p>');
        } else {
          editor.insertContent(FilterContent.getPlaceholderHtml());
        }
      });
    };
    var Commands = { register: register };

    var setup$1 = function (editor) {
      editor.on('ResolveName', function (e) {
        if (e.target.nodeName === 'IMG' && editor.dom.hasClass(e.target, FilterContent.getPageBreakClass())) {
          e.name = 'pagebreak';
        }
      });
    };
    var ResolveName = { setup: setup$1 };

    var register$1 = function (editor) {
      editor.addButton('pagebreak', {
        title: 'Page break',
        cmd: 'mcePageBreak'
      });
      editor.addMenuItem('pagebreak', {
        text: 'Page break',
        icon: 'pagebreak',
        cmd: 'mcePageBreak',
        context: 'insert'
      });
    };
    var Buttons = { register: register$1 };

    global.add('pagebreak', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
      FilterContent.setup(editor);
      ResolveName.setup(editor);
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
