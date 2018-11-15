(function () {
var visualchars = (function () {
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

    var get = function (toggleState) {
      var isEnabled = function () {
        return toggleState.get();
      };
      return { isEnabled: isEnabled };
    };
    var Api = { get: get };

    var fireVisualChars = function (editor, state) {
      return editor.fire('VisualChars', { state: state });
    };
    var Events = { fireVisualChars: fireVisualChars };

    var charMap = {
      '\xA0': 'nbsp',
      '\xAD': 'shy'
    };
    var charMapToRegExp = function (charMap, global) {
      var key, regExp = '';
      for (key in charMap) {
        regExp += key;
      }
      return new RegExp('[' + regExp + ']', global ? 'g' : '');
    };
    var charMapToSelector = function (charMap) {
      var key, selector = '';
      for (key in charMap) {
        if (selector) {
          selector += ',';
        }
        selector += 'span.mce-' + charMap[key];
      }
      return selector;
    };
    var Data = {
      charMap: charMap,
      regExp: charMapToRegExp(charMap),
      regExpGlobal: charMapToRegExp(charMap, true),
      selector: charMapToSelector(charMap),
      charMapToRegExp: charMapToRegExp,
      charMapToSelector: charMapToSelector
    };

    var constant = function (value) {
      return function () {
        return value;
      };
    };
    var never = constant(false);
    var always = constant(true);

    var never$1 = never;
    var always$1 = always;
    var none = function () {
      return NONE;
    };
    var NONE = function () {
      var eq = function (o) {
        return o.isNone();
      };
      var call$$1 = function (thunk) {
        return thunk();
      };
      var id = function (n) {
        return n;
      };
      var noop$$1 = function () {
      };
      var nul = function () {
        return null;
      };
      var undef = function () {
        return undefined;
      };
      var me = {
        fold: function (n, s) {
          return n();
        },
        is: never$1,
        isSome: never$1,
        isNone: always$1,
        getOr: id,
        getOrThunk: call$$1,
        getOrDie: function (msg) {
          throw new Error(msg || 'error: getOrDie called on none.');
        },
        getOrNull: nul,
        getOrUndefined: undef,
        or: id,
        orThunk: call$$1,
        map: none,
        ap: none,
        each: noop$$1,
        bind: none,
        flatten: none,
        exists: never$1,
        forall: always$1,
        filter: none,
        equals: eq,
        equals_: eq,
        toArray: function () {
          return [];
        },
        toString: constant('none()')
      };
      if (Object.freeze)
        Object.freeze(me);
      return me;
    }();
    var some = function (a) {
      var constant_a = function () {
        return a;
      };
      var self = function () {
        return me;
      };
      var map = function (f) {
        return some(f(a));
      };
      var bind = function (f) {
        return f(a);
      };
      var me = {
        fold: function (n, s) {
          return s(a);
        },
        is: function (v) {
          return a === v;
        },
        isSome: always$1,
        isNone: never$1,
        getOr: constant_a,
        getOrThunk: constant_a,
        getOrDie: constant_a,
        getOrNull: constant_a,
        getOrUndefined: constant_a,
        or: self,
        orThunk: self,
        map: map,
        ap: function (optfab) {
          return optfab.fold(none, function (fab) {
            return some(fab(a));
          });
        },
        each: function (f) {
          f(a);
        },
        bind: bind,
        flatten: constant_a,
        exists: bind,
        forall: bind,
        filter: function (f) {
          return f(a) ? me : NONE;
        },
        equals: function (o) {
          return o.is(a);
        },
        equals_: function (o, elementEq) {
          return o.fold(never$1, function (b) {
            return elementEq(a, b);
          });
        },
        toArray: function () {
          return [a];
        },
        toString: function () {
          return 'some(' + a + ')';
        }
      };
      return me;
    };
    var from = function (value) {
      return value === null || value === undefined ? NONE : some(value);
    };
    var Option = {
      some: some,
      none: none,
      from: from
    };

    var typeOf = function (x) {
      if (x === null)
        return 'null';
      var t = typeof x;
      if (t === 'object' && Array.prototype.isPrototypeOf(x))
        return 'array';
      if (t === 'object' && String.prototype.isPrototypeOf(x))
        return 'string';
      return t;
    };
    var isType = function (type) {
      return function (value) {
        return typeOf(value) === type;
      };
    };
    var isFunction = isType('function');

    var map = function (xs, f) {
      var len = xs.length;
      var r = new Array(len);
      for (var i = 0; i < len; i++) {
        var x = xs[i];
        r[i] = f(x, i, xs);
      }
      return r;
    };
    var each = function (xs, f) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        f(x, i, xs);
      }
    };
    var slice = Array.prototype.slice;
    var from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x);
    };

    var fromHtml = function (html, scope) {
      var doc = scope || document;
      var div = doc.createElement('div');
      div.innerHTML = html;
      if (!div.hasChildNodes() || div.childNodes.length > 1) {
        console.error('HTML does not have a single root node', html);
        throw 'HTML must have a single root node';
      }
      return fromDom(div.childNodes[0]);
    };
    var fromTag = function (tag, scope) {
      var doc = scope || document;
      var node = doc.createElement(tag);
      return fromDom(node);
    };
    var fromText = function (text, scope) {
      var doc = scope || document;
      var node = doc.createTextNode(text);
      return fromDom(node);
    };
    var fromDom = function (node) {
      if (node === null || node === undefined)
        throw new Error('Node cannot be null or undefined');
      return { dom: constant(node) };
    };
    var fromPoint = function (docElm, x, y) {
      var doc = docElm.dom();
      return Option.from(doc.elementFromPoint(x, y)).map(fromDom);
    };
    var Element$$1 = {
      fromHtml: fromHtml,
      fromTag: fromTag,
      fromText: fromText,
      fromDom: fromDom,
      fromPoint: fromPoint
    };

    var ATTRIBUTE = Node.ATTRIBUTE_NODE;
    var CDATA_SECTION = Node.CDATA_SECTION_NODE;
    var COMMENT = Node.COMMENT_NODE;
    var DOCUMENT = Node.DOCUMENT_NODE;
    var DOCUMENT_TYPE = Node.DOCUMENT_TYPE_NODE;
    var DOCUMENT_FRAGMENT = Node.DOCUMENT_FRAGMENT_NODE;
    var ELEMENT = Node.ELEMENT_NODE;
    var TEXT = Node.TEXT_NODE;
    var PROCESSING_INSTRUCTION = Node.PROCESSING_INSTRUCTION_NODE;
    var ENTITY_REFERENCE = Node.ENTITY_REFERENCE_NODE;
    var ENTITY = Node.ENTITY_NODE;
    var NOTATION = Node.NOTATION_NODE;

    var type = function (element) {
      return element.dom().nodeType;
    };
    var value = function (element) {
      return element.dom().nodeValue;
    };
    var isType$1 = function (t) {
      return function (element) {
        return type(element) === t;
      };
    };
    var isText = isType$1(TEXT);

    var wrapCharWithSpan = function (value) {
      return '<span data-mce-bogus="1" class="mce-' + Data.charMap[value] + '">' + value + '</span>';
    };
    var Html = { wrapCharWithSpan: wrapCharWithSpan };

    var isMatch = function (n) {
      return isText(n) && value(n) !== undefined && Data.regExp.test(value(n));
    };
    var filterDescendants = function (scope, predicate) {
      var result = [];
      var dom = scope.dom();
      var children = map(dom.childNodes, Element$$1.fromDom);
      each(children, function (x) {
        if (predicate(x)) {
          result = result.concat([x]);
        }
        result = result.concat(filterDescendants(x, predicate));
      });
      return result;
    };
    var findParentElm = function (elm, rootElm) {
      while (elm.parentNode) {
        if (elm.parentNode === rootElm) {
          return elm;
        }
        elm = elm.parentNode;
      }
    };
    var replaceWithSpans = function (html) {
      return html.replace(Data.regExpGlobal, Html.wrapCharWithSpan);
    };
    var Nodes = {
      isMatch: isMatch,
      filterDescendants: filterDescendants,
      findParentElm: findParentElm,
      replaceWithSpans: replaceWithSpans
    };

    var show = function (editor, rootElm) {
      var node, div;
      var nodeList = Nodes.filterDescendants(Element$$1.fromDom(rootElm), Nodes.isMatch);
      each(nodeList, function (n) {
        var withSpans = Nodes.replaceWithSpans(value(n));
        div = editor.dom.create('div', null, withSpans);
        while (node = div.lastChild) {
          editor.dom.insertAfter(node, n.dom());
        }
        editor.dom.remove(n.dom());
      });
    };
    var hide = function (editor, body) {
      var nodeList = editor.dom.select(Data.selector, body);
      each(nodeList, function (node) {
        editor.dom.remove(node, 1);
      });
    };
    var toggle = function (editor) {
      var body = editor.getBody();
      var bookmark = editor.selection.getBookmark();
      var parentNode = Nodes.findParentElm(editor.selection.getNode(), body);
      parentNode = parentNode !== undefined ? parentNode : body;
      hide(editor, parentNode);
      show(editor, parentNode);
      editor.selection.moveToBookmark(bookmark);
    };
    var VisualChars = {
      show: show,
      hide: hide,
      toggle: toggle
    };

    var toggleVisualChars = function (editor, toggleState) {
      var body = editor.getBody();
      var selection = editor.selection;
      var bookmark;
      toggleState.set(!toggleState.get());
      Events.fireVisualChars(editor, toggleState.get());
      bookmark = selection.getBookmark();
      if (toggleState.get() === true) {
        VisualChars.show(editor, body);
      } else {
        VisualChars.hide(editor, body);
      }
      selection.moveToBookmark(bookmark);
    };
    var Actions = { toggleVisualChars: toggleVisualChars };

    var register = function (editor, toggleState) {
      editor.addCommand('mceVisualChars', function () {
        Actions.toggleVisualChars(editor, toggleState);
      });
    };
    var Commands = { register: register };

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.Delay');

    var setup = function (editor, toggleState) {
      var debouncedToggle = global$1.debounce(function () {
        VisualChars.toggle(editor);
      }, 300);
      if (editor.settings.forced_root_block !== false) {
        editor.on('keydown', function (e) {
          if (toggleState.get() === true) {
            e.keyCode === 13 ? VisualChars.toggle(editor) : debouncedToggle();
          }
        });
      }
    };
    var Keyboard = { setup: setup };

    var toggleActiveState = function (editor) {
      return function (e) {
        var ctrl = e.control;
        editor.on('VisualChars', function (e) {
          ctrl.active(e.state);
        });
      };
    };
    var register$1 = function (editor) {
      editor.addButton('visualchars', {
        active: false,
        title: 'Show invisible characters',
        cmd: 'mceVisualChars',
        onPostRender: toggleActiveState(editor)
      });
      editor.addMenuItem('visualchars', {
        text: 'Show invisible characters',
        cmd: 'mceVisualChars',
        onPostRender: toggleActiveState(editor),
        selectable: true,
        context: 'view',
        prependToContext: true
      });
    };

    global.add('visualchars', function (editor) {
      var toggleState = Cell(false);
      Commands.register(editor, toggleState);
      register$1(editor);
      Keyboard.setup(editor, toggleState);
      return Api.get(toggleState);
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
