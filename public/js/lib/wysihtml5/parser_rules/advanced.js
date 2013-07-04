/**
 * Full HTML5 compatibility rule set
 * These rules define which tags and CSS classes are supported and which tags should be specially treated.
 *
 * Examples based on this rule set:
 *
 *    <a href="http://foobar.com">foo</a>
 *    ... becomes ...
 *    <a href="http://foobar.com" target="_blank" rel="nofollow">foo</a>
 *
 *    <img align="left" src="http://foobar.com/image.png">
 *    ... becomes ...
 *    <img class="wysiwyg-float-left" src="http://foobar.com/image.png" alt="">
 *
 *    <div>foo<script>alert(document.cookie)</script></div>
 *    ... becomes ...
 *    <div>foo</div>
 *
 *    <marquee>foo</marquee>
 *    ... becomes ...
 *    <span>foo</span>
 *
 *    foo <br clear="both"> bar
 *    ... becomes ...
 *    foo <br class="wysiwyg-clear-both"> bar
 *
 *    <div>hello <iframe src="http://google.com"></iframe></div>
 *    ... becomes ...
 *    <div>hello </div>
 *
 *    <center>hello</center>
 *    ... becomes ...
 *    <div class="wysiwyg-text-align-center">hello</div>
 */
var wysihtml5ParserRules = {
    /**
     * CSS Class white-list
     * Following CSS classes won't be removed when parsed by the wysihtml5 HTML parser
     */
    "classes": {
        "wysiwyg-clear-both": 1,
        "wysiwyg-clear-left": 1,
        "wysiwyg-clear-right": 1,
        "wysiwyg-color-aqua": 1,
        "wysiwyg-color-black": 1,
        "wysiwyg-color-blue": 1,
        "wysiwyg-color-fuchsia": 1,
        "wysiwyg-color-gray": 1,
        "wysiwyg-color-green": 1,
        "wysiwyg-color-lime": 1,
        "wysiwyg-color-maroon": 1,
        "wysiwyg-color-navy": 1,
        "wysiwyg-color-olive": 1,
        "wysiwyg-color-purple": 1,
        "wysiwyg-color-red": 1,
        "wysiwyg-color-silver": 1,
        "wysiwyg-color-teal": 1,
        "wysiwyg-color-white": 1,
        "wysiwyg-color-yellow": 1,
        "wysiwyg-float-left": 1,
        "wysiwyg-float-right": 1,
        "wysiwyg-font-size-large": 1,
        "wysiwyg-font-size-larger": 1,
        "wysiwyg-font-size-medium": 1,
        "wysiwyg-font-size-small": 1,
        "wysiwyg-font-size-smaller": 1,
        "wysiwyg-font-size-x-large": 1,
        "wysiwyg-font-size-x-small": 1,
        "wysiwyg-font-size-xx-large": 1,
        "wysiwyg-font-size-xx-small": 1,
        "wysiwyg-text-align-center": 1,
        "wysiwyg-text-align-justify": 1,
        "wysiwyg-text-align-left": 1,
        "wysiwyg-text-align-right": 1
    },
    /**
     * Tag list
     *
     * The following options are available:
     *
     *    - add_class:        converts and deletes the given HTML4 attribute (align, clear, ...) via the given method to a css class
     *                        The following methods are implemented in wysihtml5.dom.parse:
     *                          - align_text:  converts align attribute values (right/left/center/justify) to their corresponding css class "wysiwyg-text-align-*")
     *                            <p align="center">foo</p> ... becomes ... <p> class="wysiwyg-text-align-center">foo</p>
     *                          - clear_br:    converts clear attribute values left/right/all/both to their corresponding css class "wysiwyg-clear-*"
     *                            <br clear="all"> ... becomes ... <br class="wysiwyg-clear-both">
     *                          - align_img:    converts align attribute values (right/left) on <img> to their corresponding css class "wysiwyg-float-*"
     *                          
     *    - remove:             removes the element and its content
     *
     *    - rename_tag:         renames the element to the given tag
     *
     *    - set_class:          adds the given class to the element (note: make sure that the class is in the "classes" white list above)
     *
     *    - set_attributes:     sets/overrides the given attributes
     *
     *    - check_attributes:   checks the given HTML attribute via the given method
     *                            - url:            allows only valid urls (starting with http:// or https://)
     *                            - src:            allows something like "/foobar.jpg", "http://google.com", ...
     *                            - href:           allows something like "mailto:bert@foo.com", "http://google.com", "/foobar.jpg"
     *                            - alt:            strips unwanted characters. if the attribute is not set, then it gets set (to ensure valid and compatible HTML)
     *                            - numbers:  ensures that the attribute only contains numeric characters
     */
    "tags": {
        "tr": {
            "add_class": {
                "align": "align_text"
            }
        },
        "strike": {
            "remove": 1
        },
        "form": {
            "rename_tag": "div"
        },
        "rt": {
            "rename_tag": "span"
        },
        "code": {},
        "acronym": {
            "rename_tag": "span"
        },
        "br": {
            "add_class": {
                "clear": "clear_br"
            }
        },
        "details": {
            "rename_tag": "div"
        },
        "h4": {
            "add_class": {
                "align": "align_text"
            }
        },
        "em": {},
        "title": {
            "remove": 1
        },
        "multicol": {
            "rename_tag": "div"
        },
        "figure": {
            "rename_tag": "div"
        },
        "xmp": {
            "rename_tag": "span"
        },
        "small": {
            "rename_tag": "span",
            "set_class": "wysiwyg-font-size-smaller"
        },
        "area": {
            "remove": 1
        },
        "time": {
            "rename_tag": "span"
        },
        "dir": {
            "rename_tag": "ul"
        },
        "bdi": {
            "rename_tag": "span"
        },
        "command": {
            "remove": 1
        },
        "ul": {},
        "progress": {
            "rename_tag": "span"
        },
        "dfn": {
            "rename_tag": "span"
        },
        "iframe": {
            "remove": 1
        },
        "figcaption": {
            "rename_tag": "div"
        },
        "a": {
            "check_attributes": {
                "href": "url" // if you compiled master manually then change this from 'url' to 'href'
            },
            "set_attributes": {
                "rel": "nofollow",
                "target": "_blank"
            }
        },
        "img": {
            "check_attributes": {
                "width": "numbers",
                "alt": "alt",
                "src": "url", // if you compiled master manually then change this from 'url' to 'src'
                "height": "numbers"
            },
            "add_class": {
                "align": "align_img"
            }
        },
        "rb": {
            "rename_tag": "span"
        },
        "footer": {
            "rename_tag": "div"
        },
        "noframes": {
            "remove": 1
        },
        "abbr": {
            "rename_tag": "span"
        },
        "u": {},
        "bgsound": {
            "remove": 1
        },
        "sup": {
            "rename_tag": "span"
        },
        "address": {
            "rename_tag": "div"
        },
        "basefont": {
            "remove": 1
        },
        "nav": {
            "rename_tag": "div"
        },
        "h1": {
            "add_class": {
                "align": "align_text"
            }
        },
        "head": {
            "remove": 1
        },
        "tbody": {
            "add_class": {
                "align": "align_text"
            }
        },
        "dd": {
            "rename_tag": "div"
        },
        "s": {
            "rename_tag": "span"
        },
        "li": {},
        "td": {
            "check_attributes": {
                "rowspan": "numbers",
                "colspan": "numbers"
            },
            "add_class": {
                "align": "align_text"
            }
        },
        "object": {
            "remove": 1
        },
        "div": {
            "add_class": {
                "align": "align_text"
            }
        },
        "option": {
            "rename_tag": "span"
        },
        "select": {
            "rename_tag": "span"
        },
        "i": {},
        "track": {
            "remove": 1
        },
        "wbr": {
            "remove": 1
        },
        "fieldset": {
            "rename_tag": "div"
        },
        "big": {
            "rename_tag": "span",
            "set_class": "wysiwyg-font-size-larger"
        },
        "button": {
            "rename_tag": "span"
        },
        "noscript": {
            "remove": 1
        },
        "svg": {
            "remove": 1
        },
        "input": {
            "remove": 1
        },
        "table": {},
        "keygen": {
            "remove": 1
        },
        "h5": {
            "add_class": {
                "align": "align_text"
            }
        },
        "meta": {
            "remove": 1
        },
        "map": {
            "rename_tag": "div"
        },
        "isindex": {
            "remove": 1
        },
        "mark": {
            "rename_tag": "span"
        },
        "caption": {
            "add_class": {
                "align": "align_text"
            }
        },
        "tfoot": {
            "add_class": {
                "align": "align_text"
            }
        },
        "base": {
            "remove": 1
        },
        "video": {
            "remove": 1
        },
        "strong": {},
        "canvas": {
            "remove": 1
        },
        "output": {
            "rename_tag": "span"
        },
        "marquee": {
            "rename_tag": "span"
        },
        "b": {},
        "q": {
            "check_attributes": {
                "cite": "url"
            }
        },
        "applet": {
            "remove": 1
        },
        "span": {},
        "rp": {
            "rename_tag": "span"
        },
        "spacer": {
            "remove": 1
        },
        "source": {
            "remove": 1
        },
        "aside": {
            "rename_tag": "div"
        },
        "frame": {
            "remove": 1
        },
        "section": {
            "rename_tag": "div"
        },
        "body": {
            "rename_tag": "div"
        },
        "ol": {},
        "nobr": {
            "rename_tag": "span"
        },
        "html": {
            "rename_tag": "div"
        },
        "summary": {
            "rename_tag": "span"
        },
        "var": {
            "rename_tag": "span"
        },
        "del": {
            "remove": 1
        },
        "blockquote": {
            "check_attributes": {
                "cite": "url"
            }
        },
        "style": {
            "remove": 1
        },
        "device": {
            "remove": 1
        },
        "meter": {
            "rename_tag": "span"
        },
        "h3": {
            "add_class": {
                "align": "align_text"
            }
        },
        "textarea": {
            "rename_tag": "span"
        },
        "embed": {
            "remove": 1
        },
        "hgroup": {
            "rename_tag": "div"
        },
        "font": {
            "rename_tag": "span",
            "add_class": {
                "size": "size_font"
            }
        },
        "tt": {
            "rename_tag": "span"
        },
        "noembed": {
            "remove": 1
        },
        "thead": {
            "add_class": {
                "align": "align_text"
            }
        },
        "blink": {
            "rename_tag": "span"
        },
        "plaintext": {
            "rename_tag": "span"
        },
        "xml": {
            "remove": 1
        },
        "h6": {
            "add_class": {
                "align": "align_text"
            }
        },
        "param": {
            "remove": 1
        },
        "th": {
            "check_attributes": {
                "rowspan": "numbers",
                "colspan": "numbers"
            },
            "add_class": {
                "align": "align_text"
            }
        },
        "legend": {
            "rename_tag": "span"
        },
        "hr": {},
        "label": {
            "rename_tag": "span"
        },
        "dl": {
            "rename_tag": "div"
        },
        "kbd": {
            "rename_tag": "span"
        },
        "listing": {
            "rename_tag": "div"
        },
        "dt": {
            "rename_tag": "span"
        },
        "nextid": {
            "remove": 1
        },
        "pre": {},
        "center": {
            "rename_tag": "div",
            "set_class": "wysiwyg-text-align-center"
        },
        "audio": {
            "remove": 1
        },
        "datalist": {
            "rename_tag": "span"
        },
        "samp": {
            "rename_tag": "span"
        },
        "col": {
            "remove": 1
        },
        "article": {
            "rename_tag": "div"
        },
        "cite": {},
        "link": {
            "remove": 1
        },
        "script": {
            "remove": 1
        },
        "bdo": {
            "rename_tag": "span"
        },
        "menu": {
            "rename_tag": "ul"
        },
        "colgroup": {
            "remove": 1
        },
        "ruby": {
            "rename_tag": "span"
        },
        "h2": {
            "add_class": {
                "align": "align_text"
            }
        },
        "ins": {
            "rename_tag": "span"
        },
        "p": {
            "add_class": {
                "align": "align_text"
            }
        },
        "sub": {
            "rename_tag": "span"
        },
        "comment": {
            "remove": 1
        },
        "frameset": {
            "remove": 1
        },
        "optgroup": {
            "rename_tag": "span"
        },
        "header": {
            "rename_tag": "div"
        }
    }
};