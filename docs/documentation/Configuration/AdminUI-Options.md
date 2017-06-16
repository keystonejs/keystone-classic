# Admin UI Options

The following options control some ui options for the Admin backend:

<h4 data-primitive-type="Boolean"><code>wysiwyg images</code></h4>

Adds an image button which enables including images from other URLS in your WYSIWYG Editor.

<h4 data-primitive-type="Boolean"><code>wysiwyg cloudinary images</code></h4>

Adds an image upload button and enables cloudinary image uploads directly in your WYSIWYG Editor.

<h4 data-primitive-type="String"><code>wysiwyg additional buttons</code></h4>

Allows to add additional extra functionality buttons such as blockquote. A complete list of available buttons can be found at: [http://www.tinymce.com/wiki.php/Controls](http://www.tinymce.com/wiki.php/Controls)

<h4 data-primitive-type="String"><code>wysiwyg additional plugins</code></h4>

Allows for additional plugins to be activated which can be found at: [http://www.tinymce.com/wiki.php/Plugins](http://www.tinymce.com/wiki.php/Plugins)

<h4 data-primitive-type="Object"><code>wysiwyg additional options</code></h4>

Allows for additional TinyMCE options, such as `{ menubar: true }` to be modified.

<h4 data-primitive-type="Boolean"><code>wysiwyg override toolbar</code></h4>

This will remove the default set of buttons for wysiwyg mode. Use this with `wysiwyg additional buttons` and `wysiwyg additional plugins`. Defaults to `false`.

<h4 data-primitive-type="Boolean"><code>wysiwyg menubar</code></h4>

Show the menubar for wysiwyg editor. Defaults to `false`. See [http://www.tinymce.com/wiki.php/Configuration:menubar](http://www.tinymce.com/wiki.php/Configuration:menubar) for more details.

<h4 data-primitive-type="String"><code>wysiwyg importcss</code></h4>

Sets the `content_css` and configures the `importcss` plugin for TinyMCE. See [http://www.tinymce.com/wiki.php/Configuration:content_css](http://www.tinymce.com/wiki.php/Configuration:content_css) for more details.

<h4 data-primitive-type="String"><code>wysiwyg skin</code></h4>

Allow you to change the TinyMCE skin. Defaults to `keystone`. See [http://www.tinymce.com/wiki.php/Configuration:skin](http://www.tinymce.com/wiki.php/Configuration:skin) for more details.

**Example using wysiwyg options**

```javascript
keystone.init({
  'wysiwyg override toolbar': false,
  'wysiwyg menubar': true,
  'wysiwyg skin': 'lightgray',
  'wysiwyg additional buttons': 'searchreplace visualchars,'
   + ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
   +' emoticons media, preview print ',
  'wysiwyg additional plugins': 'example, table, advlist, anchor,'
   + ' autolink, autosave, bbcode, charmap, contextmenu, '
   + ' directionality, emoticons, fullpage, hr, media, pagebreak,'
   + ' paste, preview, print, searchreplace, textcolor,'
   + ' visualblocks, visualchars, wordcount',
});
```
