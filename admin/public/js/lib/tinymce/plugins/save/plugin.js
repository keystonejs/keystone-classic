(function () {
var save = (function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    var global$2 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    var enableWhenDirty = function (editor) {
      return editor.getParam('save_enablewhendirty', true);
    };
    var hasOnSaveCallback = function (editor) {
      return !!editor.getParam('save_onsavecallback');
    };
    var hasOnCancelCallback = function (editor) {
      return !!editor.getParam('save_oncancelcallback');
    };
    var Settings = {
      enableWhenDirty: enableWhenDirty,
      hasOnSaveCallback: hasOnSaveCallback,
      hasOnCancelCallback: hasOnCancelCallback
    };

    var displayErrorMessage = function (editor, message) {
      editor.notificationManager.open({
        text: editor.translate(message),
        type: 'error'
      });
    };
    var save = function (editor) {
      var formObj;
      formObj = global$1.DOM.getParent(editor.id, 'form');
      if (Settings.enableWhenDirty(editor) && !editor.isDirty()) {
        return;
      }
      editor.save();
      if (Settings.hasOnSaveCallback(editor)) {
        editor.execCallback('save_onsavecallback', editor);
        editor.nodeChanged();
        return;
      }
      if (formObj) {
        editor.setDirty(false);
        if (!formObj.onsubmit || formObj.onsubmit()) {
          if (typeof formObj.submit === 'function') {
            formObj.submit();
          } else {
            displayErrorMessage(editor, 'Error: Form submit field collision.');
          }
        }
        editor.nodeChanged();
      } else {
        displayErrorMessage(editor, 'Error: No form element found.');
      }
    };
    var cancel = function (editor) {
      var h = global$2.trim(editor.startContent);
      if (Settings.hasOnCancelCallback(editor)) {
        editor.execCallback('save_oncancelcallback', editor);
        return;
      }
      editor.setContent(h);
      editor.undoManager.clear();
      editor.nodeChanged();
    };
    var Actions = {
      save: save,
      cancel: cancel
    };

    var register = function (editor) {
      editor.addCommand('mceSave', function () {
        Actions.save(editor);
      });
      editor.addCommand('mceCancel', function () {
        Actions.cancel(editor);
      });
    };
    var Commands = { register: register };

    var stateToggle = function (editor) {
      return function (e) {
        var ctrl = e.control;
        editor.on('nodeChange dirty', function () {
          ctrl.disabled(Settings.enableWhenDirty(editor) && !editor.isDirty());
        });
      };
    };
    var register$1 = function (editor) {
      editor.addButton('save', {
        icon: 'save',
        text: 'Save',
        cmd: 'mceSave',
        disabled: true,
        onPostRender: stateToggle(editor)
      });
      editor.addButton('cancel', {
        text: 'Cancel',
        icon: false,
        cmd: 'mceCancel',
        disabled: true,
        onPostRender: stateToggle(editor)
      });
      editor.addShortcut('Meta+S', '', 'mceSave');
    };
    var Buttons = { register: register$1 };

    global.add('save', function (editor) {
      Buttons.register(editor);
      Commands.register(editor);
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
