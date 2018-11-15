(function () {
var spellchecker = (function () {
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

    var hasProPlugin = function (editor) {
      if (/(^|[ ,])tinymcespellchecker([, ]|$)/.test(editor.settings.plugins) && global.get('tinymcespellchecker')) {
        if (typeof window.console !== 'undefined' && window.console.log) {
          window.console.log('Spell Checker Pro is incompatible with Spell Checker plugin! ' + 'Remove \'spellchecker\' from the \'plugins\' option.');
        }
        return true;
      } else {
        return false;
      }
    };
    var DetectProPlugin = { hasProPlugin: hasProPlugin };

    var getLanguages = function (editor) {
      var defaultLanguages = 'English=en,Danish=da,Dutch=nl,Finnish=fi,French=fr_FR,German=de,Italian=it,Polish=pl,Portuguese=pt_BR,Spanish=es,Swedish=sv';
      return editor.getParam('spellchecker_languages', defaultLanguages);
    };
    var getLanguage = function (editor) {
      var defaultLanguage = editor.getParam('language', 'en');
      return editor.getParam('spellchecker_language', defaultLanguage);
    };
    var getRpcUrl = function (editor) {
      return editor.getParam('spellchecker_rpc_url');
    };
    var getSpellcheckerCallback = function (editor) {
      return editor.getParam('spellchecker_callback');
    };
    var getSpellcheckerWordcharPattern = function (editor) {
      var defaultPattern = new RegExp('[^' + '\\s!"#$%&()*+,-./:;<=>?@[\\]^_{|}`' + '\xA7\xA9\xAB\xAE\xB1\xB6\xB7\xB8\xBB' + '\xBC\xBD\xBE\xBF\xD7\xF7\xA4\u201D\u201C\u201E\xA0\u2002\u2003\u2009' + ']+', 'g');
      return editor.getParam('spellchecker_wordchar_pattern', defaultPattern);
    };
    var Settings = {
      getLanguages: getLanguages,
      getLanguage: getLanguage,
      getRpcUrl: getRpcUrl,
      getSpellcheckerCallback: getSpellcheckerCallback,
      getSpellcheckerWordcharPattern: getSpellcheckerWordcharPattern
    };

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    var global$2 = tinymce.util.Tools.resolve('tinymce.util.URI');

    var global$3 = tinymce.util.Tools.resolve('tinymce.util.XHR');

    var fireSpellcheckStart = function (editor) {
      return editor.fire('SpellcheckStart');
    };
    var fireSpellcheckEnd = function (editor) {
      return editor.fire('SpellcheckEnd');
    };
    var Events = {
      fireSpellcheckStart: fireSpellcheckStart,
      fireSpellcheckEnd: fireSpellcheckEnd
    };

    function isContentEditableFalse(node) {
      return node && node.nodeType === 1 && node.contentEditable === 'false';
    }
    var DomTextMatcher = function (node, editor) {
      var m, matches = [], text;
      var dom = editor.dom;
      var blockElementsMap, hiddenTextElementsMap, shortEndedElementsMap;
      blockElementsMap = editor.schema.getBlockElements();
      hiddenTextElementsMap = editor.schema.getWhiteSpaceElements();
      shortEndedElementsMap = editor.schema.getShortEndedElements();
      function createMatch(m, data) {
        if (!m[0]) {
          throw new Error('findAndReplaceDOMText cannot handle zero-length matches');
        }
        return {
          start: m.index,
          end: m.index + m[0].length,
          text: m[0],
          data: data
        };
      }
      function getText(node) {
        var txt;
        if (node.nodeType === 3) {
          return node.data;
        }
        if (hiddenTextElementsMap[node.nodeName] && !blockElementsMap[node.nodeName]) {
          return '';
        }
        if (isContentEditableFalse(node)) {
          return '\n';
        }
        txt = '';
        if (blockElementsMap[node.nodeName] || shortEndedElementsMap[node.nodeName]) {
          txt += '\n';
        }
        if (node = node.firstChild) {
          do {
            txt += getText(node);
          } while (node = node.nextSibling);
        }
        return txt;
      }
      function stepThroughMatches(node, matches, replaceFn) {
        var startNode, endNode, startNodeIndex, endNodeIndex, innerNodes = [], atIndex = 0, curNode = node, matchLocation, matchIndex = 0;
        matches = matches.slice(0);
        matches.sort(function (a, b) {
          return a.start - b.start;
        });
        matchLocation = matches.shift();
        out:
          while (true) {
            if (blockElementsMap[curNode.nodeName] || shortEndedElementsMap[curNode.nodeName] || isContentEditableFalse(curNode)) {
              atIndex++;
            }
            if (curNode.nodeType === 3) {
              if (!endNode && curNode.length + atIndex >= matchLocation.end) {
                endNode = curNode;
                endNodeIndex = matchLocation.end - atIndex;
              } else if (startNode) {
                innerNodes.push(curNode);
              }
              if (!startNode && curNode.length + atIndex > matchLocation.start) {
                startNode = curNode;
                startNodeIndex = matchLocation.start - atIndex;
              }
              atIndex += curNode.length;
            }
            if (startNode && endNode) {
              curNode = replaceFn({
                startNode: startNode,
                startNodeIndex: startNodeIndex,
                endNode: endNode,
                endNodeIndex: endNodeIndex,
                innerNodes: innerNodes,
                match: matchLocation.text,
                matchIndex: matchIndex
              });
              atIndex -= endNode.length - endNodeIndex;
              startNode = null;
              endNode = null;
              innerNodes = [];
              matchLocation = matches.shift();
              matchIndex++;
              if (!matchLocation) {
                break;
              }
            } else if ((!hiddenTextElementsMap[curNode.nodeName] || blockElementsMap[curNode.nodeName]) && curNode.firstChild) {
              if (!isContentEditableFalse(curNode)) {
                curNode = curNode.firstChild;
                continue;
              }
            } else if (curNode.nextSibling) {
              curNode = curNode.nextSibling;
              continue;
            }
            while (true) {
              if (curNode.nextSibling) {
                curNode = curNode.nextSibling;
                break;
              } else if (curNode.parentNode !== node) {
                curNode = curNode.parentNode;
              } else {
                break out;
              }
            }
          }
      }
      function genReplacer(callback) {
        function makeReplacementNode(fill, matchIndex) {
          var match = matches[matchIndex];
          if (!match.stencil) {
            match.stencil = callback(match);
          }
          var clone = match.stencil.cloneNode(false);
          clone.setAttribute('data-mce-index', matchIndex);
          if (fill) {
            clone.appendChild(dom.doc.createTextNode(fill));
          }
          return clone;
        }
        return function (range) {
          var before;
          var after;
          var parentNode;
          var startNode = range.startNode;
          var endNode = range.endNode;
          var matchIndex = range.matchIndex;
          var doc = dom.doc;
          if (startNode === endNode) {
            var node_1 = startNode;
            parentNode = node_1.parentNode;
            if (range.startNodeIndex > 0) {
              before = doc.createTextNode(node_1.data.substring(0, range.startNodeIndex));
              parentNode.insertBefore(before, node_1);
            }
            var el = makeReplacementNode(range.match, matchIndex);
            parentNode.insertBefore(el, node_1);
            if (range.endNodeIndex < node_1.length) {
              after = doc.createTextNode(node_1.data.substring(range.endNodeIndex));
              parentNode.insertBefore(after, node_1);
            }
            node_1.parentNode.removeChild(node_1);
            return el;
          }
          before = doc.createTextNode(startNode.data.substring(0, range.startNodeIndex));
          after = doc.createTextNode(endNode.data.substring(range.endNodeIndex));
          var elA = makeReplacementNode(startNode.data.substring(range.startNodeIndex), matchIndex);
          for (var i = 0, l = range.innerNodes.length; i < l; ++i) {
            var innerNode = range.innerNodes[i];
            var innerEl = makeReplacementNode(innerNode.data, matchIndex);
            innerNode.parentNode.replaceChild(innerEl, innerNode);
          }
          var elB = makeReplacementNode(endNode.data.substring(0, range.endNodeIndex), matchIndex);
          parentNode = startNode.parentNode;
          parentNode.insertBefore(before, startNode);
          parentNode.insertBefore(elA, startNode);
          parentNode.removeChild(startNode);
          parentNode = endNode.parentNode;
          parentNode.insertBefore(elB, endNode);
          parentNode.insertBefore(after, endNode);
          parentNode.removeChild(endNode);
          return elB;
        };
      }
      function unwrapElement(element) {
        var parentNode = element.parentNode;
        parentNode.insertBefore(element.firstChild, element);
        element.parentNode.removeChild(element);
      }
      function hasClass(elm) {
        return elm.className.indexOf('mce-spellchecker-word') !== -1;
      }
      function getWrappersByIndex(index) {
        var elements = node.getElementsByTagName('*'), wrappers = [];
        index = typeof index === 'number' ? '' + index : null;
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i], dataIndex = element.getAttribute('data-mce-index');
          if (dataIndex !== null && dataIndex.length && hasClass(element)) {
            if (dataIndex === index || index === null) {
              wrappers.push(element);
            }
          }
        }
        return wrappers;
      }
      function indexOf(match) {
        var i = matches.length;
        while (i--) {
          if (matches[i] === match) {
            return i;
          }
        }
        return -1;
      }
      function filter(callback) {
        var filteredMatches = [];
        each(function (match, i) {
          if (callback(match, i)) {
            filteredMatches.push(match);
          }
        });
        matches = filteredMatches;
        return this;
      }
      function each(callback) {
        for (var i = 0, l = matches.length; i < l; i++) {
          if (callback(matches[i], i) === false) {
            break;
          }
        }
        return this;
      }
      function wrap(callback) {
        if (matches.length) {
          stepThroughMatches(node, matches, genReplacer(callback));
        }
        return this;
      }
      function find(regex, data) {
        if (text && regex.global) {
          while (m = regex.exec(text)) {
            matches.push(createMatch(m, data));
          }
        }
        return this;
      }
      function unwrap(match) {
        var i;
        var elements = getWrappersByIndex(match ? indexOf(match) : null);
        i = elements.length;
        while (i--) {
          unwrapElement(elements[i]);
        }
        return this;
      }
      function matchFromElement(element) {
        return matches[element.getAttribute('data-mce-index')];
      }
      function elementFromMatch(match) {
        return getWrappersByIndex(indexOf(match))[0];
      }
      function add(start, length, data) {
        matches.push({
          start: start,
          end: start + length,
          text: text.substr(start, length),
          data: data
        });
        return this;
      }
      function rangeFromMatch(match) {
        var wrappers = getWrappersByIndex(indexOf(match));
        var rng = editor.dom.createRng();
        rng.setStartBefore(wrappers[0]);
        rng.setEndAfter(wrappers[wrappers.length - 1]);
        return rng;
      }
      function replace(match, text) {
        var rng = rangeFromMatch(match);
        rng.deleteContents();
        if (text.length > 0) {
          rng.insertNode(editor.dom.doc.createTextNode(text));
        }
        return rng;
      }
      function reset() {
        matches.splice(0, matches.length);
        unwrap();
        return this;
      }
      text = getText(node);
      return {
        text: text,
        matches: matches,
        each: each,
        filter: filter,
        reset: reset,
        matchFromElement: matchFromElement,
        elementFromMatch: elementFromMatch,
        find: find,
        add: add,
        wrap: wrap,
        unwrap: unwrap,
        replace: replace,
        rangeFromMatch: rangeFromMatch,
        indexOf: indexOf
      };
    };

    var getTextMatcher = function (editor, textMatcherState) {
      if (!textMatcherState.get()) {
        var textMatcher = DomTextMatcher(editor.getBody(), editor);
        textMatcherState.set(textMatcher);
      }
      return textMatcherState.get();
    };
    var isEmpty = function (obj) {
      for (var _ in obj) {
        return false;
      }
      return true;
    };
    var defaultSpellcheckCallback = function (editor, pluginUrl, currentLanguageState) {
      return function (method, text, doneCallback, errorCallback) {
        var data = {
          method: method,
          lang: currentLanguageState.get()
        };
        var postData = '';
        data[method === 'addToDictionary' ? 'word' : 'text'] = text;
        global$1.each(data, function (value, key) {
          if (postData) {
            postData += '&';
          }
          postData += key + '=' + encodeURIComponent(value);
        });
        global$3.send({
          url: new global$2(pluginUrl).toAbsolute(Settings.getRpcUrl(editor)),
          type: 'post',
          content_type: 'application/x-www-form-urlencoded',
          data: postData,
          success: function (result) {
            result = JSON.parse(result);
            if (!result) {
              var message = editor.translate('Server response wasn\'t proper JSON.');
              errorCallback(message);
            } else if (result.error) {
              errorCallback(result.error);
            } else {
              doneCallback(result);
            }
          },
          error: function () {
            var message = editor.translate('The spelling service was not found: (') + Settings.getRpcUrl(editor) + editor.translate(')');
            errorCallback(message);
          }
        });
      };
    };
    var sendRpcCall = function (editor, pluginUrl, currentLanguageState, name, data, successCallback, errorCallback) {
      var userSpellcheckCallback = Settings.getSpellcheckerCallback(editor);
      var spellCheckCallback = userSpellcheckCallback ? userSpellcheckCallback : defaultSpellcheckCallback(editor, pluginUrl, currentLanguageState);
      spellCheckCallback.call(editor.plugins.spellchecker, name, data, successCallback, errorCallback);
    };
    var spellcheck = function (editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState) {
      if (finish(editor, startedState, textMatcherState)) {
        return;
      }
      var errorCallback = function (message) {
        editor.notificationManager.open({
          text: message,
          type: 'error'
        });
        editor.setProgressState(false);
        finish(editor, startedState, textMatcherState);
      };
      var successCallback = function (data) {
        markErrors(editor, startedState, textMatcherState, lastSuggestionsState, data);
      };
      editor.setProgressState(true);
      sendRpcCall(editor, pluginUrl, currentLanguageState, 'spellcheck', getTextMatcher(editor, textMatcherState).text, successCallback, errorCallback);
      editor.focus();
    };
    var checkIfFinished = function (editor, startedState, textMatcherState) {
      if (!editor.dom.select('span.mce-spellchecker-word').length) {
        finish(editor, startedState, textMatcherState);
      }
    };
    var addToDictionary = function (editor, pluginUrl, startedState, textMatcherState, currentLanguageState, word, spans) {
      editor.setProgressState(true);
      sendRpcCall(editor, pluginUrl, currentLanguageState, 'addToDictionary', word, function () {
        editor.setProgressState(false);
        editor.dom.remove(spans, true);
        checkIfFinished(editor, startedState, textMatcherState);
      }, function (message) {
        editor.notificationManager.open({
          text: message,
          type: 'error'
        });
        editor.setProgressState(false);
      });
    };
    var ignoreWord = function (editor, startedState, textMatcherState, word, spans, all) {
      editor.selection.collapse();
      if (all) {
        global$1.each(editor.dom.select('span.mce-spellchecker-word'), function (span) {
          if (span.getAttribute('data-mce-word') === word) {
            editor.dom.remove(span, true);
          }
        });
      } else {
        editor.dom.remove(spans, true);
      }
      checkIfFinished(editor, startedState, textMatcherState);
    };
    var finish = function (editor, startedState, textMatcherState) {
      getTextMatcher(editor, textMatcherState).reset();
      textMatcherState.set(null);
      if (startedState.get()) {
        startedState.set(false);
        Events.fireSpellcheckEnd(editor);
        return true;
      }
    };
    var getElmIndex = function (elm) {
      var value = elm.getAttribute('data-mce-index');
      if (typeof value === 'number') {
        return '' + value;
      }
      return value;
    };
    var findSpansByIndex = function (editor, index) {
      var nodes;
      var spans = [];
      nodes = global$1.toArray(editor.getBody().getElementsByTagName('span'));
      if (nodes.length) {
        for (var i = 0; i < nodes.length; i++) {
          var nodeIndex = getElmIndex(nodes[i]);
          if (nodeIndex === null || !nodeIndex.length) {
            continue;
          }
          if (nodeIndex === index.toString()) {
            spans.push(nodes[i]);
          }
        }
      }
      return spans;
    };
    var markErrors = function (editor, startedState, textMatcherState, lastSuggestionsState, data) {
      var suggestions, hasDictionarySupport;
      if (typeof data !== 'string' && data.words) {
        hasDictionarySupport = !!data.dictionary;
        suggestions = data.words;
      } else {
        suggestions = data;
      }
      editor.setProgressState(false);
      if (isEmpty(suggestions)) {
        var message = editor.translate('No misspellings found.');
        editor.notificationManager.open({
          text: message,
          type: 'info'
        });
        startedState.set(false);
        return;
      }
      lastSuggestionsState.set({
        suggestions: suggestions,
        hasDictionarySupport: hasDictionarySupport
      });
      getTextMatcher(editor, textMatcherState).find(Settings.getSpellcheckerWordcharPattern(editor)).filter(function (match) {
        return !!suggestions[match.text];
      }).wrap(function (match) {
        return editor.dom.create('span', {
          'class': 'mce-spellchecker-word',
          'data-mce-bogus': 1,
          'data-mce-word': match.text
        });
      });
      startedState.set(true);
      Events.fireSpellcheckStart(editor);
    };
    var Actions = {
      spellcheck: spellcheck,
      checkIfFinished: checkIfFinished,
      addToDictionary: addToDictionary,
      ignoreWord: ignoreWord,
      findSpansByIndex: findSpansByIndex,
      getElmIndex: getElmIndex,
      markErrors: markErrors
    };

    var get = function (editor, startedState, lastSuggestionsState, textMatcherState, currentLanguageState, url) {
      var getLanguage = function () {
        return currentLanguageState.get();
      };
      var getWordCharPattern = function () {
        return Settings.getSpellcheckerWordcharPattern(editor);
      };
      var markErrors = function (data) {
        Actions.markErrors(editor, startedState, textMatcherState, lastSuggestionsState, data);
      };
      var getTextMatcher = function () {
        return textMatcherState.get();
      };
      return {
        getTextMatcher: getTextMatcher,
        getWordCharPattern: getWordCharPattern,
        markErrors: markErrors,
        getLanguage: getLanguage
      };
    };
    var Api = { get: get };

    var register = function (editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState) {
      editor.addCommand('mceSpellCheck', function () {
        Actions.spellcheck(editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState);
      });
    };
    var Commands = { register: register };

    var buildMenuItems = function (listName, languageValues) {
      var items = [];
      global$1.each(languageValues, function (languageValue) {
        items.push({
          selectable: true,
          text: languageValue.name,
          data: languageValue.value
        });
      });
      return items;
    };
    var updateSelection = function (editor, currentLanguageState) {
      return function (e) {
        var selectedLanguage = currentLanguageState.get();
        e.control.items().each(function (ctrl) {
          ctrl.active(ctrl.settings.data === selectedLanguage);
        });
      };
    };
    var getItems = function (editor) {
      return global$1.map(Settings.getLanguages(editor).split(','), function (langPair) {
        langPair = langPair.split('=');
        return {
          name: langPair[0],
          value: langPair[1]
        };
      });
    };
    var register$1 = function (editor, pluginUrl, startedState, textMatcherState, currentLanguageState, lastSuggestionsState) {
      var languageMenuItems = buildMenuItems('Language', getItems(editor));
      var startSpellchecking = function () {
        Actions.spellcheck(editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState);
      };
      var buttonArgs = {
        tooltip: 'Spellcheck',
        onclick: startSpellchecking,
        onPostRender: function (e) {
          var ctrl = e.control;
          editor.on('SpellcheckStart SpellcheckEnd', function () {
            ctrl.active(startedState.get());
          });
        }
      };
      if (languageMenuItems.length > 1) {
        buttonArgs.type = 'splitbutton';
        buttonArgs.menu = languageMenuItems;
        buttonArgs.onshow = updateSelection(editor, currentLanguageState);
        buttonArgs.onselect = function (e) {
          currentLanguageState.set(e.control.settings.data);
        };
      }
      editor.addButton('spellchecker', buttonArgs);
      editor.addMenuItem('spellchecker', {
        text: 'Spellcheck',
        context: 'tools',
        onclick: startSpellchecking,
        selectable: true,
        onPostRender: function () {
          var self = this;
          self.active(startedState.get());
          editor.on('SpellcheckStart SpellcheckEnd', function () {
            self.active(startedState.get());
          });
        }
      });
    };
    var Buttons = { register: register$1 };

    var global$4 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    var global$5 = tinymce.util.Tools.resolve('tinymce.ui.Factory');

    var suggestionsMenu;
    var showSuggestions = function (editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, currentLanguageState, word, spans) {
      var items = [], suggestions = lastSuggestionsState.get().suggestions[word];
      global$1.each(suggestions, function (suggestion) {
        items.push({
          text: suggestion,
          onclick: function () {
            editor.insertContent(editor.dom.encode(suggestion));
            editor.dom.remove(spans);
            Actions.checkIfFinished(editor, startedState, textMatcherState);
          }
        });
      });
      items.push({ text: '-' });
      var hasDictionarySupport = lastSuggestionsState.get().hasDictionarySupport;
      if (hasDictionarySupport) {
        items.push({
          text: 'Add to Dictionary',
          onclick: function () {
            Actions.addToDictionary(editor, pluginUrl, startedState, textMatcherState, currentLanguageState, word, spans);
          }
        });
      }
      items.push.apply(items, [
        {
          text: 'Ignore',
          onclick: function () {
            Actions.ignoreWord(editor, startedState, textMatcherState, word, spans);
          }
        },
        {
          text: 'Ignore all',
          onclick: function () {
            Actions.ignoreWord(editor, startedState, textMatcherState, word, spans, true);
          }
        }
      ]);
      suggestionsMenu = global$5.create('menu', {
        items: items,
        context: 'contextmenu',
        onautohide: function (e) {
          if (e.target.className.indexOf('spellchecker') !== -1) {
            e.preventDefault();
          }
        },
        onhide: function () {
          suggestionsMenu.remove();
          suggestionsMenu = null;
        }
      });
      suggestionsMenu.renderTo(document.body);
      var pos = global$4.DOM.getPos(editor.getContentAreaContainer());
      var targetPos = editor.dom.getPos(spans[0]);
      var root = editor.dom.getRoot();
      if (root.nodeName === 'BODY') {
        targetPos.x -= root.ownerDocument.documentElement.scrollLeft || root.scrollLeft;
        targetPos.y -= root.ownerDocument.documentElement.scrollTop || root.scrollTop;
      } else {
        targetPos.x -= root.scrollLeft;
        targetPos.y -= root.scrollTop;
      }
      pos.x += targetPos.x;
      pos.y += targetPos.y;
      suggestionsMenu.moveTo(pos.x, pos.y + spans[0].offsetHeight);
    };
    var setup = function (editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, currentLanguageState) {
      editor.on('click', function (e) {
        var target = e.target;
        if (target.className === 'mce-spellchecker-word') {
          e.preventDefault();
          var spans = Actions.findSpansByIndex(editor, Actions.getElmIndex(target));
          if (spans.length > 0) {
            var rng = editor.dom.createRng();
            rng.setStartBefore(spans[0]);
            rng.setEndAfter(spans[spans.length - 1]);
            editor.selection.setRng(rng);
            showSuggestions(editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, currentLanguageState, target.getAttribute('data-mce-word'), spans);
          }
        }
      });
    };
    var SuggestionsMenu = { setup: setup };

    global.add('spellchecker', function (editor, pluginUrl) {
      if (DetectProPlugin.hasProPlugin(editor) === false) {
        var startedState = Cell(false);
        var currentLanguageState = Cell(Settings.getLanguage(editor));
        var textMatcherState = Cell(null);
        var lastSuggestionsState = Cell(null);
        Buttons.register(editor, pluginUrl, startedState, textMatcherState, currentLanguageState, lastSuggestionsState);
        SuggestionsMenu.setup(editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, currentLanguageState);
        Commands.register(editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState);
        return Api.get(editor, startedState, lastSuggestionsState, textMatcherState, currentLanguageState, pluginUrl);
      }
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
