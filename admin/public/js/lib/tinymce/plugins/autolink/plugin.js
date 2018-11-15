(function () {
var autolink = (function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var global$1 = tinymce.util.Tools.resolve('tinymce.Env');

    var getAutoLinkPattern = function (editor) {
      return editor.getParam('autolink_pattern', /^(https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.|(?:mailto:)?[A-Z0-9._%+\-]+@)(.+)$/i);
    };
    var getDefaultLinkTarget = function (editor) {
      return editor.getParam('default_link_target', '');
    };
    var Settings = {
      getAutoLinkPattern: getAutoLinkPattern,
      getDefaultLinkTarget: getDefaultLinkTarget
    };

    var rangeEqualsDelimiterOrSpace = function (rangeString, delimiter) {
      return rangeString === delimiter || rangeString === ' ' || rangeString.charCodeAt(0) === 160;
    };
    var handleEclipse = function (editor) {
      parseCurrentLine(editor, -1, '(');
    };
    var handleSpacebar = function (editor) {
      parseCurrentLine(editor, 0, '');
    };
    var handleEnter = function (editor) {
      parseCurrentLine(editor, -1, '');
    };
    var scopeIndex = function (container, index) {
      if (index < 0) {
        index = 0;
      }
      if (container.nodeType === 3) {
        var len = container.data.length;
        if (index > len) {
          index = len;
        }
      }
      return index;
    };
    var setStart = function (rng, container, offset) {
      if (container.nodeType !== 1 || container.hasChildNodes()) {
        rng.setStart(container, scopeIndex(container, offset));
      } else {
        rng.setStartBefore(container);
      }
    };
    var setEnd = function (rng, container, offset) {
      if (container.nodeType !== 1 || container.hasChildNodes()) {
        rng.setEnd(container, scopeIndex(container, offset));
      } else {
        rng.setEndAfter(container);
      }
    };
    var parseCurrentLine = function (editor, endOffset, delimiter) {
      var rng, end, start, endContainer, bookmark, text, matches, prev, len, rngText;
      var autoLinkPattern = Settings.getAutoLinkPattern(editor);
      var defaultLinkTarget = Settings.getDefaultLinkTarget(editor);
      if (editor.selection.getNode().tagName === 'A') {
        return;
      }
      rng = editor.selection.getRng(true).cloneRange();
      if (rng.startOffset < 5) {
        prev = rng.endContainer.previousSibling;
        if (!prev) {
          if (!rng.endContainer.firstChild || !rng.endContainer.firstChild.nextSibling) {
            return;
          }
          prev = rng.endContainer.firstChild.nextSibling;
        }
        len = prev.length;
        setStart(rng, prev, len);
        setEnd(rng, prev, len);
        if (rng.endOffset < 5) {
          return;
        }
        end = rng.endOffset;
        endContainer = prev;
      } else {
        endContainer = rng.endContainer;
        if (endContainer.nodeType !== 3 && endContainer.firstChild) {
          while (endContainer.nodeType !== 3 && endContainer.firstChild) {
            endContainer = endContainer.firstChild;
          }
          if (endContainer.nodeType === 3) {
            setStart(rng, endContainer, 0);
            setEnd(rng, endContainer, endContainer.nodeValue.length);
          }
        }
        if (rng.endOffset === 1) {
          end = 2;
        } else {
          end = rng.endOffset - 1 - endOffset;
        }
      }
      start = end;
      do {
        setStart(rng, endContainer, end >= 2 ? end - 2 : 0);
        setEnd(rng, endContainer, end >= 1 ? end - 1 : 0);
        end -= 1;
        rngText = rng.toString();
      } while (rngText !== ' ' && rngText !== '' && rngText.charCodeAt(0) !== 160 && end - 2 >= 0 && rngText !== delimiter);
      if (rangeEqualsDelimiterOrSpace(rng.toString(), delimiter)) {
        setStart(rng, endContainer, end);
        setEnd(rng, endContainer, start);
        end += 1;
      } else if (rng.startOffset === 0) {
        setStart(rng, endContainer, 0);
        setEnd(rng, endContainer, start);
      } else {
        setStart(rng, endContainer, end);
        setEnd(rng, endContainer, start);
      }
      text = rng.toString();
      if (text.charAt(text.length - 1) === '.') {
        setEnd(rng, endContainer, start - 1);
      }
      text = rng.toString().trim();
      matches = text.match(autoLinkPattern);
      if (matches) {
        if (matches[1] === 'www.') {
          matches[1] = 'http://www.';
        } else if (/@$/.test(matches[1]) && !/^mailto:/.test(matches[1])) {
          matches[1] = 'mailto:' + matches[1];
        }
        bookmark = editor.selection.getBookmark();
        editor.selection.setRng(rng);
        editor.execCommand('createlink', false, matches[1] + matches[2]);
        if (defaultLinkTarget) {
          editor.dom.setAttrib(editor.selection.getNode(), 'target', defaultLinkTarget);
        }
        editor.selection.moveToBookmark(bookmark);
        editor.nodeChanged();
      }
    };
    var setup = function (editor) {
      var autoUrlDetectState;
      editor.on('keydown', function (e) {
        if (e.keyCode === 13) {
          return handleEnter(editor);
        }
      });
      if (global$1.ie) {
        editor.on('focus', function () {
          if (!autoUrlDetectState) {
            autoUrlDetectState = true;
            try {
              editor.execCommand('AutoUrlDetect', false, true);
            } catch (ex) {
            }
          }
        });
        return;
      }
      editor.on('keypress', function (e) {
        if (e.keyCode === 41) {
          return handleEclipse(editor);
        }
      });
      editor.on('keyup', function (e) {
        if (e.keyCode === 32) {
          return handleSpacebar(editor);
        }
      });
    };
    var Keys = { setup: setup };

    global.add('autolink', function (editor) {
      Keys.setup(editor);
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
