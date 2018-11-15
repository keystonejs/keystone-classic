(function () {
var advlist = (function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    var applyListFormat = function (editor, listName, styleValue) {
      var cmd = listName === 'UL' ? 'InsertUnorderedList' : 'InsertOrderedList';
      editor.execCommand(cmd, false, styleValue === false ? null : { 'list-style-type': styleValue });
    };
    var Actions = { applyListFormat: applyListFormat };

    var register = function (editor) {
      editor.addCommand('ApplyUnorderedListStyle', function (ui, value) {
        Actions.applyListFormat(editor, 'UL', value['list-style-type']);
      });
      editor.addCommand('ApplyOrderedListStyle', function (ui, value) {
        Actions.applyListFormat(editor, 'OL', value['list-style-type']);
      });
    };
    var Commands = { register: register };

    var getNumberStyles = function (editor) {
      var styles = editor.getParam('advlist_number_styles', 'default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman');
      return styles ? styles.split(/[ ,]/) : [];
    };
    var getBulletStyles = function (editor) {
      var styles = editor.getParam('advlist_bullet_styles', 'default,circle,disc,square');
      return styles ? styles.split(/[ ,]/) : [];
    };
    var Settings = {
      getNumberStyles: getNumberStyles,
      getBulletStyles: getBulletStyles
    };

    var isChildOfBody = function (editor, elm) {
      return editor.$.contains(editor.getBody(), elm);
    };
    var isTableCellNode = function (node) {
      return node && /^(TH|TD)$/.test(node.nodeName);
    };
    var isListNode = function (editor) {
      return function (node) {
        return node && /^(OL|UL|DL)$/.test(node.nodeName) && isChildOfBody(editor, node);
      };
    };
    var getSelectedStyleType = function (editor) {
      var listElm = editor.dom.getParent(editor.selection.getNode(), 'ol,ul');
      return editor.dom.getStyle(listElm, 'listStyleType') || '';
    };
    var ListUtils = {
      isTableCellNode: isTableCellNode,
      isListNode: isListNode,
      getSelectedStyleType: getSelectedStyleType
    };

    var styleValueToText = function (styleValue) {
      return styleValue.replace(/\-/g, ' ').replace(/\b\w/g, function (chr) {
        return chr.toUpperCase();
      });
    };
    var toMenuItems = function (styles) {
      return global$1.map(styles, function (styleValue) {
        var text = styleValueToText(styleValue);
        var data = styleValue === 'default' ? '' : styleValue;
        return {
          text: text,
          data: data
        };
      });
    };
    var ListStyles = { toMenuItems: toMenuItems };

    var findIndex = function (list, predicate) {
      for (var index = 0; index < list.length; index++) {
        var element = list[index];
        if (predicate(element)) {
          return index;
        }
      }
      return -1;
    };
    var listState = function (editor, listName) {
      return function (e) {
        var ctrl = e.control;
        editor.on('NodeChange', function (e) {
          var tableCellIndex = findIndex(e.parents, ListUtils.isTableCellNode);
          var parents = tableCellIndex !== -1 ? e.parents.slice(0, tableCellIndex) : e.parents;
          var lists = global$1.grep(parents, ListUtils.isListNode(editor));
          ctrl.active(lists.length > 0 && lists[0].nodeName === listName);
        });
      };
    };
    var updateSelection = function (editor) {
      return function (e) {
        var listStyleType = ListUtils.getSelectedStyleType(editor);
        e.control.items().each(function (ctrl) {
          ctrl.active(ctrl.settings.data === listStyleType);
        });
      };
    };
    var addSplitButton = function (editor, id, tooltip, cmd, nodeName, styles) {
      editor.addButton(id, {
        active: false,
        type: 'splitbutton',
        tooltip: tooltip,
        menu: ListStyles.toMenuItems(styles),
        onPostRender: listState(editor, nodeName),
        onshow: updateSelection(editor),
        onselect: function (e) {
          Actions.applyListFormat(editor, nodeName, e.control.settings.data);
        },
        onclick: function () {
          editor.execCommand(cmd);
        }
      });
    };
    var addButton = function (editor, id, tooltip, cmd, nodeName, styles) {
      editor.addButton(id, {
        active: false,
        type: 'button',
        tooltip: tooltip,
        onPostRender: listState(editor, nodeName),
        onclick: function () {
          editor.execCommand(cmd);
        }
      });
    };
    var addControl = function (editor, id, tooltip, cmd, nodeName, styles) {
      if (styles.length > 0) {
        addSplitButton(editor, id, tooltip, cmd, nodeName, styles);
      } else {
        addButton(editor, id, tooltip, cmd, nodeName, styles);
      }
    };
    var register$1 = function (editor) {
      addControl(editor, 'numlist', 'Numbered list', 'InsertOrderedList', 'OL', Settings.getNumberStyles(editor));
      addControl(editor, 'bullist', 'Bullet list', 'InsertUnorderedList', 'UL', Settings.getBulletStyles(editor));
    };
    var Buttons = { register: register$1 };

    global.add('advlist', function (editor) {
      var hasPlugin = function (editor, plugin) {
        var plugins = editor.settings.plugins ? editor.settings.plugins : '';
        return global$1.inArray(plugins.split(/[ ,]/), plugin) !== -1;
      };
      if (hasPlugin(editor, 'lists')) {
        Buttons.register(editor);
        Commands.register(editor);
      }
    });
    function Plugin () {
    }

    return Plugin;

}());
})();
