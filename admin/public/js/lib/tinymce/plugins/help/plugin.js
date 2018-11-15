(function () {
var help = (function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var constant = function (value) {
      return function () {
        return value;
      };
    };
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
    var not = function (f) {
      return function () {
        var x = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          x[_i] = arguments[_i];
        }
        return !f.apply(null, arguments);
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

    var rawIndexOf = function () {
      var pIndexOf = Array.prototype.indexOf;
      var fastIndex = function (xs, x) {
        return pIndexOf.call(xs, x);
      };
      var slowIndex = function (xs, x) {
        return slowIndexOf(xs, x);
      };
      return pIndexOf === undefined ? slowIndex : fastIndex;
    }();
    var contains = function (xs, x) {
      return rawIndexOf(xs, x) > -1;
    };
    var map = function (xs, f) {
      var len = xs.length;
      var r = new Array(len);
      for (var i = 0; i < len; i++) {
        var x = xs[i];
        r[i] = f(x, i, xs);
      }
      return r;
    };
    var filter = function (xs, pred) {
      var r = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          r.push(x);
        }
      }
      return r;
    };
    var find = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          return Option.some(x);
        }
      }
      return Option.none();
    };
    var slowIndexOf = function (xs, x) {
      for (var i = 0, len = xs.length; i < len; ++i) {
        if (xs[i] === x) {
          return i;
        }
      }
      return -1;
    };
    var slice = Array.prototype.slice;
    var from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x);
    };

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.I18n');

    var global$2 = tinymce.util.Tools.resolve('tinymce.Env');

    var meta = global$2.mac ? '\u2318' : 'Ctrl';
    var access = global$2.mac ? 'Ctrl + Alt' : 'Shift + Alt';
    var shortcuts = [
      {
        shortcut: meta + ' + B',
        action: 'Bold'
      },
      {
        shortcut: meta + ' + I',
        action: 'Italic'
      },
      {
        shortcut: meta + ' + U',
        action: 'Underline'
      },
      {
        shortcut: meta + ' + A',
        action: 'Select all'
      },
      {
        shortcut: meta + ' + Y or ' + meta + ' + Shift + Z',
        action: 'Redo'
      },
      {
        shortcut: meta + ' + Z',
        action: 'Undo'
      },
      {
        shortcut: access + ' + 1',
        action: 'Header 1'
      },
      {
        shortcut: access + ' + 2',
        action: 'Header 2'
      },
      {
        shortcut: access + ' + 3',
        action: 'Header 3'
      },
      {
        shortcut: access + ' + 4',
        action: 'Header 4'
      },
      {
        shortcut: access + ' + 5',
        action: 'Header 5'
      },
      {
        shortcut: access + ' + 6',
        action: 'Header 6'
      },
      {
        shortcut: access + ' + 7',
        action: 'Paragraph'
      },
      {
        shortcut: access + ' + 8',
        action: 'Div'
      },
      {
        shortcut: access + ' + 9',
        action: 'Address'
      },
      {
        shortcut: 'Alt + F9',
        action: 'Focus to menubar'
      },
      {
        shortcut: 'Alt + F10',
        action: 'Focus to toolbar'
      },
      {
        shortcut: 'Alt + F11',
        action: 'Focus to element path'
      },
      {
        shortcut: 'Ctrl + F9',
        action: 'Focus to contextual toolbar'
      },
      {
        shortcut: meta + ' + K',
        action: 'Insert link (if link plugin activated)'
      },
      {
        shortcut: meta + ' + S',
        action: 'Save (if save plugin activated)'
      },
      {
        shortcut: meta + ' + F',
        action: 'Find (if searchreplace plugin activated)'
      }
    ];
    var KeyboardShortcuts = { shortcuts: shortcuts };

    var makeTab = function () {
      var makeAriaLabel = function (shortcut) {
        return 'aria-label="Action: ' + shortcut.action + ', Shortcut: ' + shortcut.shortcut.replace(/Ctrl/g, 'Control') + '"';
      };
      var shortcutLisString = map(KeyboardShortcuts.shortcuts, function (shortcut) {
        return '<tr data-mce-tabstop="1" tabindex="-1" ' + makeAriaLabel(shortcut) + '>' + '<td>' + global$1.translate(shortcut.action) + '</td>' + '<td>' + shortcut.shortcut + '</td>' + '</tr>';
      }).join('');
      return {
        title: 'Handy Shortcuts',
        type: 'container',
        style: 'overflow-y: auto; overflow-x: hidden; max-height: 250px',
        items: [{
            type: 'container',
            html: '<div>' + '<table class="mce-table-striped">' + '<thead>' + '<th>' + global$1.translate('Action') + '</th>' + '<th>' + global$1.translate('Shortcut') + '</th>' + '</thead>' + shortcutLisString + '</table>' + '</div>'
          }]
      };
    };
    var KeyboardShortcutsTab = { makeTab: makeTab };

    var keys = Object.keys;

    var supplant = function (str, obj) {
      var isStringOrNumber = function (a) {
        var t = typeof a;
        return t === 'string' || t === 'number';
      };
      return str.replace(/\$\{([^{}]*)\}/g, function (fullMatch, key) {
        var value = obj[key];
        return isStringOrNumber(value) ? value.toString() : fullMatch;
      });
    };

    var urls = [
      {
        key: 'advlist',
        name: 'Advanced List'
      },
      {
        key: 'anchor',
        name: 'Anchor'
      },
      {
        key: 'autolink',
        name: 'Autolink'
      },
      {
        key: 'autoresize',
        name: 'Autoresize'
      },
      {
        key: 'autosave',
        name: 'Autosave'
      },
      {
        key: 'bbcode',
        name: 'BBCode'
      },
      {
        key: 'charmap',
        name: 'Character Map'
      },
      {
        key: 'code',
        name: 'Code'
      },
      {
        key: 'codesample',
        name: 'Code Sample'
      },
      {
        key: 'colorpicker',
        name: 'Color Picker'
      },
      {
        key: 'compat3x',
        name: '3.x Compatibility'
      },
      {
        key: 'contextmenu',
        name: 'Context Menu'
      },
      {
        key: 'directionality',
        name: 'Directionality'
      },
      {
        key: 'emoticons',
        name: 'Emoticons'
      },
      {
        key: 'fullpage',
        name: 'Full Page'
      },
      {
        key: 'fullscreen',
        name: 'Full Screen'
      },
      {
        key: 'help',
        name: 'Help'
      },
      {
        key: 'hr',
        name: 'Horizontal Rule'
      },
      {
        key: 'image',
        name: 'Image'
      },
      {
        key: 'imagetools',
        name: 'Image Tools'
      },
      {
        key: 'importcss',
        name: 'Import CSS'
      },
      {
        key: 'insertdatetime',
        name: 'Insert Date/Time'
      },
      {
        key: 'legacyoutput',
        name: 'Legacy Output'
      },
      {
        key: 'link',
        name: 'Link'
      },
      {
        key: 'lists',
        name: 'Lists'
      },
      {
        key: 'media',
        name: 'Media'
      },
      {
        key: 'nonbreaking',
        name: 'Nonbreaking'
      },
      {
        key: 'noneditable',
        name: 'Noneditable'
      },
      {
        key: 'pagebreak',
        name: 'Page Break'
      },
      {
        key: 'paste',
        name: 'Paste'
      },
      {
        key: 'preview',
        name: 'Preview'
      },
      {
        key: 'print',
        name: 'Print'
      },
      {
        key: 'save',
        name: 'Save'
      },
      {
        key: 'searchreplace',
        name: 'Search and Replace'
      },
      {
        key: 'spellchecker',
        name: 'Spell Checker'
      },
      {
        key: 'tabfocus',
        name: 'Tab Focus'
      },
      {
        key: 'table',
        name: 'Table'
      },
      {
        key: 'template',
        name: 'Template'
      },
      {
        key: 'textcolor',
        name: 'Text Color'
      },
      {
        key: 'textpattern',
        name: 'Text Pattern'
      },
      {
        key: 'toc',
        name: 'Table of Contents'
      },
      {
        key: 'visualblocks',
        name: 'Visual Blocks'
      },
      {
        key: 'visualchars',
        name: 'Visual Characters'
      },
      {
        key: 'wordcount',
        name: 'Word Count'
      }
    ];
    var PluginUrls = { urls: urls };

    var makeLink = curry(supplant, '<a href="${url}" target="_blank" rel="noopener">${name}</a>');
    var maybeUrlize = function (editor, key) {
      return find(PluginUrls.urls, function (x) {
        return x.key === key;
      }).fold(function () {
        var getMetadata = editor.plugins[key].getMetadata;
        return typeof getMetadata === 'function' ? makeLink(getMetadata()) : key;
      }, function (x) {
        return makeLink({
          name: x.name,
          url: 'https://www.tinymce.com/docs/plugins/' + x.key
        });
      });
    };
    var getPluginKeys = function (editor) {
      var keys$$1 = keys(editor.plugins);
      return editor.settings.forced_plugins === undefined ? keys$$1 : filter(keys$$1, not(curry(contains, editor.settings.forced_plugins)));
    };
    var pluginLister = function (editor) {
      var pluginKeys = getPluginKeys(editor);
      var pluginLis = map(pluginKeys, function (key) {
        return '<li>' + maybeUrlize(editor, key) + '</li>';
      });
      var count = pluginLis.length;
      var pluginsString = pluginLis.join('');
      return '<p><b>' + global$1.translate([
        'Plugins installed ({0}):',
        count
      ]) + '</b></p>' + '<ul>' + pluginsString + '</ul>';
    };
    var installedPlugins = function (editor) {
      return {
        type: 'container',
        html: '<div style="overflow-y: auto; overflow-x: hidden; max-height: 230px; height: 230px;" data-mce-tabstop="1" tabindex="-1">' + pluginLister(editor) + '</div>',
        flex: 1
      };
    };
    var availablePlugins = function () {
      return {
        type: 'container',
        html: '<div style="padding: 10px; background: #e3e7f4; height: 100%;" data-mce-tabstop="1" tabindex="-1">' + '<p><b>' + global$1.translate('Premium plugins:') + '</b></p>' + '<ul>' + '<li>PowerPaste</li>' + '<li>Spell Checker Pro</li>' + '<li>Accessibility Checker</li>' + '<li>Advanced Code Editor</li>' + '<li>Enhanced Media Embed</li>' + '<li>Link Checker</li>' + '</ul><br />' + '<p style="float: right;"><a href="https://www.tinymce.com/pricing/?utm_campaign=editor_referral&utm_medium=help_dialog&utm_source=tinymce" target="_blank">' + global$1.translate('Learn more...') + '</a></p>' + '</div>',
        flex: 1
      };
    };
    var makeTab$1 = function (editor) {
      return {
        title: 'Plugins',
        type: 'container',
        style: 'overflow-y: auto; overflow-x: hidden;',
        layout: 'flex',
        padding: 10,
        spacing: 10,
        items: [
          installedPlugins(editor),
          availablePlugins()
        ]
      };
    };
    var PluginsTab = { makeTab: makeTab$1 };

    var global$3 = tinymce.util.Tools.resolve('tinymce.EditorManager');

    var getVersion = function (major, minor) {
      return major.indexOf('@') === 0 ? 'X.X.X' : major + '.' + minor;
    };
    var makeRow = function () {
      var version = getVersion(global$3.majorVersion, global$3.minorVersion);
      var changeLogLink = '<a href="https://www.tinymce.com/docs/changelog/?utm_campaign=editor_referral&utm_medium=help_dialog&utm_source=tinymce" target="_blank">TinyMCE ' + version + '</a>';
      return [
        {
          type: 'label',
          html: global$1.translate([
            'You are using {0}',
            changeLogLink
          ])
        },
        {
          type: 'spacer',
          flex: 1
        },
        {
          text: 'Close',
          onclick: function () {
            this.parent().parent().close();
          }
        }
      ];
    };
    var ButtonsRow = { makeRow: makeRow };

    var open = function (editor, pluginUrl) {
      return function () {
        editor.windowManager.open({
          title: 'Help',
          bodyType: 'tabpanel',
          layout: 'flex',
          body: [
            KeyboardShortcutsTab.makeTab(),
            PluginsTab.makeTab(editor)
          ],
          buttons: ButtonsRow.makeRow(),
          onPostRender: function () {
            var title = this.getEl('title');
            title.innerHTML = '<img src="' + pluginUrl + '/img/logo.png" alt="TinyMCE Logo" style="display: inline-block; width: 200px; height: 50px">';
          }
        });
      };
    };
    var Dialog = { open: open };

    var register = function (editor, pluginUrl) {
      editor.addCommand('mceHelp', Dialog.open(editor, pluginUrl));
    };
    var Commands = { register: register };

    var register$1 = function (editor, pluginUrl) {
      editor.addButton('help', {
        icon: 'help',
        onclick: Dialog.open(editor, pluginUrl)
      });
      editor.addMenuItem('help', {
        text: 'Help',
        icon: 'help',
        context: 'help',
        onclick: Dialog.open(editor, pluginUrl)
      });
    };
    var Buttons = { register: register$1 };

    global.add('help', function (editor, pluginUrl) {
      Buttons.register(editor, pluginUrl);
      Commands.register(editor, pluginUrl);
      editor.shortcuts.add('Alt+0', 'Open help dialog', 'mceHelp');
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
