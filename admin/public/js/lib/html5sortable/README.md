HTML5 Sortable jQuery Plugin
============================

**[Demos & Documentation](http://farhadi.ir/projects/html5sortable)**

Features
--------
* Less than 1KB (minified and gzipped).
* Built using native HTML5 drag and drop API.
* Supports both list and grid style layouts.
* Similar API and behaviour to jquery-ui sortable plugin.
* Works in IE 5.5+, Firefox 3.5+, Chrome 3+, Safari 3+ and, Opera 12+.

Usage
-----
Use `sortable` method to create a sortable list:

``` javascript
$('.sortable').sortable();
```
Use `.sortable-dragging` and `.sortable-placeholder` CSS selectors to change the styles of a dragging item and its placeholder respectively.

Use `sortupdate` event if you want to do something when the order changes (e.g. storing the new order):

``` javascript
$('.sortable').sortable().bind('sortupdate', function(e, ui) {
    //ui.item contains the current dragged element.
    //Triggered when the user stopped sorting and the DOM position has changed.
});
```

Use `items` option to specifiy which items inside the element should be sortable:

``` javascript
$('.sortable').sortable({
    items: ':not(.disabled)'
});
```
Use `handle` option to restrict drag start to the specified element:

``` javascript
$('.sortable').sortable({
    handle: 'h2'
});
```
Setting `forcePlaceholderSize` option to true, forces the placeholder to have a height:

``` javascript
$('.sortable').sortable({
    forcePlaceholderSize: true 
});
```

Use `connectWith` option to create connected lists:

``` javascript
$('#sortable1, #sortable2').sortable({
    connectWith: '.connected'
});
```

To remove the sortable functionality completely:

``` javascript
$('.sortable').sortable('destroy');
```

To disable the sortable temporarily:

``` javascript
$('.sortable').sortable('disable');
```

To enable a disabled sortable:

``` javascript
$('.sortable').sortable('enable');
```

The API is compatible with jquery-ui. So you can use jquery-ui as a polyfill in older browsers:

``` javascript
yepnope({
    test: Modernizr.draganddrop,
    yep: 'jquery.sortable.js',
    nope: 'jquery-ui.min.js',
    complete: function() {
        $('.sortable').sortable().bind('sortupdate', function(e, ui) {
            //Store the new order.
        }
    }
});
```

License
-------
Released under the MIT license.
