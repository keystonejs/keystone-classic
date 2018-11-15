(function () {
var code = (function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    var getMinWidth = function (editor) {
      return editor.getParam('code_dialog_width', 600);
    };
    var getMinHeight = function (editor) {
      return editor.getParam('code_dialog_height', Math.min(global$1.DOM.getViewPort().h - 200, 500));
    };
    var Settings = {
      getMinWidth: getMinWidth,
      getMinHeight: getMinHeight
    };

    var setContent = function (editor, html) {
      editor.focus();
      editor.undoManager.transact(function () {
        editor.setContent(html);
      });
      editor.selection.setCursorLocation();
      editor.nodeChanged();
    };
    var getContent = function (editor) {
      return editor.getContent({ source_view: true });
    };
    var Content = {
      setContent: setContent,
      getContent: getContent
    };

    var open = function (editor) {
      var minWidth = Settings.getMinWidth(editor);
      var minHeight = Settings.getMinHeight(editor);
      var win = editor.windowManager.open({
        title: 'Source code',
        body: {
          type: 'textbox',
          name: 'code',
          multiline: true,
          minWidth: minWidth,
          minHeight: minHeight,
          spellcheck: false,
          style: 'direction: ltr; text-align: left'
        },
        onSubmit: function (e) {
          Content.setContent(editor, e.data.code);
        }
      });
      win.find('#code').value(Content.getContent(editor));
    };
    var Dialog = { open: open };

    var register = function (editor) {
      editor.addCommand('mceCodeEditor', function () {
        Dialog.open(editor);
      });
    };
    var Commands = { register: register };

    var register$1 = function (editor) {
      editor.addButton('code', {
        icon: 'code',
        tooltip: 'Source code',
        onclick: function () {
          Dialog.open(editor);
        }
      });
      editor.addMenuItem('code', {
        icon: 'code',
        text: 'Source code',
        onclick: function () {
          Dialog.open(editor);
        }
      });
    };
    var Buttons = { register: register$1 };

    global.add('code', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
      return {};
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
