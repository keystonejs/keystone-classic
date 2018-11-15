(function () {
var autoresize = (function () {
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

    var global$1 = tinymce.util.Tools.resolve('tinymce.Env');

    var global$2 = tinymce.util.Tools.resolve('tinymce.util.Delay');

    var getAutoResizeMinHeight = function (editor) {
      return parseInt(editor.getParam('autoresize_min_height', editor.getElement().offsetHeight), 10);
    };
    var getAutoResizeMaxHeight = function (editor) {
      return parseInt(editor.getParam('autoresize_max_height', 0), 10);
    };
    var getAutoResizeOverflowPadding = function (editor) {
      return editor.getParam('autoresize_overflow_padding', 1);
    };
    var getAutoResizeBottomMargin = function (editor) {
      return editor.getParam('autoresize_bottom_margin', 50);
    };
    var shouldAutoResizeOnInit = function (editor) {
      return editor.getParam('autoresize_on_init', true);
    };
    var Settings = {
      getAutoResizeMinHeight: getAutoResizeMinHeight,
      getAutoResizeMaxHeight: getAutoResizeMaxHeight,
      getAutoResizeOverflowPadding: getAutoResizeOverflowPadding,
      getAutoResizeBottomMargin: getAutoResizeBottomMargin,
      shouldAutoResizeOnInit: shouldAutoResizeOnInit
    };

    var isFullscreen = function (editor) {
      return editor.plugins.fullscreen && editor.plugins.fullscreen.isFullscreen();
    };
    var wait = function (editor, oldSize, times, interval, callback) {
      global$2.setEditorTimeout(editor, function () {
        resize(editor, oldSize);
        if (times--) {
          wait(editor, oldSize, times, interval, callback);
        } else if (callback) {
          callback();
        }
      }, interval);
    };
    var toggleScrolling = function (editor, state) {
      var body = editor.getBody();
      if (body) {
        body.style.overflowY = state ? '' : 'hidden';
        if (!state) {
          body.scrollTop = 0;
        }
      }
    };
    var resize = function (editor, oldSize) {
      var deltaSize, doc, body, resizeHeight, myHeight;
      var marginTop, marginBottom, paddingTop, paddingBottom, borderTop, borderBottom;
      var dom = editor.dom;
      doc = editor.getDoc();
      if (!doc) {
        return;
      }
      if (isFullscreen(editor)) {
        toggleScrolling(editor, true);
        return;
      }
      body = doc.body;
      resizeHeight = Settings.getAutoResizeMinHeight(editor);
      marginTop = dom.getStyle(body, 'margin-top', true);
      marginBottom = dom.getStyle(body, 'margin-bottom', true);
      paddingTop = dom.getStyle(body, 'padding-top', true);
      paddingBottom = dom.getStyle(body, 'padding-bottom', true);
      borderTop = dom.getStyle(body, 'border-top-width', true);
      borderBottom = dom.getStyle(body, 'border-bottom-width', true);
      myHeight = body.offsetHeight + parseInt(marginTop, 10) + parseInt(marginBottom, 10) + parseInt(paddingTop, 10) + parseInt(paddingBottom, 10) + parseInt(borderTop, 10) + parseInt(borderBottom, 10);
      if (isNaN(myHeight) || myHeight <= 0) {
        myHeight = global$1.ie ? body.scrollHeight : global$1.webkit && body.clientHeight === 0 ? 0 : body.offsetHeight;
      }
      if (myHeight > Settings.getAutoResizeMinHeight(editor)) {
        resizeHeight = myHeight;
      }
      var maxHeight = Settings.getAutoResizeMaxHeight(editor);
      if (maxHeight && myHeight > maxHeight) {
        resizeHeight = maxHeight;
        toggleScrolling(editor, true);
      } else {
        toggleScrolling(editor, false);
      }
      if (resizeHeight !== oldSize.get()) {
        deltaSize = resizeHeight - oldSize.get();
        dom.setStyle(editor.iframeElement, 'height', resizeHeight + 'px');
        oldSize.set(resizeHeight);
        if (global$1.webkit && deltaSize < 0) {
          resize(editor, oldSize);
        }
      }
    };
    var setup = function (editor, oldSize) {
      editor.on('init', function () {
        var overflowPadding, bottomMargin;
        var dom = editor.dom;
        overflowPadding = Settings.getAutoResizeOverflowPadding(editor);
        bottomMargin = Settings.getAutoResizeBottomMargin(editor);
        if (overflowPadding !== false) {
          dom.setStyles(editor.getBody(), {
            paddingLeft: overflowPadding,
            paddingRight: overflowPadding
          });
        }
        if (bottomMargin !== false) {
          dom.setStyles(editor.getBody(), { paddingBottom: bottomMargin });
        }
      });
      editor.on('nodechange setcontent keyup FullscreenStateChanged', function (e) {
        resize(editor, oldSize);
      });
      if (Settings.shouldAutoResizeOnInit(editor)) {
        editor.on('init', function () {
          wait(editor, oldSize, 20, 100, function () {
            wait(editor, oldSize, 5, 1000);
          });
        });
      }
    };
    var Resize = {
      setup: setup,
      resize: resize
    };

    var register = function (editor, oldSize) {
      editor.addCommand('mceAutoResize', function () {
        Resize.resize(editor, oldSize);
      });
    };
    var Commands = { register: register };

    global.add('autoresize', function (editor) {
      if (!editor.inline) {
        var oldSize = Cell(0);
        Commands.register(editor, oldSize);
        Resize.setup(editor, oldSize);
      }
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
