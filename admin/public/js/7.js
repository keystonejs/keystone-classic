webpackJsonp([7],{623:function(e,t,r){"use strict"
function n(e){return e&&e.__esModule?e:{default:e}}var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},o=r(692),l=n(o),s=r(18),a=n(s),c=r(1),u=n(c),f=r(20),h=r(3),d=r(4),p=n(d)
r(1341),e.exports=a["default"].create({displayName:"CodeField",statics:{type:"Code"},getInitialState:function(){return{isFocused:!1}},componentDidMount:function(){if(this.refs.codemirror){var e=i({lineNumbers:!0,readOnly:!this.shouldRenderField()},this.props.editor)
this.codeMirror=l["default"].fromTextArea((0,f.findDOMNode)(this.refs.codemirror),e),this.codeMirror.setSize(null,this.props.height),this.codeMirror.on("change",this.codemirrorValueChanged),this.codeMirror.on("focus",this.focusChanged.bind(this,!0)),this.codeMirror.on("blur",this.focusChanged.bind(this,!1)),this._currentCodemirrorValue=this.props.value}},componentWillUnmount:function(){this.codeMirror&&this.codeMirror.toTextArea()},componentWillReceiveProps:function(e){this.codeMirror&&this._currentCodemirrorValue!==e.value&&this.codeMirror.setValue(e.value)},focus:function(){this.codeMirror&&this.codeMirror.focus()},focusChanged:function(e){this.setState({isFocused:e})},codemirrorValueChanged:function(e,t){var r=e.getValue()
this._currentCodemirrorValue=r,this.props.onChange({path:this.props.path,value:r})},renderCodemirror:function(){var e=(0,p["default"])("CodeMirror-container",{"is-focused":this.state.isFocused&&this.shouldRenderField()})
return u["default"].createElement("div",{className:e},u["default"].createElement(h.FormInput,{autoComplete:"off",multiline:!0,name:this.getInputName(this.props.path),onChange:this.valueChanged,ref:"codemirror",value:this.props.value}))},renderValue:function(){return this.renderCodemirror()},renderField:function(){return this.renderCodemirror()}})},692:function(e,t,r){!function(t){e.exports=t()}(function(){"use strict"
function e(r,n){if(!(this instanceof e))return new e(r,n)
this.options=n=n?Fi(n):{},Fi(rl,n,!1),d(n)
var i=n.value
"string"==typeof i&&(i=new kl(i,n.mode,null,n.lineSeparator)),this.doc=i
var o=new e.inputStyles[n.inputStyle](this),l=this.display=new t(r,i,o)
l.wrapper.CodeMirror=this,c(this),s(this),n.lineWrapping&&(this.display.wrapper.className+=" CodeMirror-wrap"),n.autofocus&&!Wo&&l.input.focus(),m(this),this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,delayingBlurEvent:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,cutIncoming:!1,selectingText:!1,draggingText:!1,highlight:new Wi,keySeq:null,specialChars:null}
var a=this
xo&&Co<11&&setTimeout(function(){a.display.input.reset(!0)},20),Vt(this),Zi(),xt(this),this.curOp.forceUpdate=!0,Zn(this,i),n.autofocus&&!Wo||a.hasFocus()?setTimeout(Bi(mr,this),20):yr(this)
for(var u in nl)nl.hasOwnProperty(u)&&nl[u](this,n[u],il)
C(this),n.finishInit&&n.finishInit(this)
for(var f=0;f<al.length;++f)al[f](this)
St(this),So&&n.lineWrapping&&"optimizelegibility"==getComputedStyle(l.lineDiv).textRendering&&(l.lineDiv.style.textRendering="auto")}function t(e,t,r){var n=this
this.input=r,n.scrollbarFiller=Ki("div",null,"CodeMirror-scrollbar-filler"),n.scrollbarFiller.setAttribute("cm-not-content","true"),n.gutterFiller=Ki("div",null,"CodeMirror-gutter-filler"),n.gutterFiller.setAttribute("cm-not-content","true"),n.lineDiv=Ki("div",null,"CodeMirror-code"),n.selectionDiv=Ki("div",null,null,"position: relative; z-index: 1"),n.cursorDiv=Ki("div",null,"CodeMirror-cursors"),n.measure=Ki("div",null,"CodeMirror-measure"),n.lineMeasure=Ki("div",null,"CodeMirror-measure"),n.lineSpace=Ki("div",[n.measure,n.lineMeasure,n.selectionDiv,n.cursorDiv,n.lineDiv],null,"position: relative; outline: none"),n.mover=Ki("div",[Ki("div",[n.lineSpace],"CodeMirror-lines")],null,"position: relative"),n.sizer=Ki("div",[n.mover],"CodeMirror-sizer"),n.sizerWidth=null,n.heightForcer=Ki("div",null,null,"position: absolute; height: "+Il+"px; width: 1px;"),n.gutters=Ki("div",null,"CodeMirror-gutters"),n.lineGutter=null,n.scroller=Ki("div",[n.sizer,n.heightForcer,n.gutters],"CodeMirror-scroll"),n.scroller.setAttribute("tabIndex","-1"),n.wrapper=Ki("div",[n.scrollbarFiller,n.gutterFiller,n.scroller],"CodeMirror"),xo&&Co<8&&(n.gutters.style.zIndex=-1,n.scroller.style.paddingRight=0),So||yo&&Wo||(n.scroller.draggable=!0),e&&(e.appendChild?e.appendChild(n.wrapper):e(n.wrapper)),n.viewFrom=n.viewTo=t.first,n.reportedViewFrom=n.reportedViewTo=t.first,n.view=[],n.renderedView=null,n.externalMeasured=null,n.viewOffset=0,n.lastWrapHeight=n.lastWrapWidth=0,n.updateLineNumbers=null,n.nativeBarWidth=n.barHeight=n.barWidth=0,n.scrollbarsClipped=!1,n.lineNumWidth=n.lineNumInnerWidth=n.lineNumChars=null,n.alignWidgets=!1,n.cachedCharWidth=n.cachedTextHeight=n.cachedPaddingH=null,n.maxLine=null,n.maxLineLength=0,n.maxLineChanged=!1,n.wheelDX=n.wheelDY=n.wheelStartX=n.wheelStartY=null,n.shift=!1,n.selForContextMenu=null,n.activeTouch=null,r.init(n)}function r(t){t.doc.mode=e.getMode(t.options,t.doc.modeOption),n(t)}function n(e){e.doc.iter(function(e){e.stateAfter&&(e.stateAfter=null),e.styles&&(e.styles=null)}),e.doc.frontier=e.doc.first,Fe(e,100),e.state.modeGen++,e.curOp&&Pt(e)}function i(e){e.options.lineWrapping?(es(e.display.wrapper,"CodeMirror-wrap"),e.display.sizer.style.minWidth="",e.display.sizerWidth=null):(Ql(e.display.wrapper,"CodeMirror-wrap"),h(e)),l(e),Pt(e),at(e),setTimeout(function(){y(e)},100)}function o(e){var t=bt(e.display),r=e.options.lineWrapping,n=r&&Math.max(5,e.display.scroller.clientWidth/wt(e.display)-3)
return function(i){if(Sn(e.doc,i))return 0
var o=0
if(i.widgets)for(var l=0;l<i.widgets.length;l++)i.widgets[l].height&&(o+=i.widgets[l].height)
return r?o+(Math.ceil(i.text.length/n)||1)*t:o+t}}function l(e){var t=e.doc,r=o(e)
t.iter(function(e){var t=r(e)
t!=e.height&&ti(e,t)})}function s(e){e.display.wrapper.className=e.display.wrapper.className.replace(/\s*cm-s-\S+/g,"")+e.options.theme.replace(/(^|\s)\s*/g," cm-s-"),at(e)}function a(e){c(e),Pt(e),setTimeout(function(){x(e)},20)}function c(e){var t=e.display.gutters,r=e.options.gutters
ji(t)
for(var n=0;n<r.length;++n){var i=r[n],o=t.appendChild(Ki("div",null,"CodeMirror-gutter "+i))
"CodeMirror-linenumbers"==i&&(e.display.lineGutter=o,o.style.width=(e.display.lineNumWidth||1)+"px")}t.style.display=n?"":"none",u(e)}function u(e){var t=e.display.gutters.offsetWidth
e.display.sizer.style.marginLeft=t+"px"}function f(e){if(0==e.height)return 0
for(var t,r=e.text.length,n=e;t=vn(n);){var i=t.find(0,!0)
n=i.from.line,r+=i.from.ch-i.to.ch}for(n=e;t=mn(n);){var i=t.find(0,!0)
r-=n.text.length-i.from.ch,n=i.to.line,r+=n.text.length-i.to.ch}return r}function h(e){var t=e.display,r=e.doc
t.maxLine=Jn(r,r.first),t.maxLineLength=f(t.maxLine),t.maxLineChanged=!0,r.iter(function(e){var r=f(e)
r>t.maxLineLength&&(t.maxLineLength=r,t.maxLine=e)})}function d(e){var t=zi(e.gutters,"CodeMirror-linenumbers")
t==-1&&e.lineNumbers?e.gutters=e.gutters.concat(["CodeMirror-linenumbers"]):t>-1&&!e.lineNumbers&&(e.gutters=e.gutters.slice(0),e.gutters.splice(t,1))}function p(e){var t=e.display,r=t.gutters.offsetWidth,n=Math.round(e.doc.height+Ke(e.display))
return{clientHeight:t.scroller.clientHeight,viewHeight:t.wrapper.clientHeight,scrollWidth:t.scroller.scrollWidth,clientWidth:t.scroller.clientWidth,viewWidth:t.wrapper.clientWidth,barLeft:e.options.fixedGutter?r:0,docHeight:n,scrollHeight:n+Xe(e)+t.barHeight,nativeBarWidth:t.nativeBarWidth,gutterWidth:r}}function g(e,t,r){this.cm=r
var n=this.vert=Ki("div",[Ki("div",null,null,"min-width: 1px")],"CodeMirror-vscrollbar"),i=this.horiz=Ki("div",[Ki("div",null,null,"height: 100%; min-height: 1px")],"CodeMirror-hscrollbar")
e(n),e(i),Dl(n,"scroll",function(){n.clientHeight&&t(n.scrollTop,"vertical")}),Dl(i,"scroll",function(){i.clientWidth&&t(i.scrollLeft,"horizontal")}),this.checkedZeroWidth=!1,xo&&Co<8&&(this.horiz.style.minHeight=this.vert.style.minWidth="18px")}function v(){}function m(t){t.display.scrollbars&&(t.display.scrollbars.clear(),t.display.scrollbars.addClass&&Ql(t.display.wrapper,t.display.scrollbars.addClass)),t.display.scrollbars=new e.scrollbarModel[t.options.scrollbarStyle](function(e){t.display.wrapper.insertBefore(e,t.display.scrollbarFiller),Dl(e,"mousedown",function(){t.state.focused&&setTimeout(function(){t.display.input.focus()},0)}),e.setAttribute("cm-not-content","true")},function(e,r){"horizontal"==r?or(t,e):ir(t,e)},t),t.display.scrollbars.addClass&&es(t.display.wrapper,t.display.scrollbars.addClass)}function y(e,t){t||(t=p(e))
var r=e.display.barWidth,n=e.display.barHeight
b(e,t)
for(var i=0;i<4&&r!=e.display.barWidth||n!=e.display.barHeight;i++)r!=e.display.barWidth&&e.options.lineWrapping&&W(e),b(e,p(e)),r=e.display.barWidth,n=e.display.barHeight}function b(e,t){var r=e.display,n=r.scrollbars.update(t)
r.sizer.style.paddingRight=(r.barWidth=n.right)+"px",r.sizer.style.paddingBottom=(r.barHeight=n.bottom)+"px",r.heightForcer.style.borderBottom=n.bottom+"px solid transparent",n.right&&n.bottom?(r.scrollbarFiller.style.display="block",r.scrollbarFiller.style.height=n.bottom+"px",r.scrollbarFiller.style.width=n.right+"px"):r.scrollbarFiller.style.display="",n.bottom&&e.options.coverGutterNextToScrollbar&&e.options.fixedGutter?(r.gutterFiller.style.display="block",r.gutterFiller.style.height=n.bottom+"px",r.gutterFiller.style.width=t.gutterWidth+"px"):r.gutterFiller.style.display=""}function w(e,t,r){var n=r&&null!=r.top?Math.max(0,r.top):e.scroller.scrollTop
n=Math.floor(n-Ve(e))
var i=r&&null!=r.bottom?r.bottom:n+e.wrapper.clientHeight,o=ni(t,n),l=ni(t,i)
if(r&&r.ensure){var s=r.ensure.from.line,a=r.ensure.to.line
s<o?(o=s,l=ni(t,ii(Jn(t,s))+e.wrapper.clientHeight)):Math.min(a,t.lastLine())>=l&&(o=ni(t,ii(Jn(t,a))-e.wrapper.clientHeight),l=a)}return{from:o,to:Math.max(l,o+1)}}function x(e){var t=e.display,r=t.view
if(t.alignWidgets||t.gutters.firstChild&&e.options.fixedGutter){for(var n=L(t)-t.scroller.scrollLeft+e.doc.scrollLeft,i=t.gutters.offsetWidth,o=n+"px",l=0;l<r.length;l++)if(!r[l].hidden){e.options.fixedGutter&&(r[l].gutter&&(r[l].gutter.style.left=o),r[l].gutterBackground&&(r[l].gutterBackground.style.left=o))
var s=r[l].alignable
if(s)for(var a=0;a<s.length;a++)s[a].style.left=o}e.options.fixedGutter&&(t.gutters.style.left=n+i+"px")}}function C(e){if(!e.options.lineNumbers)return!1
var t=e.doc,r=S(e.options,t.first+t.size-1),n=e.display
if(r.length!=n.lineNumChars){var i=n.measure.appendChild(Ki("div",[Ki("div",r)],"CodeMirror-linenumber CodeMirror-gutter-elt")),o=i.firstChild.offsetWidth,l=i.offsetWidth-o
return n.lineGutter.style.width="",n.lineNumInnerWidth=Math.max(o,n.lineGutter.offsetWidth-l)+1,n.lineNumWidth=n.lineNumInnerWidth+l,n.lineNumChars=n.lineNumInnerWidth?r.length:-1,n.lineGutter.style.width=n.lineNumWidth+"px",u(e),!0}return!1}function S(e,t){return String(e.lineNumberFormatter(t+e.firstLineNumber))}function L(e){return e.scroller.getBoundingClientRect().left-e.sizer.getBoundingClientRect().left}function M(e,t,r){var n=e.display
this.viewport=t,this.visible=w(n,e.doc,t),this.editorIsHidden=!n.wrapper.offsetWidth,this.wrapperHeight=n.wrapper.clientHeight,this.wrapperWidth=n.wrapper.clientWidth,this.oldDisplayWidth=Ye(e),this.force=r,this.dims=H(e),this.events=[]}function k(e){var t=e.display
!t.scrollbarsClipped&&t.scroller.offsetWidth&&(t.nativeBarWidth=t.scroller.offsetWidth-t.scroller.clientWidth,t.heightForcer.style.height=Xe(e)+"px",t.sizer.style.marginBottom=-t.nativeBarWidth+"px",t.sizer.style.borderRightWidth=Xe(e)+"px",t.scrollbarsClipped=!0)}function T(e,t){var r=e.display,n=e.doc
if(t.editorIsHidden)return Rt(e),!1
if(!t.force&&t.visible.from>=r.viewFrom&&t.visible.to<=r.viewTo&&(null==r.updateLineNumbers||r.updateLineNumbers>=r.viewTo)&&r.renderedView==r.view&&0==Gt(e))return!1
C(e)&&(Rt(e),t.dims=H(e))
var i=n.first+n.size,o=Math.max(t.visible.from-e.options.viewportMargin,n.first),l=Math.min(i,t.visible.to+e.options.viewportMargin)
r.viewFrom<o&&o-r.viewFrom<20&&(o=Math.max(n.first,r.viewFrom)),r.viewTo>l&&r.viewTo-l<20&&(l=Math.min(i,r.viewTo)),Fo&&(o=xn(e.doc,o),l=Cn(e.doc,l))
var s=o!=r.viewFrom||l!=r.viewTo||r.lastWrapHeight!=t.wrapperHeight||r.lastWrapWidth!=t.wrapperWidth
Ut(e,o,l),r.viewOffset=ii(Jn(e.doc,r.viewFrom)),e.display.mover.style.top=r.viewOffset+"px"
var a=Gt(e)
if(!s&&0==a&&!t.force&&r.renderedView==r.view&&(null==r.updateLineNumbers||r.updateLineNumbers>=r.viewTo))return!1
var c=Yi()
return a>4&&(r.lineDiv.style.display="none"),z(e,r.updateLineNumbers,t.dims),a>4&&(r.lineDiv.style.display=""),r.renderedView=r.view,c&&Yi()!=c&&c.offsetHeight&&c.focus(),ji(r.cursorDiv),ji(r.selectionDiv),r.gutters.style.height=r.sizer.style.minHeight=0,s&&(r.lastWrapHeight=t.wrapperHeight,r.lastWrapWidth=t.wrapperWidth,Fe(e,400)),r.updateLineNumbers=null,!0}function N(e,t){for(var r=t.viewport,n=!0;(n&&e.options.lineWrapping&&t.oldDisplayWidth!=Ye(e)||(r&&null!=r.top&&(r={top:Math.min(e.doc.height+Ke(e.display)-_e(e),r.top)}),t.visible=w(e.display,e.doc,r),!(t.visible.from>=e.display.viewFrom&&t.visible.to<=e.display.viewTo)))&&T(e,t);n=!1){W(e)
var i=p(e)
ze(e),y(e,i),O(e,i)}t.signal(e,"update",e),e.display.viewFrom==e.display.reportedViewFrom&&e.display.viewTo==e.display.reportedViewTo||(t.signal(e,"viewportChange",e,e.display.viewFrom,e.display.viewTo),e.display.reportedViewFrom=e.display.viewFrom,e.display.reportedViewTo=e.display.viewTo)}function A(e,t){var r=new M(e,t)
if(T(e,r)){W(e),N(e,r)
var n=p(e)
ze(e),y(e,n),O(e,n),r.finish()}}function O(e,t){e.display.sizer.style.minHeight=t.docHeight+"px",e.display.heightForcer.style.top=t.docHeight+"px",e.display.gutters.style.height=t.docHeight+e.display.barHeight+Xe(e)+"px"}function W(e){for(var t=e.display,r=t.lineDiv.offsetTop,n=0;n<t.view.length;n++){var i,o=t.view[n]
if(!o.hidden){if(xo&&Co<8){var l=o.node.offsetTop+o.node.offsetHeight
i=l-r,r=l}else{var s=o.node.getBoundingClientRect()
i=s.bottom-s.top}var a=o.line.height-i
if(i<2&&(i=bt(t)),(a>.001||a<-.001)&&(ti(o.line,i),D(o.line),o.rest))for(var c=0;c<o.rest.length;c++)D(o.rest[c])}}}function D(e){if(e.widgets)for(var t=0;t<e.widgets.length;++t)e.widgets[t].height=e.widgets[t].node.parentNode.offsetHeight}function H(e){for(var t=e.display,r={},n={},i=t.gutters.clientLeft,o=t.gutters.firstChild,l=0;o;o=o.nextSibling,++l)r[e.options.gutters[l]]=o.offsetLeft+o.clientLeft+i,n[e.options.gutters[l]]=o.clientWidth
return{fixedPos:L(t),gutterTotalWidth:t.gutters.offsetWidth,gutterLeft:r,gutterWidth:n,wrapperWidth:t.wrapper.clientWidth}}function z(e,t,r){function n(t){var r=t.nextSibling
return So&&Do&&e.display.currentWheelTarget==t?t.style.display="none":t.parentNode.removeChild(t),r}for(var i=e.display,o=e.options.lineNumbers,l=i.lineDiv,s=l.firstChild,a=i.view,c=i.viewFrom,u=0;u<a.length;u++){var f=a[u]
if(f.hidden);else if(f.node&&f.node.parentNode==l){for(;s!=f.node;)s=n(s)
var h=o&&null!=t&&t<=c&&f.lineNumber
f.changes&&(zi(f.changes,"gutter")>-1&&(h=!1),E(e,f,c,r)),h&&(ji(f.lineNumber),f.lineNumber.appendChild(document.createTextNode(S(e.options,c)))),s=f.node.nextSibling}else{var d=V(e,f,c,r)
l.insertBefore(d,s)}c+=f.size}for(;s;)s=n(s)}function E(e,t,r,n){for(var i=0;i<t.changes.length;i++){var o=t.changes[i]
"text"==o?F(e,t):"gutter"==o?U(e,t,r,n):"class"==o?B(t):"widget"==o&&G(e,t,n)}t.changes=null}function P(e){return e.node==e.text&&(e.node=Ki("div",null,null,"position: relative"),e.text.parentNode&&e.text.parentNode.replaceChild(e.node,e.text),e.node.appendChild(e.text),xo&&Co<8&&(e.node.style.zIndex=2)),e.node}function I(e){var t=e.bgClass?e.bgClass+" "+(e.line.bgClass||""):e.line.bgClass
if(t&&(t+=" CodeMirror-linebackground"),e.background)t?e.background.className=t:(e.background.parentNode.removeChild(e.background),e.background=null)
else if(t){var r=P(e)
e.background=r.insertBefore(Ki("div",null,t),r.firstChild)}}function R(e,t){var r=e.display.externalMeasured
return r&&r.line==t.line?(e.display.externalMeasured=null,t.measure=r.measure,r.built):Fn(e,t)}function F(e,t){var r=t.text.className,n=R(e,t)
t.text==t.node&&(t.node=n.pre),t.text.parentNode.replaceChild(n.pre,t.text),t.text=n.pre,n.bgClass!=t.bgClass||n.textClass!=t.textClass?(t.bgClass=n.bgClass,t.textClass=n.textClass,B(t)):r&&(t.text.className=r)}function B(e){I(e),e.line.wrapClass?P(e).className=e.line.wrapClass:e.node!=e.text&&(e.node.className="")
var t=e.textClass?e.textClass+" "+(e.line.textClass||""):e.line.textClass
e.text.className=t||""}function U(e,t,r,n){if(t.gutter&&(t.node.removeChild(t.gutter),t.gutter=null),t.gutterBackground&&(t.node.removeChild(t.gutterBackground),t.gutterBackground=null),t.line.gutterClass){var i=P(t)
t.gutterBackground=Ki("div",null,"CodeMirror-gutter-background "+t.line.gutterClass,"left: "+(e.options.fixedGutter?n.fixedPos:-n.gutterTotalWidth)+"px; width: "+n.gutterTotalWidth+"px"),i.insertBefore(t.gutterBackground,t.text)}var o=t.line.gutterMarkers
if(e.options.lineNumbers||o){var i=P(t),l=t.gutter=Ki("div",null,"CodeMirror-gutter-wrapper","left: "+(e.options.fixedGutter?n.fixedPos:-n.gutterTotalWidth)+"px")
if(e.display.input.setUneditable(l),i.insertBefore(l,t.text),t.line.gutterClass&&(l.className+=" "+t.line.gutterClass),!e.options.lineNumbers||o&&o["CodeMirror-linenumbers"]||(t.lineNumber=l.appendChild(Ki("div",S(e.options,r),"CodeMirror-linenumber CodeMirror-gutter-elt","left: "+n.gutterLeft["CodeMirror-linenumbers"]+"px; width: "+e.display.lineNumInnerWidth+"px"))),o)for(var s=0;s<e.options.gutters.length;++s){var a=e.options.gutters[s],c=o.hasOwnProperty(a)&&o[a]
c&&l.appendChild(Ki("div",[c],"CodeMirror-gutter-elt","left: "+n.gutterLeft[a]+"px; width: "+n.gutterWidth[a]+"px"))}}}function G(e,t,r){t.alignable&&(t.alignable=null)
for(var n,i=t.node.firstChild;i;i=n){var n=i.nextSibling
"CodeMirror-linewidget"==i.className&&t.node.removeChild(i)}K(e,t,r)}function V(e,t,r,n){var i=R(e,t)
return t.text=t.node=i.pre,i.bgClass&&(t.bgClass=i.bgClass),i.textClass&&(t.textClass=i.textClass),B(t),U(e,t,r,n),K(e,t,n),t.node}function K(e,t,r){if(j(e,t.line,t,r,!0),t.rest)for(var n=0;n<t.rest.length;n++)j(e,t.rest[n],t,r,!1)}function j(e,t,r,n,i){if(t.widgets)for(var o=P(r),l=0,s=t.widgets;l<s.length;++l){var a=s[l],c=Ki("div",[a.node],"CodeMirror-linewidget")
a.handleMouseEvents||c.setAttribute("cm-ignore-events","true"),X(a,c,r,n),e.display.input.setUneditable(c),i&&a.above?o.insertBefore(c,r.gutter||r.text):o.appendChild(c),Mi(a,"redraw")}}function X(e,t,r,n){if(e.noHScroll){(r.alignable||(r.alignable=[])).push(t)
var i=n.wrapperWidth
t.style.left=n.fixedPos+"px",e.coverGutter||(i-=n.gutterTotalWidth,t.style.paddingLeft=n.gutterTotalWidth+"px"),t.style.width=i+"px"}e.coverGutter&&(t.style.zIndex=5,t.style.position="relative",e.noHScroll||(t.style.marginLeft=-n.gutterTotalWidth+"px"))}function Y(e){return Bo(e.line,e.ch)}function _(e,t){return Uo(e,t)<0?t:e}function q(e,t){return Uo(e,t)<0?e:t}function $(e){e.state.focused||(e.display.input.focus(),mr(e))}function Z(e,t,r,n,i){var o=e.doc
e.display.shift=!1,n||(n=o.sel)
var l=e.state.pasteIncoming||"paste"==i,s=o.splitLines(t),a=null
if(l&&n.ranges.length>1)if(Go&&Go.text.join("\n")==t){if(n.ranges.length%Go.text.length==0){a=[]
for(var c=0;c<Go.text.length;c++)a.push(o.splitLines(Go.text[c]))}}else s.length==n.ranges.length&&(a=Ei(s,function(e){return[e]}))
for(var c=n.ranges.length-1;c>=0;c--){var u=n.ranges[c],f=u.from(),h=u.to()
u.empty()&&(r&&r>0?f=Bo(f.line,f.ch-r):e.state.overwrite&&!l?h=Bo(h.line,Math.min(Jn(o,h.line).text.length,h.ch+Hi(s).length)):Go&&Go.lineWise&&Go.text.join("\n")==t&&(f=h=Bo(f.line,0)))
var d=e.curOp.updateInput,p={from:f,to:h,text:a?a[c%a.length]:s,origin:i||(l?"paste":e.state.cutIncoming?"cut":"+input")}
kr(e.doc,p),Mi(e,"inputRead",e,p)}t&&!l&&Q(e,t),Rr(e),e.curOp.updateInput=d,e.curOp.typing=!0,e.state.pasteIncoming=e.state.cutIncoming=!1}function J(e,t){var r=e.clipboardData&&e.clipboardData.getData("Text")
if(r)return e.preventDefault(),t.isReadOnly()||t.options.disableInput||Ot(t,function(){Z(t,r,0,null,"paste")}),!0}function Q(e,t){if(e.options.electricChars&&e.options.smartIndent)for(var r=e.doc.sel,n=r.ranges.length-1;n>=0;n--){var i=r.ranges[n]
if(!(i.head.ch>100||n&&r.ranges[n-1].head.line==i.head.line)){var o=e.getModeAt(i.head),l=!1
if(o.electricChars){for(var s=0;s<o.electricChars.length;s++)if(t.indexOf(o.electricChars.charAt(s))>-1){l=Br(e,i.head.line,"smart")
break}}else o.electricInput&&o.electricInput.test(Jn(e.doc,i.head.line).text.slice(0,i.head.ch))&&(l=Br(e,i.head.line,"smart"))
l&&Mi(e,"electricInput",e,i.head.line)}}}function ee(e){for(var t=[],r=[],n=0;n<e.doc.sel.ranges.length;n++){var i=e.doc.sel.ranges[n].head.line,o={anchor:Bo(i,0),head:Bo(i+1,0)}
r.push(o),t.push(e.getRange(o.anchor,o.head))}return{text:t,ranges:r}}function te(e,t){e.setAttribute("autocorrect","off"),e.setAttribute("autocapitalize","off"),e.setAttribute("spellcheck",!!t)}function re(e){this.cm=e,this.prevInput="",this.pollingFast=!1,this.polling=new Wi,this.inaccurateSelection=!1,this.hasSelection=!1,this.composing=null}function ne(){var e=Ki("textarea",null,null,"position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none"),t=Ki("div",[e],null,"overflow: hidden; position: relative; width: 3px; height: 0px;")
return So?e.style.width="1000px":e.setAttribute("wrap","off"),Oo&&(e.style.border="1px solid black"),te(e),t}function ie(e){this.cm=e,this.lastAnchorNode=this.lastAnchorOffset=this.lastFocusNode=this.lastFocusOffset=null,this.polling=new Wi,this.gracePeriod=!1}function oe(e,t){var r=Qe(e,t.line)
if(!r||r.hidden)return null
var n=Jn(e.doc,t.line),i=$e(r,n,t.line),o=oi(n),l="left"
if(o){var s=fo(o,t.ch)
l=s%2?"right":"left"}var a=rt(i.map,t.ch,l)
return a.offset="right"==a.collapse?a.end:a.start,a}function le(e,t){return t&&(e.bad=!0),e}function se(e,t,r){var n
if(t==e.display.lineDiv){if(n=e.display.lineDiv.childNodes[r],!n)return le(e.clipPos(Bo(e.display.viewTo-1)),!0)
t=null,r=0}else for(n=t;;n=n.parentNode){if(!n||n==e.display.lineDiv)return null
if(n.parentNode&&n.parentNode==e.display.lineDiv)break}for(var i=0;i<e.display.view.length;i++){var o=e.display.view[i]
if(o.node==n)return ae(o,t,r)}}function ae(e,t,r){function n(t,r,n){for(var i=-1;i<(u?u.length:0);i++)for(var o=i<0?c.map:u[i],l=0;l<o.length;l+=3){var s=o[l+2]
if(s==t||s==r){var a=ri(i<0?e.line:e.rest[i]),f=o[l]+n
return(n<0||s!=t)&&(f=o[l+(n?1:0)]),Bo(a,f)}}}var i=e.text.firstChild,o=!1
if(!t||!$l(i,t))return le(Bo(ri(e.line),0),!0)
if(t==i&&(o=!0,t=i.childNodes[r],r=0,!t)){var l=e.rest?Hi(e.rest):e.line
return le(Bo(ri(l),l.text.length),o)}var s=3==t.nodeType?t:null,a=t
for(s||1!=t.childNodes.length||3!=t.firstChild.nodeType||(s=t.firstChild,r&&(r=s.nodeValue.length));a.parentNode!=i;)a=a.parentNode
var c=e.measure,u=c.maps,f=n(s,a,r)
if(f)return le(f,o)
for(var h=a.nextSibling,d=s?s.nodeValue.length-r:0;h;h=h.nextSibling){if(f=n(h,h.firstChild,0))return le(Bo(f.line,f.ch-d),o)
d+=h.textContent.length}for(var p=a.previousSibling,d=r;p;p=p.previousSibling){if(f=n(p,p.firstChild,-1))return le(Bo(f.line,f.ch+d),o)
d+=p.textContent.length}}function ce(e,t,r,n,i){function o(e){return function(t){return t.id==e}}function l(t){if(1==t.nodeType){var r=t.getAttribute("cm-text")
if(null!=r)return""==r&&(r=t.textContent.replace(/\u200b/g,"")),void(s+=r)
var u,f=t.getAttribute("cm-marker")
if(f){var h=e.findMarks(Bo(n,0),Bo(i+1,0),o(+f))
return void(h.length&&(u=h[0].find())&&(s+=Qn(e.doc,u.from,u.to).join(c)))}if("false"==t.getAttribute("contenteditable"))return
for(var d=0;d<t.childNodes.length;d++)l(t.childNodes[d]);/^(pre|div|p)$/i.test(t.nodeName)&&(a=!0)}else if(3==t.nodeType){var p=t.nodeValue
if(!p)return
a&&(s+=c,a=!1),s+=p}}for(var s="",a=!1,c=e.doc.lineSeparator();l(t),t!=r;)t=t.nextSibling
return s}function ue(e,t){this.ranges=e,this.primIndex=t}function fe(e,t){this.anchor=e,this.head=t}function he(e,t){var r=e[t]
e.sort(function(e,t){return Uo(e.from(),t.from())}),t=zi(e,r)
for(var n=1;n<e.length;n++){var i=e[n],o=e[n-1]
if(Uo(o.to(),i.from())>=0){var l=q(o.from(),i.from()),s=_(o.to(),i.to()),a=o.empty()?i.from()==i.head:o.from()==o.head
n<=t&&--t,e.splice(--n,2,new fe(a?s:l,a?l:s))}}return new ue(e,t)}function de(e,t){return new ue([new fe(e,t||e)],0)}function pe(e,t){return Math.max(e.first,Math.min(t,e.first+e.size-1))}function ge(e,t){if(t.line<e.first)return Bo(e.first,0)
var r=e.first+e.size-1
return t.line>r?Bo(r,Jn(e,r).text.length):ve(t,Jn(e,t.line).text.length)}function ve(e,t){var r=e.ch
return null==r||r>t?Bo(e.line,t):r<0?Bo(e.line,0):e}function me(e,t){return t>=e.first&&t<e.first+e.size}function ye(e,t){for(var r=[],n=0;n<t.length;n++)r[n]=ge(e,t[n])
return r}function be(e,t,r,n){if(e.cm&&e.cm.display.shift||e.extend){var i=t.anchor
if(n){var o=Uo(r,i)<0
o!=Uo(n,i)<0?(i=r,r=n):o!=Uo(r,n)<0&&(r=n)}return new fe(i,r)}return new fe(n||r,r)}function we(e,t,r,n){ke(e,new ue([be(e,e.sel.primary(),t,r)],0),n)}function xe(e,t,r){for(var n=[],i=0;i<e.sel.ranges.length;i++)n[i]=be(e,e.sel.ranges[i],t[i],null)
var o=he(n,e.sel.primIndex)
ke(e,o,r)}function Ce(e,t,r,n){var i=e.sel.ranges.slice(0)
i[t]=r,ke(e,he(i,e.sel.primIndex),n)}function Se(e,t,r,n){ke(e,de(t,r),n)}function Le(e,t,r){var n={ranges:t.ranges,update:function(t){this.ranges=[]
for(var r=0;r<t.length;r++)this.ranges[r]=new fe(ge(e,t[r].anchor),ge(e,t[r].head))},origin:r&&r.origin}
return El(e,"beforeSelectionChange",e,n),e.cm&&El(e.cm,"beforeSelectionChange",e.cm,n),n.ranges!=t.ranges?he(n.ranges,n.ranges.length-1):t}function Me(e,t,r){var n=e.history.done,i=Hi(n)
i&&i.ranges?(n[n.length-1]=t,Te(e,t,r)):ke(e,t,r)}function ke(e,t,r){Te(e,t,r),hi(e,e.sel,e.cm?e.cm.curOp.id:NaN,r)}function Te(e,t,r){(Ai(e,"beforeSelectionChange")||e.cm&&Ai(e.cm,"beforeSelectionChange"))&&(t=Le(e,t,r))
var n=r&&r.bias||(Uo(t.primary().head,e.sel.primary().head)<0?-1:1)
Ne(e,Oe(e,t,n,!0)),r&&r.scroll===!1||!e.cm||Rr(e.cm)}function Ne(e,t){t.equals(e.sel)||(e.sel=t,e.cm&&(e.cm.curOp.updateInput=e.cm.curOp.selectionChanged=!0,Ni(e.cm)),Mi(e,"cursorActivity",e))}function Ae(e){Ne(e,Oe(e,e.sel,null,!1),Fl)}function Oe(e,t,r,n){for(var i,o=0;o<t.ranges.length;o++){var l=t.ranges[o],s=t.ranges.length==e.sel.ranges.length&&e.sel.ranges[o],a=De(e,l.anchor,s&&s.anchor,r,n),c=De(e,l.head,s&&s.head,r,n);(i||a!=l.anchor||c!=l.head)&&(i||(i=t.ranges.slice(0,o)),i[o]=new fe(a,c))}return i?he(i,t.primIndex):t}function We(e,t,r,n,i){var o=Jn(e,t.line)
if(o.markedSpans)for(var l=0;l<o.markedSpans.length;++l){var s=o.markedSpans[l],a=s.marker
if((null==s.from||(a.inclusiveLeft?s.from<=t.ch:s.from<t.ch))&&(null==s.to||(a.inclusiveRight?s.to>=t.ch:s.to>t.ch))){if(i&&(El(a,"beforeCursorEnter"),a.explicitlyCleared)){if(o.markedSpans){--l
continue}break}if(!a.atomic)continue
if(r){var c,u=a.find(n<0?1:-1)
if((n<0?a.inclusiveRight:a.inclusiveLeft)&&(u=He(e,u,-n,u&&u.line==t.line?o:null)),u&&u.line==t.line&&(c=Uo(u,r))&&(n<0?c<0:c>0))return We(e,u,t,n,i)}var f=a.find(n<0?-1:1)
return(n<0?a.inclusiveLeft:a.inclusiveRight)&&(f=He(e,f,n,f.line==t.line?o:null)),f?We(e,f,t,n,i):null}}return t}function De(e,t,r,n,i){var o=n||1,l=We(e,t,r,o,i)||!i&&We(e,t,r,o,!0)||We(e,t,r,-o,i)||!i&&We(e,t,r,-o,!0)
return l?l:(e.cantEdit=!0,Bo(e.first,0))}function He(e,t,r,n){return r<0&&0==t.ch?t.line>e.first?ge(e,Bo(t.line-1)):null:r>0&&t.ch==(n||Jn(e,t.line)).text.length?t.line<e.first+e.size-1?Bo(t.line+1,0):null:new Bo(t.line,t.ch+r)}function ze(e){e.display.input.showSelection(e.display.input.prepareSelection())}function Ee(e,t){for(var r=e.doc,n={},i=n.cursors=document.createDocumentFragment(),o=n.selection=document.createDocumentFragment(),l=0;l<r.sel.ranges.length;l++)if(t!==!1||l!=r.sel.primIndex){var s=r.sel.ranges[l]
if(!(s.from().line>=e.display.viewTo||s.to().line<e.display.viewFrom)){var a=s.empty();(a||e.options.showCursorWhenSelecting)&&Pe(e,s.head,i),a||Ie(e,s,o)}}return n}function Pe(e,t,r){var n=pt(e,t,"div",null,null,!e.options.singleCursorHeightPerLine),i=r.appendChild(Ki("div"," ","CodeMirror-cursor"))
if(i.style.left=n.left+"px",i.style.top=n.top+"px",i.style.height=Math.max(0,n.bottom-n.top)*e.options.cursorHeight+"px",n.other){var o=r.appendChild(Ki("div"," ","CodeMirror-cursor CodeMirror-secondarycursor"))
o.style.display="",o.style.left=n.other.left+"px",o.style.top=n.other.top+"px",o.style.height=.85*(n.other.bottom-n.other.top)+"px"}}function Ie(e,t,r){function n(e,t,r,n){t<0&&(t=0),t=Math.round(t),n=Math.round(n),s.appendChild(Ki("div",null,"CodeMirror-selected","position: absolute; left: "+e+"px; top: "+t+"px; width: "+(null==r?u-e:r)+"px; height: "+(n-t)+"px"))}function i(t,r,i){function o(r,n){return dt(e,Bo(t,r),"div",f,n)}var s,a,f=Jn(l,t),h=f.text.length
return ro(oi(f),r||0,null==i?h:i,function(e,t,l){var f,d,p,g=o(e,"left")
if(e==t)f=g,d=p=g.left
else{if(f=o(t-1,"right"),"rtl"==l){var v=g
g=f,f=v}d=g.left,p=f.right}null==r&&0==e&&(d=c),f.top-g.top>3&&(n(d,g.top,null,g.bottom),d=c,g.bottom<f.top&&n(d,g.bottom,null,f.top)),null==i&&t==h&&(p=u),(!s||g.top<s.top||g.top==s.top&&g.left<s.left)&&(s=g),(!a||f.bottom>a.bottom||f.bottom==a.bottom&&f.right>a.right)&&(a=f),d<c+1&&(d=c),n(d,f.top,p-d,f.bottom)}),{start:s,end:a}}var o=e.display,l=e.doc,s=document.createDocumentFragment(),a=je(e.display),c=a.left,u=Math.max(o.sizerWidth,Ye(e)-o.sizer.offsetLeft)-a.right,f=t.from(),h=t.to()
if(f.line==h.line)i(f.line,f.ch,h.ch)
else{var d=Jn(l,f.line),p=Jn(l,h.line),g=bn(d)==bn(p),v=i(f.line,f.ch,g?d.text.length+1:null).end,m=i(h.line,g?0:null,h.ch).start
g&&(v.top<m.top-2?(n(v.right,v.top,null,v.bottom),n(c,m.top,m.left,m.bottom)):n(v.right,v.top,m.left-v.right,v.bottom)),v.bottom<m.top&&n(c,v.bottom,null,m.top)}r.appendChild(s)}function Re(e){if(e.state.focused){var t=e.display
clearInterval(t.blinker)
var r=!0
t.cursorDiv.style.visibility="",e.options.cursorBlinkRate>0?t.blinker=setInterval(function(){t.cursorDiv.style.visibility=(r=!r)?"":"hidden"},e.options.cursorBlinkRate):e.options.cursorBlinkRate<0&&(t.cursorDiv.style.visibility="hidden")}}function Fe(e,t){e.doc.mode.startState&&e.doc.frontier<e.display.viewTo&&e.state.highlight.set(t,Bi(Be,e))}function Be(e){var t=e.doc
if(t.frontier<t.first&&(t.frontier=t.first),!(t.frontier>=e.display.viewTo)){var r=+new Date+e.options.workTime,n=ul(t.mode,Ge(e,t.frontier)),i=[]
t.iter(t.frontier,Math.min(t.first+t.size,e.display.viewTo+500),function(o){if(t.frontier>=e.display.viewFrom){var l=o.styles,s=o.text.length>e.options.maxHighlightLength,a=En(e,o,s?ul(t.mode,n):n,!0)
o.styles=a.styles
var c=o.styleClasses,u=a.classes
u?o.styleClasses=u:c&&(o.styleClasses=null)
for(var f=!l||l.length!=o.styles.length||c!=u&&(!c||!u||c.bgClass!=u.bgClass||c.textClass!=u.textClass),h=0;!f&&h<l.length;++h)f=l[h]!=o.styles[h]
f&&i.push(t.frontier),o.stateAfter=s?n:ul(t.mode,n)}else o.text.length<=e.options.maxHighlightLength&&In(e,o.text,n),o.stateAfter=t.frontier%5==0?ul(t.mode,n):null
if(++t.frontier,+new Date>r)return Fe(e,e.options.workDelay),!0}),i.length&&Ot(e,function(){for(var t=0;t<i.length;t++)It(e,i[t],"text")})}}function Ue(e,t,r){for(var n,i,o=e.doc,l=r?-1:t-(e.doc.mode.innerMode?1e3:100),s=t;s>l;--s){if(s<=o.first)return o.first
var a=Jn(o,s-1)
if(a.stateAfter&&(!r||s<=o.frontier))return s
var c=Gl(a.text,null,e.options.tabSize);(null==i||n>c)&&(i=s-1,n=c)}return i}function Ge(e,t,r){var n=e.doc,i=e.display
if(!n.mode.startState)return!0
var o=Ue(e,t,r),l=o>n.first&&Jn(n,o-1).stateAfter
return l=l?ul(n.mode,l):fl(n.mode),n.iter(o,t,function(r){In(e,r.text,l)
var s=o==t-1||o%5==0||o>=i.viewFrom&&o<i.viewTo
r.stateAfter=s?ul(n.mode,l):null,++o}),r&&(n.frontier=o),l}function Ve(e){return e.lineSpace.offsetTop}function Ke(e){return e.mover.offsetHeight-e.lineSpace.offsetHeight}function je(e){if(e.cachedPaddingH)return e.cachedPaddingH
var t=Xi(e.measure,Ki("pre","x")),r=window.getComputedStyle?window.getComputedStyle(t):t.currentStyle,n={left:parseInt(r.paddingLeft),right:parseInt(r.paddingRight)}
return isNaN(n.left)||isNaN(n.right)||(e.cachedPaddingH=n),n}function Xe(e){return Il-e.display.nativeBarWidth}function Ye(e){return e.display.scroller.clientWidth-Xe(e)-e.display.barWidth}function _e(e){return e.display.scroller.clientHeight-Xe(e)-e.display.barHeight}function qe(e,t,r){var n=e.options.lineWrapping,i=n&&Ye(e)
if(!t.measure.heights||n&&t.measure.width!=i){var o=t.measure.heights=[]
if(n){t.measure.width=i
for(var l=t.text.firstChild.getClientRects(),s=0;s<l.length-1;s++){var a=l[s],c=l[s+1]
Math.abs(a.bottom-c.bottom)>2&&o.push((a.bottom+c.top)/2-r.top)}}o.push(r.bottom-r.top)}}function $e(e,t,r){if(e.line==t)return{map:e.measure.map,cache:e.measure.cache}
for(var n=0;n<e.rest.length;n++)if(e.rest[n]==t)return{map:e.measure.maps[n],cache:e.measure.caches[n]}
for(var n=0;n<e.rest.length;n++)if(ri(e.rest[n])>r)return{map:e.measure.maps[n],cache:e.measure.caches[n],before:!0}}function Ze(e,t){t=bn(t)
var r=ri(t),n=e.display.externalMeasured=new zt(e.doc,t,r)
n.lineN=r
var i=n.built=Fn(e,n)
return n.text=i.pre,Xi(e.display.lineMeasure,i.pre),n}function Je(e,t,r,n){return tt(e,et(e,t),r,n)}function Qe(e,t){if(t>=e.display.viewFrom&&t<e.display.viewTo)return e.display.view[Ft(e,t)]
var r=e.display.externalMeasured
return r&&t>=r.lineN&&t<r.lineN+r.size?r:void 0}function et(e,t){var r=ri(t),n=Qe(e,r)
n&&!n.text?n=null:n&&n.changes&&(E(e,n,r,H(e)),e.curOp.forceUpdate=!0),n||(n=Ze(e,t))
var i=$e(n,t,r)
return{line:t,view:n,rect:null,map:i.map,cache:i.cache,before:i.before,hasHeights:!1}}function tt(e,t,r,n,i){t.before&&(r=-1)
var o,l=r+(n||"")
return t.cache.hasOwnProperty(l)?o=t.cache[l]:(t.rect||(t.rect=t.view.text.getBoundingClientRect()),t.hasHeights||(qe(e,t.view,t.rect),t.hasHeights=!0),o=it(e,t,r,n),o.bogus||(t.cache[l]=o)),{left:o.left,right:o.right,top:i?o.rtop:o.top,bottom:i?o.rbottom:o.bottom}}function rt(e,t,r){for(var n,i,o,l,s=0;s<e.length;s+=3){var a=e[s],c=e[s+1]
if(t<a?(i=0,o=1,l="left"):t<c?(i=t-a,o=i+1):(s==e.length-3||t==c&&e[s+3]>t)&&(o=c-a,i=o-1,t>=c&&(l="right")),null!=i){if(n=e[s+2],a==c&&r==(n.insertLeft?"left":"right")&&(l=r),"left"==r&&0==i)for(;s&&e[s-2]==e[s-3]&&e[s-1].insertLeft;)n=e[(s-=3)+2],l="left"
if("right"==r&&i==c-a)for(;s<e.length-3&&e[s+3]==e[s+4]&&!e[s+5].insertLeft;)n=e[(s+=3)+2],l="right"
break}}return{node:n,start:i,end:o,collapse:l,coverStart:a,coverEnd:c}}function nt(e,t){var r=Xo
if("left"==t)for(var n=0;n<e.length&&(r=e[n]).left==r.right;n++);else for(var n=e.length-1;n>=0&&(r=e[n]).left==r.right;n--);return r}function it(e,t,r,n){var i,o=rt(t.map,r,n),l=o.node,s=o.start,a=o.end,c=o.collapse
if(3==l.nodeType){for(var u=0;u<4;u++){for(;s&&Vi(t.line.text.charAt(o.coverStart+s));)--s
for(;o.coverStart+a<o.coverEnd&&Vi(t.line.text.charAt(o.coverStart+a));)++a
if(i=xo&&Co<9&&0==s&&a==o.coverEnd-o.coverStart?l.parentNode.getBoundingClientRect():nt(Xl(l,s,a).getClientRects(),n),i.left||i.right||0==s)break
a=s,s-=1,c="right"}xo&&Co<11&&(i=ot(e.display.measure,i))}else{s>0&&(c=n="right")
var f
i=e.options.lineWrapping&&(f=l.getClientRects()).length>1?f["right"==n?f.length-1:0]:l.getBoundingClientRect()}if(xo&&Co<9&&!s&&(!i||!i.left&&!i.right)){var h=l.parentNode.getClientRects()[0]
i=h?{left:h.left,right:h.left+wt(e.display),top:h.top,bottom:h.bottom}:Xo}for(var d=i.top-t.rect.top,p=i.bottom-t.rect.top,g=(d+p)/2,v=t.view.measure.heights,u=0;u<v.length-1&&!(g<v[u]);u++);var m=u?v[u-1]:0,y=v[u],b={left:("right"==c?i.right:i.left)-t.rect.left,right:("left"==c?i.left:i.right)-t.rect.left,top:m,bottom:y}
return i.left||i.right||(b.bogus=!0),e.options.singleCursorHeightPerLine||(b.rtop=d,b.rbottom=p),b}function ot(e,t){if(!window.screen||null==screen.logicalXDPI||screen.logicalXDPI==screen.deviceXDPI||!to(e))return t
var r=screen.logicalXDPI/screen.deviceXDPI,n=screen.logicalYDPI/screen.deviceYDPI
return{left:t.left*r,right:t.right*r,top:t.top*n,bottom:t.bottom*n}}function lt(e){if(e.measure&&(e.measure.cache={},e.measure.heights=null,e.rest))for(var t=0;t<e.rest.length;t++)e.measure.caches[t]={}}function st(e){e.display.externalMeasure=null,ji(e.display.lineMeasure)
for(var t=0;t<e.display.view.length;t++)lt(e.display.view[t])}function at(e){st(e),e.display.cachedCharWidth=e.display.cachedTextHeight=e.display.cachedPaddingH=null,e.options.lineWrapping||(e.display.maxLineChanged=!0),e.display.lineNumChars=null}function ct(){return window.pageXOffset||(document.documentElement||document.body).scrollLeft}function ut(){return window.pageYOffset||(document.documentElement||document.body).scrollTop}function ft(e,t,r,n){if(t.widgets)for(var i=0;i<t.widgets.length;++i)if(t.widgets[i].above){var o=kn(t.widgets[i])
r.top+=o,r.bottom+=o}if("line"==n)return r
n||(n="local")
var l=ii(t)
if("local"==n?l+=Ve(e.display):l-=e.display.viewOffset,"page"==n||"window"==n){var s=e.display.lineSpace.getBoundingClientRect()
l+=s.top+("window"==n?0:ut())
var a=s.left+("window"==n?0:ct())
r.left+=a,r.right+=a}return r.top+=l,r.bottom+=l,r}function ht(e,t,r){if("div"==r)return t
var n=t.left,i=t.top
if("page"==r)n-=ct(),i-=ut()
else if("local"==r||!r){var o=e.display.sizer.getBoundingClientRect()
n+=o.left,i+=o.top}var l=e.display.lineSpace.getBoundingClientRect()
return{left:n-l.left,top:i-l.top}}function dt(e,t,r,n,i){return n||(n=Jn(e.doc,t.line)),ft(e,n,Je(e,n,t.ch,i),r)}function pt(e,t,r,n,i,o){function l(t,l){var s=tt(e,i,t,l?"right":"left",o)
return l?s.left=s.right:s.right=s.left,ft(e,n,s,r)}function s(e,t){var r=a[t],n=r.level%2
return e==no(r)&&t&&r.level<a[t-1].level?(r=a[--t],e=io(r)-(r.level%2?0:1),n=!0):e==io(r)&&t<a.length-1&&r.level<a[t+1].level&&(r=a[++t],e=no(r)-r.level%2,n=!1),n&&e==r.to&&e>r.from?l(e-1):l(e,n)}n=n||Jn(e.doc,t.line),i||(i=et(e,n))
var a=oi(n),c=t.ch
if(!a)return l(c)
var u=fo(a,c),f=s(c,u)
return null!=as&&(f.other=s(c,as)),f}function gt(e,t){var r=0,t=ge(e.doc,t)
e.options.lineWrapping||(r=wt(e.display)*t.ch)
var n=Jn(e.doc,t.line),i=ii(n)+Ve(e.display)
return{left:r,right:r,top:i,bottom:i+n.height}}function vt(e,t,r,n){var i=Bo(e,t)
return i.xRel=n,r&&(i.outside=!0),i}function mt(e,t,r){var n=e.doc
if(r+=e.display.viewOffset,r<0)return vt(n.first,0,!0,-1)
var i=ni(n,r),o=n.first+n.size-1
if(i>o)return vt(n.first+n.size-1,Jn(n,o).text.length,!0,1)
t<0&&(t=0)
for(var l=Jn(n,i);;){var s=yt(e,l,i,t,r),a=mn(l),c=a&&a.find(0,!0)
if(!a||!(s.ch>c.from.ch||s.ch==c.from.ch&&s.xRel>0))return s
i=ri(l=c.to.line)}}function yt(e,t,r,n,i){function o(n){var i=pt(e,Bo(r,n),"line",t,c)
return s=!0,l>i.bottom?i.left-a:l<i.top?i.left+a:(s=!1,i.left)}var l=i-ii(t),s=!1,a=2*e.display.wrapper.clientWidth,c=et(e,t),u=oi(t),f=t.text.length,h=oo(t),d=lo(t),p=o(h),g=s,v=o(d),m=s
if(n>v)return vt(r,d,m,1)
for(;;){if(u?d==h||d==po(t,h,1):d-h<=1){var y=n<p||n-p<=v-n?h:d,b=y==h?g:m,w=n-(y==h?p:v)
if(m&&!u&&!/\s/.test(t.text.charAt(y))&&w>0&&y<t.text.length&&c.view.measure.heights.length>1){var x=tt(e,c,y,"right")
l<=x.bottom&&l>=x.top&&Math.abs(n-x.right)<w&&(b=!1,y++,w=n-x.right)}for(;Vi(t.text.charAt(y));)++y
var C=vt(r,y,b,w<-1?-1:w>1?1:0)
return C}var S=Math.ceil(f/2),L=h+S
if(u){L=h
for(var M=0;M<S;++M)L=po(t,L,1)}var k=o(L)
k>n?(d=L,v=k,(m=s)&&(v+=1e3),f=S):(h=L,p=k,g=s,f-=S)}}function bt(e){if(null!=e.cachedTextHeight)return e.cachedTextHeight
if(null==Vo){Vo=Ki("pre")
for(var t=0;t<49;++t)Vo.appendChild(document.createTextNode("x")),Vo.appendChild(Ki("br"))
Vo.appendChild(document.createTextNode("x"))}Xi(e.measure,Vo)
var r=Vo.offsetHeight/50
return r>3&&(e.cachedTextHeight=r),ji(e.measure),r||1}function wt(e){if(null!=e.cachedCharWidth)return e.cachedCharWidth
var t=Ki("span","xxxxxxxxxx"),r=Ki("pre",[t])
Xi(e.measure,r)
var n=t.getBoundingClientRect(),i=(n.right-n.left)/10
return i>2&&(e.cachedCharWidth=i),i||10}function xt(e){e.curOp={cm:e,viewChanged:!1,startHeight:e.doc.height,forceUpdate:!1,updateInput:null,typing:!1,changeObjs:null,cursorActivityHandlers:null,cursorActivityCalled:0,selectionChanged:!1,updateMaxLine:!1,scrollLeft:null,scrollTop:null,scrollToPos:null,focus:!1,id:++_o},Yo?Yo.ops.push(e.curOp):e.curOp.ownsGroup=Yo={ops:[e.curOp],delayedCallbacks:[]}}function Ct(e){var t=e.delayedCallbacks,r=0
do{for(;r<t.length;r++)t[r].call(null)
for(var n=0;n<e.ops.length;n++){var i=e.ops[n]
if(i.cursorActivityHandlers)for(;i.cursorActivityCalled<i.cursorActivityHandlers.length;)i.cursorActivityHandlers[i.cursorActivityCalled++].call(null,i.cm)}}while(r<t.length)}function St(e){var t=e.curOp,r=t.ownsGroup
if(r)try{Ct(r)}finally{Yo=null
for(var n=0;n<r.ops.length;n++)r.ops[n].cm.curOp=null
Lt(r)}}function Lt(e){for(var t=e.ops,r=0;r<t.length;r++)Mt(t[r])
for(var r=0;r<t.length;r++)kt(t[r])
for(var r=0;r<t.length;r++)Tt(t[r])
for(var r=0;r<t.length;r++)Nt(t[r])
for(var r=0;r<t.length;r++)At(t[r])}function Mt(e){var t=e.cm,r=t.display
k(t),e.updateMaxLine&&h(t),e.mustUpdate=e.viewChanged||e.forceUpdate||null!=e.scrollTop||e.scrollToPos&&(e.scrollToPos.from.line<r.viewFrom||e.scrollToPos.to.line>=r.viewTo)||r.maxLineChanged&&t.options.lineWrapping,e.update=e.mustUpdate&&new M(t,e.mustUpdate&&{top:e.scrollTop,ensure:e.scrollToPos},e.forceUpdate)}function kt(e){e.updatedDisplay=e.mustUpdate&&T(e.cm,e.update)}function Tt(e){var t=e.cm,r=t.display
e.updatedDisplay&&W(t),e.barMeasure=p(t),r.maxLineChanged&&!t.options.lineWrapping&&(e.adjustWidthTo=Je(t,r.maxLine,r.maxLine.text.length).left+3,t.display.sizerWidth=e.adjustWidthTo,e.barMeasure.scrollWidth=Math.max(r.scroller.clientWidth,r.sizer.offsetLeft+e.adjustWidthTo+Xe(t)+t.display.barWidth),e.maxScrollLeft=Math.max(0,r.sizer.offsetLeft+e.adjustWidthTo-Ye(t))),(e.updatedDisplay||e.selectionChanged)&&(e.preparedSelection=r.input.prepareSelection(e.focus))}function Nt(e){var t=e.cm
null!=e.adjustWidthTo&&(t.display.sizer.style.minWidth=e.adjustWidthTo+"px",e.maxScrollLeft<t.doc.scrollLeft&&or(t,Math.min(t.display.scroller.scrollLeft,e.maxScrollLeft),!0),t.display.maxLineChanged=!1)
var r=e.focus&&e.focus==Yi()&&(!document.hasFocus||document.hasFocus())
e.preparedSelection&&t.display.input.showSelection(e.preparedSelection,r),(e.updatedDisplay||e.startHeight!=t.doc.height)&&y(t,e.barMeasure),e.updatedDisplay&&O(t,e.barMeasure),e.selectionChanged&&Re(t),t.state.focused&&e.updateInput&&t.display.input.reset(e.typing),r&&$(e.cm)}function At(e){var t=e.cm,r=t.display,n=t.doc
if(e.updatedDisplay&&N(t,e.update),null==r.wheelStartX||null==e.scrollTop&&null==e.scrollLeft&&!e.scrollToPos||(r.wheelStartX=r.wheelStartY=null),null==e.scrollTop||r.scroller.scrollTop==e.scrollTop&&!e.forceScroll||(n.scrollTop=Math.max(0,Math.min(r.scroller.scrollHeight-r.scroller.clientHeight,e.scrollTop)),r.scrollbars.setScrollTop(n.scrollTop),r.scroller.scrollTop=n.scrollTop),null==e.scrollLeft||r.scroller.scrollLeft==e.scrollLeft&&!e.forceScroll||(n.scrollLeft=Math.max(0,Math.min(r.scroller.scrollWidth-r.scroller.clientWidth,e.scrollLeft)),r.scrollbars.setScrollLeft(n.scrollLeft),r.scroller.scrollLeft=n.scrollLeft,x(t)),e.scrollToPos){var i=zr(t,ge(n,e.scrollToPos.from),ge(n,e.scrollToPos.to),e.scrollToPos.margin)
e.scrollToPos.isCursor&&t.state.focused&&Hr(t,i)}var o=e.maybeHiddenMarkers,l=e.maybeUnhiddenMarkers
if(o)for(var s=0;s<o.length;++s)o[s].lines.length||El(o[s],"hide")
if(l)for(var s=0;s<l.length;++s)l[s].lines.length&&El(l[s],"unhide")
r.wrapper.offsetHeight&&(n.scrollTop=t.display.scroller.scrollTop),e.changeObjs&&El(t,"changes",t,e.changeObjs),e.update&&e.update.finish()}function Ot(e,t){if(e.curOp)return t()
xt(e)
try{return t()}finally{St(e)}}function Wt(e,t){return function(){if(e.curOp)return t.apply(e,arguments)
xt(e)
try{return t.apply(e,arguments)}finally{St(e)}}}function Dt(e){return function(){if(this.curOp)return e.apply(this,arguments)
xt(this)
try{return e.apply(this,arguments)}finally{St(this)}}}function Ht(e){return function(){var t=this.cm
if(!t||t.curOp)return e.apply(this,arguments)
xt(t)
try{return e.apply(this,arguments)}finally{St(t)}}}function zt(e,t,r){this.line=t,this.rest=wn(t),this.size=this.rest?ri(Hi(this.rest))-r+1:1,this.node=this.text=null,this.hidden=Sn(e,t)}function Et(e,t,r){for(var n,i=[],o=t;o<r;o=n){var l=new zt(e.doc,Jn(e.doc,o),o)
n=o+l.size,i.push(l)}return i}function Pt(e,t,r,n){null==t&&(t=e.doc.first),null==r&&(r=e.doc.first+e.doc.size),n||(n=0)
var i=e.display
if(n&&r<i.viewTo&&(null==i.updateLineNumbers||i.updateLineNumbers>t)&&(i.updateLineNumbers=t),e.curOp.viewChanged=!0,t>=i.viewTo)Fo&&xn(e.doc,t)<i.viewTo&&Rt(e)
else if(r<=i.viewFrom)Fo&&Cn(e.doc,r+n)>i.viewFrom?Rt(e):(i.viewFrom+=n,i.viewTo+=n)
else if(t<=i.viewFrom&&r>=i.viewTo)Rt(e)
else if(t<=i.viewFrom){var o=Bt(e,r,r+n,1)
o?(i.view=i.view.slice(o.index),i.viewFrom=o.lineN,i.viewTo+=n):Rt(e)}else if(r>=i.viewTo){var o=Bt(e,t,t,-1)
o?(i.view=i.view.slice(0,o.index),i.viewTo=o.lineN):Rt(e)}else{var l=Bt(e,t,t,-1),s=Bt(e,r,r+n,1)
l&&s?(i.view=i.view.slice(0,l.index).concat(Et(e,l.lineN,s.lineN)).concat(i.view.slice(s.index)),i.viewTo+=n):Rt(e)}var a=i.externalMeasured
a&&(r<a.lineN?a.lineN+=n:t<a.lineN+a.size&&(i.externalMeasured=null))}function It(e,t,r){e.curOp.viewChanged=!0
var n=e.display,i=e.display.externalMeasured
if(i&&t>=i.lineN&&t<i.lineN+i.size&&(n.externalMeasured=null),!(t<n.viewFrom||t>=n.viewTo)){var o=n.view[Ft(e,t)]
if(null!=o.node){var l=o.changes||(o.changes=[])
zi(l,r)==-1&&l.push(r)}}}function Rt(e){e.display.viewFrom=e.display.viewTo=e.doc.first,e.display.view=[],e.display.viewOffset=0}function Ft(e,t){if(t>=e.display.viewTo)return null
if(t-=e.display.viewFrom,t<0)return null
for(var r=e.display.view,n=0;n<r.length;n++)if(t-=r[n].size,t<0)return n}function Bt(e,t,r,n){var i,o=Ft(e,t),l=e.display.view
if(!Fo||r==e.doc.first+e.doc.size)return{index:o,lineN:r}
for(var s=0,a=e.display.viewFrom;s<o;s++)a+=l[s].size
if(a!=t){if(n>0){if(o==l.length-1)return null
i=a+l[o].size-t,o++}else i=a-t
t+=i,r+=i}for(;xn(e.doc,r)!=r;){if(o==(n<0?0:l.length-1))return null
r+=n*l[o-(n<0?1:0)].size,o+=n}return{index:o,lineN:r}}function Ut(e,t,r){var n=e.display,i=n.view
0==i.length||t>=n.viewTo||r<=n.viewFrom?(n.view=Et(e,t,r),n.viewFrom=t):(n.viewFrom>t?n.view=Et(e,t,n.viewFrom).concat(n.view):n.viewFrom<t&&(n.view=n.view.slice(Ft(e,t))),n.viewFrom=t,n.viewTo<r?n.view=n.view.concat(Et(e,n.viewTo,r)):n.viewTo>r&&(n.view=n.view.slice(0,Ft(e,r)))),n.viewTo=r}function Gt(e){for(var t=e.display.view,r=0,n=0;n<t.length;n++){var i=t[n]
i.hidden||i.node&&!i.changes||++r}return r}function Vt(e){function t(){i.activeTouch&&(o=setTimeout(function(){i.activeTouch=null},1e3),l=i.activeTouch,l.end=+new Date)}function r(e){if(1!=e.touches.length)return!1
var t=e.touches[0]
return t.radiusX<=1&&t.radiusY<=1}function n(e,t){if(null==t.left)return!0
var r=t.left-e.left,n=t.top-e.top
return r*r+n*n>400}var i=e.display
Dl(i.scroller,"mousedown",Wt(e,_t)),xo&&Co<11?Dl(i.scroller,"dblclick",Wt(e,function(t){if(!Ti(e,t)){var r=Yt(e,t)
if(r&&!Qt(e,t)&&!Xt(e.display,t)){Al(t)
var n=e.findWordAt(r)
we(e.doc,n.anchor,n.head)}}})):Dl(i.scroller,"dblclick",function(t){Ti(e,t)||Al(t)}),Io||Dl(i.scroller,"contextmenu",function(t){br(e,t)})
var o,l={end:0}
Dl(i.scroller,"touchstart",function(t){if(!Ti(e,t)&&!r(t)){clearTimeout(o)
var n=+new Date
i.activeTouch={start:n,moved:!1,prev:n-l.end<=300?l:null},1==t.touches.length&&(i.activeTouch.left=t.touches[0].pageX,i.activeTouch.top=t.touches[0].pageY)}}),Dl(i.scroller,"touchmove",function(){i.activeTouch&&(i.activeTouch.moved=!0)}),Dl(i.scroller,"touchend",function(r){var o=i.activeTouch
if(o&&!Xt(i,r)&&null!=o.left&&!o.moved&&new Date-o.start<300){var l,s=e.coordsChar(i.activeTouch,"page")
l=!o.prev||n(o,o.prev)?new fe(s,s):!o.prev.prev||n(o,o.prev.prev)?e.findWordAt(s):new fe(Bo(s.line,0),ge(e.doc,Bo(s.line+1,0))),e.setSelection(l.anchor,l.head),e.focus(),Al(r)}t()}),Dl(i.scroller,"touchcancel",t),Dl(i.scroller,"scroll",function(){i.scroller.clientHeight&&(ir(e,i.scroller.scrollTop),or(e,i.scroller.scrollLeft,!0),El(e,"scroll",e))}),Dl(i.scroller,"mousewheel",function(t){lr(e,t)}),Dl(i.scroller,"DOMMouseScroll",function(t){lr(e,t)}),Dl(i.wrapper,"scroll",function(){i.wrapper.scrollTop=i.wrapper.scrollLeft=0}),i.dragFunctions={enter:function(t){Ti(e,t)||Wl(t)},over:function(t){Ti(e,t)||(rr(e,t),Wl(t))},start:function(t){tr(e,t)},drop:Wt(e,er),leave:function(t){Ti(e,t)||nr(e)}}
var s=i.input.getField()
Dl(s,"keyup",function(t){pr.call(e,t)}),Dl(s,"keydown",Wt(e,hr)),Dl(s,"keypress",Wt(e,gr)),Dl(s,"focus",function(t){mr(e,t)}),Dl(s,"blur",function(t){yr(e,t)})}function Kt(t,r,n){var i=n&&n!=e.Init
if(!r!=!i){var o=t.display.dragFunctions,l=r?Dl:zl
l(t.display.scroller,"dragstart",o.start),l(t.display.scroller,"dragenter",o.enter),l(t.display.scroller,"dragover",o.over),l(t.display.scroller,"dragleave",o.leave),l(t.display.scroller,"drop",o.drop)}}function jt(e){var t=e.display
t.lastWrapHeight==t.wrapper.clientHeight&&t.lastWrapWidth==t.wrapper.clientWidth||(t.cachedCharWidth=t.cachedTextHeight=t.cachedPaddingH=null,t.scrollbarsClipped=!1,e.setSize())}function Xt(e,t){for(var r=Ci(t);r!=e.wrapper;r=r.parentNode)if(!r||1==r.nodeType&&"true"==r.getAttribute("cm-ignore-events")||r.parentNode==e.sizer&&r!=e.mover)return!0}function Yt(e,t,r,n){var i=e.display
if(!r&&"true"==Ci(t).getAttribute("cm-not-content"))return null
var o,l,s=i.lineSpace.getBoundingClientRect()
try{o=t.clientX-s.left,l=t.clientY-s.top}catch(t){return null}var a,c=mt(e,o,l)
if(n&&1==c.xRel&&(a=Jn(e.doc,c.line).text).length==c.ch){var u=Gl(a,a.length,e.options.tabSize)-a.length
c=Bo(c.line,Math.max(0,Math.round((o-je(e.display).left)/wt(e.display))-u))}return c}function _t(e){var t=this,r=t.display
if(!(Ti(t,e)||r.activeTouch&&r.input.supportsTouch())){if(r.shift=e.shiftKey,Xt(r,e))return void(So||(r.scroller.draggable=!1,setTimeout(function(){r.scroller.draggable=!0},100)))
if(!Qt(t,e)){var n=Yt(t,e)
switch(window.focus(),Si(e)){case 1:t.state.selectingText?t.state.selectingText(e):n?qt(t,e,n):Ci(e)==r.scroller&&Al(e)
break
case 2:So&&(t.state.lastMiddleDown=+new Date),n&&we(t.doc,n),setTimeout(function(){r.input.focus()},20),Al(e)
break
case 3:Io?br(t,e):vr(t)}}}}function qt(e,t,r){xo?setTimeout(Bi($,e),0):e.curOp.focus=Yi()
var n,i=+new Date
jo&&jo.time>i-400&&0==Uo(jo.pos,r)?n="triple":Ko&&Ko.time>i-400&&0==Uo(Ko.pos,r)?(n="double",jo={time:i,pos:r}):(n="single",Ko={time:i,pos:r})
var o,l=e.doc.sel,s=Do?t.metaKey:t.ctrlKey
e.options.dragDrop&&rs&&!e.isReadOnly()&&"single"==n&&(o=l.contains(r))>-1&&(Uo((o=l.ranges[o]).from(),r)<0||r.xRel>0)&&(Uo(o.to(),r)>0||r.xRel<0)?$t(e,t,r,s):Zt(e,t,r,n,s)}function $t(e,t,r,n){var i=e.display,o=+new Date,l=Wt(e,function(s){So&&(i.scroller.draggable=!1),e.state.draggingText=!1,zl(document,"mouseup",l),zl(i.scroller,"drop",l),Math.abs(t.clientX-s.clientX)+Math.abs(t.clientY-s.clientY)<10&&(Al(s),!n&&+new Date-200<o&&we(e.doc,r),So||xo&&9==Co?setTimeout(function(){document.body.focus(),i.input.focus()},20):i.input.focus())})
So&&(i.scroller.draggable=!0),e.state.draggingText=l,l.copy=Do?t.altKey:t.ctrlKey,i.scroller.dragDrop&&i.scroller.dragDrop(),Dl(document,"mouseup",l),Dl(i.scroller,"drop",l)}function Zt(e,t,r,n,i){function o(t){if(0!=Uo(v,t))if(v=t,"rect"==n){for(var i=[],o=e.options.tabSize,l=Gl(Jn(c,r.line).text,r.ch,o),s=Gl(Jn(c,t.line).text,t.ch,o),a=Math.min(l,s),d=Math.max(l,s),p=Math.min(r.line,t.line),g=Math.min(e.lastLine(),Math.max(r.line,t.line));p<=g;p++){var m=Jn(c,p).text,y=Vl(m,a,o)
a==d?i.push(new fe(Bo(p,y),Bo(p,y))):m.length>y&&i.push(new fe(Bo(p,y),Bo(p,Vl(m,d,o))))}i.length||i.push(new fe(r,r)),ke(c,he(h.ranges.slice(0,f).concat(i),f),{origin:"*mouse",scroll:!1}),e.scrollIntoView(t)}else{var b=u,w=b.anchor,x=t
if("single"!=n){if("double"==n)var C=e.findWordAt(t)
else var C=new fe(Bo(t.line,0),ge(c,Bo(t.line+1,0)))
Uo(C.anchor,w)>0?(x=C.head,w=q(b.from(),C.anchor)):(x=C.anchor,w=_(b.to(),C.head))}var i=h.ranges.slice(0)
i[f]=new fe(ge(c,w),x),ke(c,he(i,f),Bl)}}function l(t){var r=++y,i=Yt(e,t,!0,"rect"==n)
if(i)if(0!=Uo(i,v)){e.curOp.focus=Yi(),o(i)
var s=w(a,c);(i.line>=s.to||i.line<s.from)&&setTimeout(Wt(e,function(){y==r&&l(t)}),150)}else{var u=t.clientY<m.top?-20:t.clientY>m.bottom?20:0
u&&setTimeout(Wt(e,function(){y==r&&(a.scroller.scrollTop+=u,l(t))}),50)}}function s(t){e.state.selectingText=!1,y=1/0,Al(t),a.input.focus(),zl(document,"mousemove",b),zl(document,"mouseup",x),c.history.lastSelOrigin=null}var a=e.display,c=e.doc
Al(t)
var u,f,h=c.sel,d=h.ranges
if(i&&!t.shiftKey?(f=c.sel.contains(r),u=f>-1?d[f]:new fe(r,r)):(u=c.sel.primary(),f=c.sel.primIndex),Ho?t.shiftKey&&t.metaKey:t.altKey)n="rect",i||(u=new fe(r,r)),r=Yt(e,t,!0,!0),f=-1
else if("double"==n){var p=e.findWordAt(r)
u=e.display.shift||c.extend?be(c,u,p.anchor,p.head):p}else if("triple"==n){var g=new fe(Bo(r.line,0),ge(c,Bo(r.line+1,0)))
u=e.display.shift||c.extend?be(c,u,g.anchor,g.head):g}else u=be(c,u,r)
i?f==-1?(f=d.length,ke(c,he(d.concat([u]),f),{scroll:!1,origin:"*mouse"})):d.length>1&&d[f].empty()&&"single"==n&&!t.shiftKey?(ke(c,he(d.slice(0,f).concat(d.slice(f+1)),0),{scroll:!1,origin:"*mouse"}),h=c.sel):Ce(c,f,u,Bl):(f=0,ke(c,new ue([u],0),Bl),h=c.sel)
var v=r,m=a.wrapper.getBoundingClientRect(),y=0,b=Wt(e,function(e){Si(e)?l(e):s(e)}),x=Wt(e,s)
e.state.selectingText=x,Dl(document,"mousemove",b),Dl(document,"mouseup",x)}function Jt(e,t,r,n){try{var i=t.clientX,o=t.clientY}catch(t){return!1}if(i>=Math.floor(e.display.gutters.getBoundingClientRect().right))return!1
n&&Al(t)
var l=e.display,s=l.lineDiv.getBoundingClientRect()
if(o>s.bottom||!Ai(e,r))return xi(t)
o-=s.top-l.viewOffset
for(var a=0;a<e.options.gutters.length;++a){var c=l.gutters.childNodes[a]
if(c&&c.getBoundingClientRect().right>=i){var u=ni(e.doc,o),f=e.options.gutters[a]
return El(e,r,e,u,f,t),xi(t)}}}function Qt(e,t){return Jt(e,t,"gutterClick",!0)}function er(e){var t=this
if(nr(t),!Ti(t,e)&&!Xt(t.display,e)){Al(e),xo&&(qo=+new Date)
var r=Yt(t,e,!0),n=e.dataTransfer.files
if(r&&!t.isReadOnly())if(n&&n.length&&window.FileReader&&window.File)for(var i=n.length,o=Array(i),l=0,s=function(e,n){if(!t.options.allowDropFileTypes||zi(t.options.allowDropFileTypes,e.type)!=-1){var s=new FileReader
s.onload=Wt(t,function(){var e=s.result
if(/[\x00-\x08\x0e-\x1f]{2}/.test(e)&&(e=""),o[n]=e,++l==i){r=ge(t.doc,r)
var a={from:r,to:r,text:t.doc.splitLines(o.join(t.doc.lineSeparator())),origin:"paste"}
kr(t.doc,a),Me(t.doc,de(r,tl(a)))}}),s.readAsText(e)}},a=0;a<i;++a)s(n[a],a)
else{if(t.state.draggingText&&t.doc.sel.contains(r)>-1)return t.state.draggingText(e),void setTimeout(function(){t.display.input.focus()},20)
try{var o=e.dataTransfer.getData("Text")
if(o){if(t.state.draggingText&&!t.state.draggingText.copy)var c=t.listSelections()
if(Te(t.doc,de(r,r)),c)for(var a=0;a<c.length;++a)Dr(t.doc,"",c[a].anchor,c[a].head,"drag")
t.replaceSelection(o,"around","paste"),t.display.input.focus()}}catch(e){}}}}function tr(e,t){if(xo&&(!e.state.draggingText||+new Date-qo<100))return void Wl(t)
if(!Ti(e,t)&&!Xt(e.display,t)&&(t.dataTransfer.setData("Text",e.getSelection()),t.dataTransfer.effectAllowed="copyMove",t.dataTransfer.setDragImage&&!To)){var r=Ki("img",null,null,"position: fixed; left: 0; top: 0;")
r.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",ko&&(r.width=r.height=1,e.display.wrapper.appendChild(r),r._top=r.offsetTop),t.dataTransfer.setDragImage(r,0,0),ko&&r.parentNode.removeChild(r)}}function rr(e,t){var r=Yt(e,t)
if(r){var n=document.createDocumentFragment()
Pe(e,r,n),e.display.dragCursor||(e.display.dragCursor=Ki("div",null,"CodeMirror-cursors CodeMirror-dragcursors"),e.display.lineSpace.insertBefore(e.display.dragCursor,e.display.cursorDiv)),Xi(e.display.dragCursor,n)}}function nr(e){e.display.dragCursor&&(e.display.lineSpace.removeChild(e.display.dragCursor),e.display.dragCursor=null)}function ir(e,t){Math.abs(e.doc.scrollTop-t)<2||(e.doc.scrollTop=t,yo||A(e,{top:t}),e.display.scroller.scrollTop!=t&&(e.display.scroller.scrollTop=t),e.display.scrollbars.setScrollTop(t),yo&&A(e),Fe(e,100))}function or(e,t,r){(r?t==e.doc.scrollLeft:Math.abs(e.doc.scrollLeft-t)<2)||(t=Math.min(t,e.display.scroller.scrollWidth-e.display.scroller.clientWidth),e.doc.scrollLeft=t,x(e),e.display.scroller.scrollLeft!=t&&(e.display.scroller.scrollLeft=t),e.display.scrollbars.setScrollLeft(t))}function lr(e,t){var r=Jo(t),n=r.x,i=r.y,o=e.display,l=o.scroller,s=l.scrollWidth>l.clientWidth,a=l.scrollHeight>l.clientHeight
if(n&&s||i&&a){if(i&&Do&&So)e:for(var c=t.target,u=o.view;c!=l;c=c.parentNode)for(var f=0;f<u.length;f++)if(u[f].node==c){e.display.currentWheelTarget=c
break e}if(n&&!yo&&!ko&&null!=Zo)return i&&a&&ir(e,Math.max(0,Math.min(l.scrollTop+i*Zo,l.scrollHeight-l.clientHeight))),or(e,Math.max(0,Math.min(l.scrollLeft+n*Zo,l.scrollWidth-l.clientWidth))),(!i||i&&a)&&Al(t),void(o.wheelStartX=null)
if(i&&null!=Zo){var h=i*Zo,d=e.doc.scrollTop,p=d+o.wrapper.clientHeight
h<0?d=Math.max(0,d+h-50):p=Math.min(e.doc.height,p+h+50),A(e,{top:d,bottom:p})}$o<20&&(null==o.wheelStartX?(o.wheelStartX=l.scrollLeft,o.wheelStartY=l.scrollTop,o.wheelDX=n,o.wheelDY=i,setTimeout(function(){if(null!=o.wheelStartX){var e=l.scrollLeft-o.wheelStartX,t=l.scrollTop-o.wheelStartY,r=t&&o.wheelDY&&t/o.wheelDY||e&&o.wheelDX&&e/o.wheelDX
o.wheelStartX=o.wheelStartY=null,r&&(Zo=(Zo*$o+r)/($o+1),++$o)}},200)):(o.wheelDX+=n,o.wheelDY+=i))}}function sr(e,t,r){if("string"==typeof t&&(t=hl[t],!t))return!1
e.display.input.ensurePolled()
var n=e.display.shift,i=!1
try{e.isReadOnly()&&(e.state.suppressEdits=!0),r&&(e.display.shift=!1),i=t(e)!=Rl}finally{e.display.shift=n,e.state.suppressEdits=!1}return i}function ar(e,t,r){for(var n=0;n<e.state.keyMaps.length;n++){var i=pl(t,e.state.keyMaps[n],r,e)
if(i)return i}return e.options.extraKeys&&pl(t,e.options.extraKeys,r,e)||pl(t,e.options.keyMap,r,e)}function cr(e,t,r,n){var i=e.state.keySeq
if(i){if(gl(t))return"handled"
Qo.set(50,function(){e.state.keySeq==i&&(e.state.keySeq=null,e.display.input.reset())}),t=i+" "+t}var o=ar(e,t,n)
return"multi"==o&&(e.state.keySeq=t),"handled"==o&&Mi(e,"keyHandled",e,t,r),"handled"!=o&&"multi"!=o||(Al(r),Re(e)),i&&!o&&/\'$/.test(t)?(Al(r),!0):!!o}function ur(e,t){var r=vl(t,!0)
return!!r&&(t.shiftKey&&!e.state.keySeq?cr(e,"Shift-"+r,t,function(t){return sr(e,t,!0)})||cr(e,r,t,function(t){if("string"==typeof t?/^go[A-Z]/.test(t):t.motion)return sr(e,t)}):cr(e,r,t,function(t){return sr(e,t)}))}function fr(e,t,r){return cr(e,"'"+r+"'",t,function(t){return sr(e,t,!0)})}function hr(e){var t=this
if(t.curOp.focus=Yi(),!Ti(t,e)){xo&&Co<11&&27==e.keyCode&&(e.returnValue=!1)
var r=e.keyCode
t.display.shift=16==r||e.shiftKey
var n=ur(t,e)
ko&&(el=n?r:null,!n&&88==r&&!os&&(Do?e.metaKey:e.ctrlKey)&&t.replaceSelection("",null,"cut")),18!=r||/\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className)||dr(t)}}function dr(e){function t(e){18!=e.keyCode&&e.altKey||(Ql(r,"CodeMirror-crosshair"),zl(document,"keyup",t),zl(document,"mouseover",t))}var r=e.display.lineDiv
es(r,"CodeMirror-crosshair"),Dl(document,"keyup",t),Dl(document,"mouseover",t)}function pr(e){16==e.keyCode&&(this.doc.sel.shift=!1),Ti(this,e)}function gr(e){var t=this
if(!(Xt(t.display,e)||Ti(t,e)||e.ctrlKey&&!e.altKey||Do&&e.metaKey)){var r=e.keyCode,n=e.charCode
if(ko&&r==el)return el=null,void Al(e)
if(!ko||e.which&&!(e.which<10)||!ur(t,e)){var i=String.fromCharCode(null==n?r:n)
fr(t,e,i)||t.display.input.onKeyPress(e)}}}function vr(e){e.state.delayingBlurEvent=!0,setTimeout(function(){e.state.delayingBlurEvent&&(e.state.delayingBlurEvent=!1,yr(e))},100)}function mr(e,t){e.state.delayingBlurEvent&&(e.state.delayingBlurEvent=!1),"nocursor"!=e.options.readOnly&&(e.state.focused||(El(e,"focus",e,t),e.state.focused=!0,es(e.display.wrapper,"CodeMirror-focused"),e.curOp||e.display.selForContextMenu==e.doc.sel||(e.display.input.reset(),So&&setTimeout(function(){e.display.input.reset(!0)},20)),e.display.input.receivedFocus()),Re(e))}function yr(e,t){e.state.delayingBlurEvent||(e.state.focused&&(El(e,"blur",e,t),e.state.focused=!1,Ql(e.display.wrapper,"CodeMirror-focused")),clearInterval(e.display.blinker),setTimeout(function(){e.state.focused||(e.display.shift=!1)},150))}function br(e,t){Xt(e.display,t)||wr(e,t)||Ti(e,t,"contextmenu")||e.display.input.onContextMenu(t)}function wr(e,t){return!!Ai(e,"gutterContextMenu")&&Jt(e,t,"gutterContextMenu",!1)}function xr(e,t){if(Uo(e,t.from)<0)return e
if(Uo(e,t.to)<=0)return tl(t)
var r=e.line+t.text.length-(t.to.line-t.from.line)-1,n=e.ch
return e.line==t.to.line&&(n+=tl(t).ch-t.to.ch),Bo(r,n)}function Cr(e,t){for(var r=[],n=0;n<e.sel.ranges.length;n++){var i=e.sel.ranges[n]
r.push(new fe(xr(i.anchor,t),xr(i.head,t)))}return he(r,e.sel.primIndex)}function Sr(e,t,r){return e.line==t.line?Bo(r.line,e.ch-t.ch+r.ch):Bo(r.line+(e.line-t.line),e.ch)}function Lr(e,t,r){for(var n=[],i=Bo(e.first,0),o=i,l=0;l<t.length;l++){var s=t[l],a=Sr(s.from,i,o),c=Sr(tl(s),i,o)
if(i=s.to,o=c,"around"==r){var u=e.sel.ranges[l],f=Uo(u.head,u.anchor)<0
n[l]=new fe(f?c:a,f?a:c)}else n[l]=new fe(a,a)}return new ue(n,e.sel.primIndex)}function Mr(e,t,r){var n={canceled:!1,from:t.from,to:t.to,text:t.text,origin:t.origin,cancel:function(){this.canceled=!0}}
return r&&(n.update=function(t,r,n,i){t&&(this.from=ge(e,t)),r&&(this.to=ge(e,r)),n&&(this.text=n),void 0!==i&&(this.origin=i)}),El(e,"beforeChange",e,n),e.cm&&El(e.cm,"beforeChange",e.cm,n),n.canceled?null:{from:n.from,to:n.to,text:n.text,origin:n.origin}}function kr(e,t,r){if(e.cm){if(!e.cm.curOp)return Wt(e.cm,kr)(e,t,r)
if(e.cm.state.suppressEdits)return}if(!(Ai(e,"beforeChange")||e.cm&&Ai(e.cm,"beforeChange"))||(t=Mr(e,t,!0))){var n=Ro&&!r&&cn(e,t.from,t.to)
if(n)for(var i=n.length-1;i>=0;--i)Tr(e,{from:n[i].from,to:n[i].to,text:i?[""]:t.text})
else Tr(e,t)}}function Tr(e,t){if(1!=t.text.length||""!=t.text[0]||0!=Uo(t.from,t.to)){var r=Cr(e,t)
ui(e,t,r,e.cm?e.cm.curOp.id:NaN),Or(e,t,r,ln(e,t))
var n=[]
$n(e,function(e,r){r||zi(n,e.history)!=-1||(wi(e.history,t),n.push(e.history)),Or(e,t,null,ln(e,t))})}}function Nr(e,t,r){if(!e.cm||!e.cm.state.suppressEdits||r){for(var n,i=e.history,o=e.sel,l="undo"==t?i.done:i.undone,s="undo"==t?i.undone:i.done,a=0;a<l.length&&(n=l[a],r?!n.ranges||n.equals(e.sel):n.ranges);a++);if(a!=l.length){for(i.lastOrigin=i.lastSelOrigin=null;n=l.pop(),n.ranges;){if(di(n,s),r&&!n.equals(e.sel))return void ke(e,n,{clearRedo:!1})
o=n}var c=[]
di(o,s),s.push({changes:c,generation:i.generation}),i.generation=n.generation||++i.maxGeneration
for(var u=Ai(e,"beforeChange")||e.cm&&Ai(e.cm,"beforeChange"),a=n.changes.length-1;a>=0;--a){var f=n.changes[a]
if(f.origin=t,u&&!Mr(e,f,!1))return void(l.length=0)
c.push(si(e,f))
var h=a?Cr(e,f):Hi(l)
Or(e,f,h,an(e,f)),!a&&e.cm&&e.cm.scrollIntoView({from:f.from,to:tl(f)})
var d=[]
$n(e,function(e,t){t||zi(d,e.history)!=-1||(wi(e.history,f),d.push(e.history)),Or(e,f,null,an(e,f))})}}}}function Ar(e,t){if(0!=t&&(e.first+=t,e.sel=new ue(Ei(e.sel.ranges,function(e){return new fe(Bo(e.anchor.line+t,e.anchor.ch),Bo(e.head.line+t,e.head.ch))}),e.sel.primIndex),e.cm)){Pt(e.cm,e.first,e.first-t,t)
for(var r=e.cm.display,n=r.viewFrom;n<r.viewTo;n++)It(e.cm,n,"gutter")}}function Or(e,t,r,n){if(e.cm&&!e.cm.curOp)return Wt(e.cm,Or)(e,t,r,n)
if(t.to.line<e.first)return void Ar(e,t.text.length-1-(t.to.line-t.from.line))
if(!(t.from.line>e.lastLine())){if(t.from.line<e.first){var i=t.text.length-1-(e.first-t.from.line)
Ar(e,i),t={from:Bo(e.first,0),to:Bo(t.to.line+i,t.to.ch),text:[Hi(t.text)],origin:t.origin}}var o=e.lastLine()
t.to.line>o&&(t={from:t.from,to:Bo(o,Jn(e,o).text.length),text:[t.text[0]],origin:t.origin}),t.removed=Qn(e,t.from,t.to),r||(r=Cr(e,t)),e.cm?Wr(e.cm,t,n):Yn(e,t,n),Te(e,r,Fl)}}function Wr(e,t,r){var n=e.doc,i=e.display,l=t.from,s=t.to,a=!1,c=l.line
e.options.lineWrapping||(c=ri(bn(Jn(n,l.line))),n.iter(c,s.line+1,function(e){if(e==i.maxLine)return a=!0,!0})),n.sel.contains(t.from,t.to)>-1&&Ni(e),Yn(n,t,r,o(e)),e.options.lineWrapping||(n.iter(c,l.line+t.text.length,function(e){var t=f(e)
t>i.maxLineLength&&(i.maxLine=e,i.maxLineLength=t,i.maxLineChanged=!0,a=!1)}),a&&(e.curOp.updateMaxLine=!0)),n.frontier=Math.min(n.frontier,l.line),Fe(e,400)
var u=t.text.length-(s.line-l.line)-1
t.full?Pt(e):l.line!=s.line||1!=t.text.length||Xn(e.doc,t)?Pt(e,l.line,s.line+1,u):It(e,l.line,"text")
var h=Ai(e,"changes"),d=Ai(e,"change")
if(d||h){var p={from:l,to:s,text:t.text,removed:t.removed,origin:t.origin}
d&&Mi(e,"change",e,p),h&&(e.curOp.changeObjs||(e.curOp.changeObjs=[])).push(p)}e.display.selForContextMenu=null}function Dr(e,t,r,n,i){if(n||(n=r),Uo(n,r)<0){var o=n
n=r,r=o}"string"==typeof t&&(t=e.splitLines(t)),kr(e,{from:r,to:n,text:t,origin:i})}function Hr(e,t){if(!Ti(e,"scrollCursorIntoView")){var r=e.display,n=r.sizer.getBoundingClientRect(),i=null
if(t.top+n.top<0?i=!0:t.bottom+n.top>(window.innerHeight||document.documentElement.clientHeight)&&(i=!1),null!=i&&!Ao){var o=Ki("div","​",null,"position: absolute; top: "+(t.top-r.viewOffset-Ve(e.display))+"px; height: "+(t.bottom-t.top+Xe(e)+r.barHeight)+"px; left: "+t.left+"px; width: 2px;")
e.display.lineSpace.appendChild(o),o.scrollIntoView(i),e.display.lineSpace.removeChild(o)}}}function zr(e,t,r,n){null==n&&(n=0)
for(var i=0;i<5;i++){var o=!1,l=pt(e,t),s=r&&r!=t?pt(e,r):l,a=Pr(e,Math.min(l.left,s.left),Math.min(l.top,s.top)-n,Math.max(l.left,s.left),Math.max(l.bottom,s.bottom)+n),c=e.doc.scrollTop,u=e.doc.scrollLeft
if(null!=a.scrollTop&&(ir(e,a.scrollTop),Math.abs(e.doc.scrollTop-c)>1&&(o=!0)),null!=a.scrollLeft&&(or(e,a.scrollLeft),Math.abs(e.doc.scrollLeft-u)>1&&(o=!0)),!o)break}return l}function Er(e,t,r,n,i){var o=Pr(e,t,r,n,i)
null!=o.scrollTop&&ir(e,o.scrollTop),null!=o.scrollLeft&&or(e,o.scrollLeft)}function Pr(e,t,r,n,i){var o=e.display,l=bt(e.display)
r<0&&(r=0)
var s=e.curOp&&null!=e.curOp.scrollTop?e.curOp.scrollTop:o.scroller.scrollTop,a=_e(e),c={}
i-r>a&&(i=r+a)
var u=e.doc.height+Ke(o),f=r<l,h=i>u-l
if(r<s)c.scrollTop=f?0:r
else if(i>s+a){var d=Math.min(r,(h?u:i)-a)
d!=s&&(c.scrollTop=d)}var p=e.curOp&&null!=e.curOp.scrollLeft?e.curOp.scrollLeft:o.scroller.scrollLeft,g=Ye(e)-(e.options.fixedGutter?o.gutters.offsetWidth:0),v=n-t>g
return v&&(n=t+g),t<10?c.scrollLeft=0:t<p?c.scrollLeft=Math.max(0,t-(v?0:10)):n>g+p-3&&(c.scrollLeft=n+(v?0:10)-g),c}function Ir(e,t,r){null==t&&null==r||Fr(e),null!=t&&(e.curOp.scrollLeft=(null==e.curOp.scrollLeft?e.doc.scrollLeft:e.curOp.scrollLeft)+t),null!=r&&(e.curOp.scrollTop=(null==e.curOp.scrollTop?e.doc.scrollTop:e.curOp.scrollTop)+r)}function Rr(e){Fr(e)
var t=e.getCursor(),r=t,n=t
e.options.lineWrapping||(r=t.ch?Bo(t.line,t.ch-1):t,n=Bo(t.line,t.ch+1)),e.curOp.scrollToPos={from:r,to:n,margin:e.options.cursorScrollMargin,isCursor:!0}}function Fr(e){var t=e.curOp.scrollToPos
if(t){e.curOp.scrollToPos=null
var r=gt(e,t.from),n=gt(e,t.to),i=Pr(e,Math.min(r.left,n.left),Math.min(r.top,n.top)-t.margin,Math.max(r.right,n.right),Math.max(r.bottom,n.bottom)+t.margin)
e.scrollTo(i.scrollLeft,i.scrollTop)}}function Br(e,t,r,n){var i,o=e.doc
null==r&&(r="add"),"smart"==r&&(o.mode.indent?i=Ge(e,t):r="prev")
var l=e.options.tabSize,s=Jn(o,t),a=Gl(s.text,null,l)
s.stateAfter&&(s.stateAfter=null)
var c,u=s.text.match(/^\s*/)[0]
if(n||/\S/.test(s.text)){if("smart"==r&&(c=o.mode.indent(i,s.text.slice(u.length),s.text),c==Rl||c>150)){if(!n)return
r="prev"}}else c=0,r="not"
"prev"==r?c=t>o.first?Gl(Jn(o,t-1).text,null,l):0:"add"==r?c=a+e.options.indentUnit:"subtract"==r?c=a-e.options.indentUnit:"number"==typeof r&&(c=a+r),c=Math.max(0,c)
var f="",h=0
if(e.options.indentWithTabs)for(var d=Math.floor(c/l);d;--d)h+=l,f+="\t"
if(h<c&&(f+=Di(c-h)),f!=u)return Dr(o,f,Bo(t,0),Bo(t,u.length),"+input"),s.stateAfter=null,!0
for(var d=0;d<o.sel.ranges.length;d++){var p=o.sel.ranges[d]
if(p.head.line==t&&p.head.ch<u.length){var h=Bo(t,u.length)
Ce(o,d,new fe(h,h))
break}}}function Ur(e,t,r,n){var i=t,o=t
return"number"==typeof t?o=Jn(e,pe(e,t)):i=ri(t),null==i?null:(n(o,i)&&e.cm&&It(e.cm,i,r),o)}function Gr(e,t){for(var r=e.doc.sel.ranges,n=[],i=0;i<r.length;i++){for(var o=t(r[i]);n.length&&Uo(o.from,Hi(n).to)<=0;){var l=n.pop()
if(Uo(l.from,o.from)<0){o.from=l.from
break}}n.push(o)}Ot(e,function(){for(var t=n.length-1;t>=0;t--)Dr(e.doc,"",n[t].from,n[t].to,"+delete")
Rr(e)})}function Vr(e,t,r,n,i){function o(){var t=s+r
return!(t<e.first||t>=e.first+e.size)&&(s=t,u=Jn(e,t))}function l(e){var t=(i?po:go)(u,a,r,!0)
if(null==t){if(e||!o())return!1
a=i?(r<0?lo:oo)(u):r<0?u.text.length:0}else a=t
return!0}var s=t.line,a=t.ch,c=r,u=Jn(e,s)
if("char"==n)l()
else if("column"==n)l(!0)
else if("word"==n||"group"==n)for(var f=null,h="group"==n,d=e.cm&&e.cm.getHelper(t,"wordChars"),p=!0;!(r<0)||l(!p);p=!1){var g=u.text.charAt(a)||"\n",v=Ui(g,d)?"w":h&&"\n"==g?"n":!h||/\s/.test(g)?null:"p"
if(!h||p||v||(v="s"),f&&f!=v){r<0&&(r=1,l())
break}if(v&&(f=v),r>0&&!l(!p))break}var m=De(e,Bo(s,a),t,c,!0)
return Uo(t,m)||(m.hitSide=!0),m}function Kr(e,t,r,n){var i,o=e.doc,l=t.left
if("page"==n){var s=Math.min(e.display.wrapper.clientHeight,window.innerHeight||document.documentElement.clientHeight),a=Math.max(s-.5*bt(e.display),3)
i=(r>0?t.bottom:t.top)+r*a}else"line"==n&&(i=r>0?t.bottom+3:t.top-3)
for(;;){var c=mt(e,l,i)
if(!c.outside)break
if(r<0?i<=0:i>=o.height){c.hitSide=!0
break}i+=5*r}return c}function jr(t,r,n,i){e.defaults[t]=r,n&&(nl[t]=i?function(e,t,r){r!=il&&n(e,t,r)}:n)}function Xr(e){for(var t,r,n,i,o=e.split(/-(?!$)/),e=o[o.length-1],l=0;l<o.length-1;l++){var s=o[l]
if(/^(cmd|meta|m)$/i.test(s))i=!0
else if(/^a(lt)?$/i.test(s))t=!0
else if(/^(c|ctrl|control)$/i.test(s))r=!0
else{if(!/^s(hift)$/i.test(s))throw new Error("Unrecognized modifier name: "+s)
n=!0}}return t&&(e="Alt-"+e),r&&(e="Ctrl-"+e),i&&(e="Cmd-"+e),n&&(e="Shift-"+e),e}function Yr(e){return"string"==typeof e?dl[e]:e}function _r(e,t,r,n,i){if(n&&n.shared)return qr(e,t,r,n,i)
if(e.cm&&!e.cm.curOp)return Wt(e.cm,_r)(e,t,r,n,i)
var o=new bl(e,i),l=Uo(t,r)
if(n&&Fi(n,o,!1),l>0||0==l&&o.clearWhenEmpty!==!1)return o
if(o.replacedWith&&(o.collapsed=!0,o.widgetNode=Ki("span",[o.replacedWith],"CodeMirror-widget"),n.handleMouseEvents||o.widgetNode.setAttribute("cm-ignore-events","true"),n.insertLeft&&(o.widgetNode.insertLeft=!0)),o.collapsed){if(yn(e,t.line,t,r,o)||t.line!=r.line&&yn(e,r.line,t,r,o))throw new Error("Inserting collapsed marker partially overlapping an existing one")
Fo=!0}o.addToHistory&&ui(e,{from:t,to:r,origin:"markText"},e.sel,NaN)
var s,a=t.line,c=e.cm
if(e.iter(a,r.line+1,function(e){c&&o.collapsed&&!c.options.lineWrapping&&bn(e)==c.display.maxLine&&(s=!0),o.collapsed&&a!=t.line&&ti(e,0),rn(e,new Qr(o,a==t.line?t.ch:null,a==r.line?r.ch:null)),++a}),o.collapsed&&e.iter(t.line,r.line+1,function(t){Sn(e,t)&&ti(t,0)}),o.clearOnEnter&&Dl(o,"beforeCursorEnter",function(){o.clear()}),o.readOnly&&(Ro=!0,(e.history.done.length||e.history.undone.length)&&e.clearHistory()),o.collapsed&&(o.id=++yl,o.atomic=!0),c){if(s&&(c.curOp.updateMaxLine=!0),o.collapsed)Pt(c,t.line,r.line+1)
else if(o.className||o.title||o.startStyle||o.endStyle||o.css)for(var u=t.line;u<=r.line;u++)It(c,u,"text")
o.atomic&&Ae(c.doc),Mi(c,"markerAdded",c,o)}return o}function qr(e,t,r,n,i){n=Fi(n),n.shared=!1
var o=[_r(e,t,r,n,i)],l=o[0],s=n.widgetNode
return $n(e,function(e){s&&(n.widgetNode=s.cloneNode(!0)),o.push(_r(e,ge(e,t),ge(e,r),n,i))
for(var a=0;a<e.linked.length;++a)if(e.linked[a].isParent)return
l=Hi(o)}),new wl(o,l)}function $r(e){return e.findMarks(Bo(e.first,0),e.clipPos(Bo(e.lastLine())),function(e){return e.parent})}function Zr(e,t){for(var r=0;r<t.length;r++){var n=t[r],i=n.find(),o=e.clipPos(i.from),l=e.clipPos(i.to)
if(Uo(o,l)){var s=_r(e,o,l,n.primary,n.primary.type)
n.markers.push(s),s.parent=n}}}function Jr(e){for(var t=0;t<e.length;t++){var r=e[t],n=[r.primary.doc]
$n(r.primary.doc,function(e){n.push(e)})
for(var i=0;i<r.markers.length;i++){var o=r.markers[i]
zi(n,o.doc)==-1&&(o.parent=null,r.markers.splice(i--,1))}}}function Qr(e,t,r){this.marker=e,this.from=t,this.to=r}function en(e,t){if(e)for(var r=0;r<e.length;++r){var n=e[r]
if(n.marker==t)return n}}function tn(e,t){for(var r,n=0;n<e.length;++n)e[n]!=t&&(r||(r=[])).push(e[n])
return r}function rn(e,t){e.markedSpans=e.markedSpans?e.markedSpans.concat([t]):[t],t.marker.attachLine(e)}function nn(e,t,r){if(e)for(var n,i=0;i<e.length;++i){var o=e[i],l=o.marker,s=null==o.from||(l.inclusiveLeft?o.from<=t:o.from<t)
if(s||o.from==t&&"bookmark"==l.type&&(!r||!o.marker.insertLeft)){var a=null==o.to||(l.inclusiveRight?o.to>=t:o.to>t);(n||(n=[])).push(new Qr(l,o.from,a?null:o.to))}}return n}function on(e,t,r){if(e)for(var n,i=0;i<e.length;++i){var o=e[i],l=o.marker,s=null==o.to||(l.inclusiveRight?o.to>=t:o.to>t)
if(s||o.from==t&&"bookmark"==l.type&&(!r||o.marker.insertLeft)){var a=null==o.from||(l.inclusiveLeft?o.from<=t:o.from<t);(n||(n=[])).push(new Qr(l,a?null:o.from-t,null==o.to?null:o.to-t))}}return n}function ln(e,t){if(t.full)return null
var r=me(e,t.from.line)&&Jn(e,t.from.line).markedSpans,n=me(e,t.to.line)&&Jn(e,t.to.line).markedSpans
if(!r&&!n)return null
var i=t.from.ch,o=t.to.ch,l=0==Uo(t.from,t.to),s=nn(r,i,l),a=on(n,o,l),c=1==t.text.length,u=Hi(t.text).length+(c?i:0)
if(s)for(var f=0;f<s.length;++f){var h=s[f]
if(null==h.to){var d=en(a,h.marker)
d?c&&(h.to=null==d.to?null:d.to+u):h.to=i}}if(a)for(var f=0;f<a.length;++f){var h=a[f]
if(null!=h.to&&(h.to+=u),null==h.from){var d=en(s,h.marker)
d||(h.from=u,c&&(s||(s=[])).push(h))}else h.from+=u,c&&(s||(s=[])).push(h)}s&&(s=sn(s)),a&&a!=s&&(a=sn(a))
var p=[s]
if(!c){var g,v=t.text.length-2
if(v>0&&s)for(var f=0;f<s.length;++f)null==s[f].to&&(g||(g=[])).push(new Qr(s[f].marker,null,null))
for(var f=0;f<v;++f)p.push(g)
p.push(a)}return p}function sn(e){for(var t=0;t<e.length;++t){var r=e[t]
null!=r.from&&r.from==r.to&&r.marker.clearWhenEmpty!==!1&&e.splice(t--,1)}return e.length?e:null}function an(e,t){var r=vi(e,t),n=ln(e,t)
if(!r)return n
if(!n)return r
for(var i=0;i<r.length;++i){var o=r[i],l=n[i]
if(o&&l)e:for(var s=0;s<l.length;++s){for(var a=l[s],c=0;c<o.length;++c)if(o[c].marker==a.marker)continue e
o.push(a)}else l&&(r[i]=l)}return r}function cn(e,t,r){var n=null
if(e.iter(t.line,r.line+1,function(e){if(e.markedSpans)for(var t=0;t<e.markedSpans.length;++t){var r=e.markedSpans[t].marker
!r.readOnly||n&&zi(n,r)!=-1||(n||(n=[])).push(r)}}),!n)return null
for(var i=[{from:t,to:r}],o=0;o<n.length;++o)for(var l=n[o],s=l.find(0),a=0;a<i.length;++a){var c=i[a]
if(!(Uo(c.to,s.from)<0||Uo(c.from,s.to)>0)){var u=[a,1],f=Uo(c.from,s.from),h=Uo(c.to,s.to);(f<0||!l.inclusiveLeft&&!f)&&u.push({from:c.from,to:s.from}),(h>0||!l.inclusiveRight&&!h)&&u.push({from:s.to,to:c.to}),i.splice.apply(i,u),a+=u.length-1}}return i}function un(e){var t=e.markedSpans
if(t){for(var r=0;r<t.length;++r)t[r].marker.detachLine(e)
e.markedSpans=null}}function fn(e,t){if(t){for(var r=0;r<t.length;++r)t[r].marker.attachLine(e)
e.markedSpans=t}}function hn(e){return e.inclusiveLeft?-1:0}function dn(e){return e.inclusiveRight?1:0}function pn(e,t){var r=e.lines.length-t.lines.length
if(0!=r)return r
var n=e.find(),i=t.find(),o=Uo(n.from,i.from)||hn(e)-hn(t)
if(o)return-o
var l=Uo(n.to,i.to)||dn(e)-dn(t)
return l?l:t.id-e.id}function gn(e,t){var r,n=Fo&&e.markedSpans
if(n)for(var i,o=0;o<n.length;++o)i=n[o],i.marker.collapsed&&null==(t?i.from:i.to)&&(!r||pn(r,i.marker)<0)&&(r=i.marker)
return r}function vn(e){return gn(e,!0)}function mn(e){return gn(e,!1)}function yn(e,t,r,n,i){var o=Jn(e,t),l=Fo&&o.markedSpans
if(l)for(var s=0;s<l.length;++s){var a=l[s]
if(a.marker.collapsed){var c=a.marker.find(0),u=Uo(c.from,r)||hn(a.marker)-hn(i),f=Uo(c.to,n)||dn(a.marker)-dn(i)
if(!(u>=0&&f<=0||u<=0&&f>=0)&&(u<=0&&(a.marker.inclusiveRight&&i.inclusiveLeft?Uo(c.to,r)>=0:Uo(c.to,r)>0)||u>=0&&(a.marker.inclusiveRight&&i.inclusiveLeft?Uo(c.from,n)<=0:Uo(c.from,n)<0)))return!0}}}function bn(e){for(var t;t=vn(e);)e=t.find(-1,!0).line
return e}function wn(e){for(var t,r;t=mn(e);)e=t.find(1,!0).line,(r||(r=[])).push(e)
return r}function xn(e,t){var r=Jn(e,t),n=bn(r)
return r==n?t:ri(n)}function Cn(e,t){if(t>e.lastLine())return t
var r,n=Jn(e,t)
if(!Sn(e,n))return t
for(;r=mn(n);)n=r.find(1,!0).line
return ri(n)+1}function Sn(e,t){var r=Fo&&t.markedSpans
if(r)for(var n,i=0;i<r.length;++i)if(n=r[i],n.marker.collapsed){if(null==n.from)return!0
if(!n.marker.widgetNode&&0==n.from&&n.marker.inclusiveLeft&&Ln(e,t,n))return!0}}function Ln(e,t,r){if(null==r.to){var n=r.marker.find(1,!0)
return Ln(e,n.line,en(n.line.markedSpans,r.marker))}if(r.marker.inclusiveRight&&r.to==t.text.length)return!0
for(var i,o=0;o<t.markedSpans.length;++o)if(i=t.markedSpans[o],i.marker.collapsed&&!i.marker.widgetNode&&i.from==r.to&&(null==i.to||i.to!=r.from)&&(i.marker.inclusiveLeft||r.marker.inclusiveRight)&&Ln(e,t,i))return!0}function Mn(e,t,r){ii(t)<(e.curOp&&e.curOp.scrollTop||e.doc.scrollTop)&&Ir(e,null,r)}function kn(e){if(null!=e.height)return e.height
var t=e.doc.cm
if(!t)return 0
if(!$l(document.body,e.node)){var r="position: relative;"
e.coverGutter&&(r+="margin-left: -"+t.display.gutters.offsetWidth+"px;"),e.noHScroll&&(r+="width: "+t.display.wrapper.clientWidth+"px;"),Xi(t.display.measure,Ki("div",[e.node],null,r))}return e.height=e.node.parentNode.offsetHeight}function Tn(e,t,r,n){var i=new xl(e,r,n),o=e.cm
return o&&i.noHScroll&&(o.display.alignWidgets=!0),Ur(e,t,"widget",function(t){var r=t.widgets||(t.widgets=[])
if(null==i.insertAt?r.push(i):r.splice(Math.min(r.length-1,Math.max(0,i.insertAt)),0,i),i.line=t,o&&!Sn(e,t)){var n=ii(t)<e.scrollTop
ti(t,t.height+kn(i)),n&&Ir(o,null,i.height),o.curOp.forceUpdate=!0}return!0}),i}function Nn(e,t,r,n){e.text=t,e.stateAfter&&(e.stateAfter=null),e.styles&&(e.styles=null),null!=e.order&&(e.order=null),un(e),fn(e,r)
var i=n?n(e):1
i!=e.height&&ti(e,i)}function An(e){e.parent=null,un(e)}function On(e,t){if(e)for(;;){var r=e.match(/(?:^|\s+)line-(background-)?(\S+)/)
if(!r)break
e=e.slice(0,r.index)+e.slice(r.index+r[0].length)
var n=r[1]?"bgClass":"textClass"
null==t[n]?t[n]=r[2]:new RegExp("(?:^|s)"+r[2]+"(?:$|s)").test(t[n])||(t[n]+=" "+r[2])}return e}function Wn(t,r){if(t.blankLine)return t.blankLine(r)
if(t.innerMode){var n=e.innerMode(t,r)
return n.mode.blankLine?n.mode.blankLine(n.state):void 0}}function Dn(t,r,n,i){for(var o=0;o<10;o++){i&&(i[0]=e.innerMode(t,n).mode)
var l=t.token(r,n)
if(r.pos>r.start)return l}throw new Error("Mode "+t.name+" failed to advance stream.")}function Hn(e,t,r,n){function i(e){return{start:f.start,end:f.pos,string:f.current(),type:o||null,state:e?ul(l.mode,u):u}}var o,l=e.doc,s=l.mode
t=ge(l,t)
var a,c=Jn(l,t.line),u=Ge(e,t.line,r),f=new ml(c.text,e.options.tabSize)
for(n&&(a=[]);(n||f.pos<t.ch)&&!f.eol();)f.start=f.pos,o=Dn(s,f,u),n&&a.push(i(!0))
return n?a:i()}function zn(e,t,r,n,i,o,l){var s=r.flattenSpans
null==s&&(s=e.options.flattenSpans)
var a,c=0,u=null,f=new ml(t,e.options.tabSize),h=e.options.addModeClass&&[null]
for(""==t&&On(Wn(r,n),o);!f.eol();){if(f.pos>e.options.maxHighlightLength?(s=!1,l&&In(e,t,n,f.pos),f.pos=t.length,a=null):a=On(Dn(r,f,n,h),o),h){var d=h[0].name
d&&(a="m-"+(a?d+" "+a:d))}if(!s||u!=a){for(;c<f.start;)c=Math.min(f.start,c+5e3),i(c,u)
u=a}f.start=f.pos}for(;c<f.pos;){var p=Math.min(f.pos,c+5e3)
i(p,u),c=p}}function En(e,t,r,n){var i=[e.state.modeGen],o={}
zn(e,t.text,e.doc.mode,r,function(e,t){i.push(e,t)},o,n)
for(var l=0;l<e.state.overlays.length;++l){var s=e.state.overlays[l],a=1,c=0
zn(e,t.text,s.mode,!0,function(e,t){for(var r=a;c<e;){var n=i[a]
n>e&&i.splice(a,1,e,i[a+1],n),a+=2,c=Math.min(e,n)}if(t)if(s.opaque)i.splice(r,a-r,e,"cm-overlay "+t),a=r+2
else for(;r<a;r+=2){var o=i[r+1]
i[r+1]=(o?o+" ":"")+"cm-overlay "+t}},o)}return{styles:i,classes:o.bgClass||o.textClass?o:null}}function Pn(e,t,r){if(!t.styles||t.styles[0]!=e.state.modeGen){var n=Ge(e,ri(t)),i=En(e,t,t.text.length>e.options.maxHighlightLength?ul(e.doc.mode,n):n)
t.stateAfter=n,t.styles=i.styles,i.classes?t.styleClasses=i.classes:t.styleClasses&&(t.styleClasses=null),r===e.doc.frontier&&e.doc.frontier++}return t.styles}function In(e,t,r,n){var i=e.doc.mode,o=new ml(t,e.options.tabSize)
for(o.start=o.pos=n||0,""==t&&Wn(i,r);!o.eol();)Dn(i,o,r),o.start=o.pos}function Rn(e,t){if(!e||/^\s*$/.test(e))return null
var r=t.addModeClass?Ll:Sl
return r[e]||(r[e]=e.replace(/\S+/g,"cm-$&"))}function Fn(e,t){var r=Ki("span",null,null,So?"padding-right: .1px":null),n={pre:Ki("pre",[r],"CodeMirror-line"),content:r,col:0,pos:0,cm:e,trailingSpace:!1,splitSpaces:(xo||So)&&e.getOption("lineWrapping")}
t.measure={}
for(var i=0;i<=(t.rest?t.rest.length:0);i++){var o,l=i?t.rest[i-1]:t.line
n.pos=0,n.addToken=Un,eo(e.display.measure)&&(o=oi(l))&&(n.addToken=Vn(n.addToken,o)),n.map=[]
var s=t!=e.display.externalMeasured&&ri(l)
jn(l,n,Pn(e,l,s)),l.styleClasses&&(l.styleClasses.bgClass&&(n.bgClass=qi(l.styleClasses.bgClass,n.bgClass||"")),l.styleClasses.textClass&&(n.textClass=qi(l.styleClasses.textClass,n.textClass||""))),0==n.map.length&&n.map.push(0,0,n.content.appendChild(Qi(e.display.measure))),0==i?(t.measure.map=n.map,t.measure.cache={}):((t.measure.maps||(t.measure.maps=[])).push(n.map),(t.measure.caches||(t.measure.caches=[])).push({}))}if(So){var a=n.content.lastChild;(/\bcm-tab\b/.test(a.className)||a.querySelector&&a.querySelector(".cm-tab"))&&(n.content.className="cm-tab-wrap-hack")}return El(e,"renderLine",e,t.line,n.pre),n.pre.className&&(n.textClass=qi(n.pre.className,n.textClass||"")),n}function Bn(e){var t=Ki("span","•","cm-invalidchar")
return t.title="\\u"+e.charCodeAt(0).toString(16),t.setAttribute("aria-label",t.title),t}function Un(e,t,r,n,i,o,l){if(t){var s=e.splitSpaces?Gn(t,e.trailingSpace):t,a=e.cm.state.specialChars,c=!1
if(a.test(t))for(var u=document.createDocumentFragment(),f=0;;){a.lastIndex=f
var h=a.exec(t),d=h?h.index-f:t.length-f
if(d){var p=document.createTextNode(s.slice(f,f+d))
xo&&Co<9?u.appendChild(Ki("span",[p])):u.appendChild(p),e.map.push(e.pos,e.pos+d,p),e.col+=d,e.pos+=d}if(!h)break
if(f+=d+1,"\t"==h[0]){var g=e.cm.options.tabSize,v=g-e.col%g,p=u.appendChild(Ki("span",Di(v),"cm-tab"))
p.setAttribute("role","presentation"),p.setAttribute("cm-text","\t"),e.col+=v}else if("\r"==h[0]||"\n"==h[0]){var p=u.appendChild(Ki("span","\r"==h[0]?"␍":"␤","cm-invalidchar"))
p.setAttribute("cm-text",h[0]),e.col+=1}else{var p=e.cm.options.specialCharPlaceholder(h[0])
p.setAttribute("cm-text",h[0]),xo&&Co<9?u.appendChild(Ki("span",[p])):u.appendChild(p),e.col+=1}e.map.push(e.pos,e.pos+1,p),e.pos++}else{e.col+=t.length
var u=document.createTextNode(s)
e.map.push(e.pos,e.pos+t.length,u),xo&&Co<9&&(c=!0),e.pos+=t.length}if(e.trailingSpace=32==s.charCodeAt(t.length-1),r||n||i||c||l){var m=r||""
n&&(m+=n),i&&(m+=i)
var y=Ki("span",[u],m,l)
return o&&(y.title=o),e.content.appendChild(y)}e.content.appendChild(u)}}function Gn(e,t){if(e.length>1&&!/  /.test(e))return e
for(var r=t,n="",i=0;i<e.length;i++){var o=e.charAt(i)
" "!=o||!r||i!=e.length-1&&32!=e.charCodeAt(i+1)||(o=" "),n+=o,r=" "==o}return n}function Vn(e,t){return function(r,n,i,o,l,s,a){i=i?i+" cm-force-border":"cm-force-border"
for(var c=r.pos,u=c+n.length;;){for(var f=0;f<t.length;f++){var h=t[f]
if(h.to>c&&h.from<=c)break}if(h.to>=u)return e(r,n,i,o,l,s,a)
e(r,n.slice(0,h.to-c),i,o,null,s,a),o=null,n=n.slice(h.to-c),c=h.to}}}function Kn(e,t,r,n){var i=!n&&r.widgetNode
i&&e.map.push(e.pos,e.pos+t,i),!n&&e.cm.display.input.needsContentAttribute&&(i||(i=e.content.appendChild(document.createElement("span"))),i.setAttribute("cm-marker",r.id)),i&&(e.cm.display.input.setUneditable(i),e.content.appendChild(i)),e.pos+=t,e.trailingSpace=!1}function jn(e,t,r){var n=e.markedSpans,i=e.text,o=0
if(n)for(var l,s,a,c,u,f,h,d=i.length,p=0,g=1,v="",m=0;;){if(m==p){a=c=u=f=s="",h=null,m=1/0
for(var y,b=[],w=0;w<n.length;++w){var x=n[w],C=x.marker
"bookmark"==C.type&&x.from==p&&C.widgetNode?b.push(C):x.from<=p&&(null==x.to||x.to>p||C.collapsed&&x.to==p&&x.from==p)?(null!=x.to&&x.to!=p&&m>x.to&&(m=x.to,c=""),C.className&&(a+=" "+C.className),C.css&&(s=(s?s+";":"")+C.css),C.startStyle&&x.from==p&&(u+=" "+C.startStyle),C.endStyle&&x.to==m&&(y||(y=[])).push(C.endStyle,x.to),C.title&&!f&&(f=C.title),C.collapsed&&(!h||pn(h.marker,C)<0)&&(h=x)):x.from>p&&m>x.from&&(m=x.from)}if(y)for(var w=0;w<y.length;w+=2)y[w+1]==m&&(c+=" "+y[w])
if(!h||h.from==p)for(var w=0;w<b.length;++w)Kn(t,0,b[w])
if(h&&(h.from||0)==p){if(Kn(t,(null==h.to?d+1:h.to)-p,h.marker,null==h.from),null==h.to)return
h.to==p&&(h=!1)}}if(p>=d)break
for(var S=Math.min(d,m);;){if(v){var L=p+v.length
if(!h){var M=L>S?v.slice(0,S-p):v
t.addToken(t,M,l?l+a:a,u,p+M.length==m?c:"",f,s)}if(L>=S){v=v.slice(S-p),p=S
break}p=L,u=""}v=i.slice(o,o=r[g++]),l=Rn(r[g++],t.cm.options)}}else for(var g=1;g<r.length;g+=2)t.addToken(t,i.slice(o,o=r[g]),Rn(r[g+1],t.cm.options))}function Xn(e,t){return 0==t.from.ch&&0==t.to.ch&&""==Hi(t.text)&&(!e.cm||e.cm.options.wholeLineUpdateBefore)}function Yn(e,t,r,n){function i(e){return r?r[e]:null}function o(e,r,i){Nn(e,r,i,n),Mi(e,"change",e,t)}function l(e,t){for(var r=e,o=[];r<t;++r)o.push(new Cl(c[r],i(r),n))
return o}var s=t.from,a=t.to,c=t.text,u=Jn(e,s.line),f=Jn(e,a.line),h=Hi(c),d=i(c.length-1),p=a.line-s.line
if(t.full)e.insert(0,l(0,c.length)),e.remove(c.length,e.size-c.length)
else if(Xn(e,t)){var g=l(0,c.length-1)
o(f,f.text,d),p&&e.remove(s.line,p),g.length&&e.insert(s.line,g)}else if(u==f)if(1==c.length)o(u,u.text.slice(0,s.ch)+h+u.text.slice(a.ch),d)
else{var g=l(1,c.length-1)
g.push(new Cl(h+u.text.slice(a.ch),d,n)),o(u,u.text.slice(0,s.ch)+c[0],i(0)),e.insert(s.line+1,g)}else if(1==c.length)o(u,u.text.slice(0,s.ch)+c[0]+f.text.slice(a.ch),i(0)),e.remove(s.line+1,p)
else{o(u,u.text.slice(0,s.ch)+c[0],i(0)),o(f,h+f.text.slice(a.ch),d)
var g=l(1,c.length-1)
p>1&&e.remove(s.line+1,p-1),e.insert(s.line+1,g)}Mi(e,"change",e,t)}function _n(e){this.lines=e,this.parent=null
for(var t=0,r=0;t<e.length;++t)e[t].parent=this,r+=e[t].height
this.height=r}function qn(e){this.children=e
for(var t=0,r=0,n=0;n<e.length;++n){var i=e[n]
t+=i.chunkSize(),r+=i.height,i.parent=this}this.size=t,this.height=r,this.parent=null}function $n(e,t,r){function n(e,i,o){if(e.linked)for(var l=0;l<e.linked.length;++l){var s=e.linked[l]
if(s.doc!=i){var a=o&&s.sharedHist
r&&!a||(t(s.doc,a),n(s.doc,e,a))}}}n(e,null,!0)}function Zn(e,t){if(t.cm)throw new Error("This document is already in use.")
e.doc=t,t.cm=e,l(e),r(e),e.options.lineWrapping||h(e),e.options.mode=t.modeOption,Pt(e)}function Jn(e,t){if(t-=e.first,t<0||t>=e.size)throw new Error("There is no line "+(t+e.first)+" in the document.")
for(var r=e;!r.lines;)for(var n=0;;++n){var i=r.children[n],o=i.chunkSize()
if(t<o){r=i
break}t-=o}return r.lines[t]}function Qn(e,t,r){var n=[],i=t.line
return e.iter(t.line,r.line+1,function(e){var o=e.text
i==r.line&&(o=o.slice(0,r.ch)),i==t.line&&(o=o.slice(t.ch)),n.push(o),++i}),n}function ei(e,t,r){var n=[]
return e.iter(t,r,function(e){n.push(e.text)}),n}function ti(e,t){var r=t-e.height
if(r)for(var n=e;n;n=n.parent)n.height+=r}function ri(e){if(null==e.parent)return null
for(var t=e.parent,r=zi(t.lines,e),n=t.parent;n;t=n,n=n.parent)for(var i=0;n.children[i]!=t;++i)r+=n.children[i].chunkSize()
return r+t.first}function ni(e,t){var r=e.first
e:do{for(var n=0;n<e.children.length;++n){var i=e.children[n],o=i.height
if(t<o){e=i
continue e}t-=o,r+=i.chunkSize()}return r}while(!e.lines)
for(var n=0;n<e.lines.length;++n){var l=e.lines[n],s=l.height
if(t<s)break
t-=s}return r+n}function ii(e){e=bn(e)
for(var t=0,r=e.parent,n=0;n<r.lines.length;++n){var i=r.lines[n]
if(i==e)break
t+=i.height}for(var o=r.parent;o;r=o,o=r.parent)for(var n=0;n<o.children.length;++n){var l=o.children[n]
if(l==r)break
t+=l.height}return t}function oi(e){var t=e.order
return null==t&&(t=e.order=cs(e.text)),t}function li(e){this.done=[],this.undone=[],this.undoDepth=1/0,this.lastModTime=this.lastSelTime=0,this.lastOp=this.lastSelOp=null,this.lastOrigin=this.lastSelOrigin=null,this.generation=this.maxGeneration=e||1}function si(e,t){var r={from:Y(t.from),to:tl(t),text:Qn(e,t.from,t.to)}
return pi(e,r,t.from.line,t.to.line+1),$n(e,function(e){pi(e,r,t.from.line,t.to.line+1)},!0),r}function ai(e){for(;e.length;){var t=Hi(e)
if(!t.ranges)break
e.pop()}}function ci(e,t){return t?(ai(e.done),Hi(e.done)):e.done.length&&!Hi(e.done).ranges?Hi(e.done):e.done.length>1&&!e.done[e.done.length-2].ranges?(e.done.pop(),Hi(e.done)):void 0}function ui(e,t,r,n){var i=e.history
i.undone.length=0
var o,l=+new Date
if((i.lastOp==n||i.lastOrigin==t.origin&&t.origin&&("+"==t.origin.charAt(0)&&e.cm&&i.lastModTime>l-e.cm.options.historyEventDelay||"*"==t.origin.charAt(0)))&&(o=ci(i,i.lastOp==n))){var s=Hi(o.changes)
0==Uo(t.from,t.to)&&0==Uo(t.from,s.to)?s.to=tl(t):o.changes.push(si(e,t))}else{var a=Hi(i.done)
for(a&&a.ranges||di(e.sel,i.done),o={changes:[si(e,t)],generation:i.generation},i.done.push(o);i.done.length>i.undoDepth;)i.done.shift(),i.done[0].ranges||i.done.shift()}i.done.push(r),i.generation=++i.maxGeneration,i.lastModTime=i.lastSelTime=l,i.lastOp=i.lastSelOp=n,i.lastOrigin=i.lastSelOrigin=t.origin,s||El(e,"historyAdded")}function fi(e,t,r,n){var i=t.charAt(0)
return"*"==i||"+"==i&&r.ranges.length==n.ranges.length&&r.somethingSelected()==n.somethingSelected()&&new Date-e.history.lastSelTime<=(e.cm?e.cm.options.historyEventDelay:500)}function hi(e,t,r,n){var i=e.history,o=n&&n.origin
r==i.lastSelOp||o&&i.lastSelOrigin==o&&(i.lastModTime==i.lastSelTime&&i.lastOrigin==o||fi(e,o,Hi(i.done),t))?i.done[i.done.length-1]=t:di(t,i.done),i.lastSelTime=+new Date,i.lastSelOrigin=o,i.lastSelOp=r,n&&n.clearRedo!==!1&&ai(i.undone)}function di(e,t){var r=Hi(t)
r&&r.ranges&&r.equals(e)||t.push(e)}function pi(e,t,r,n){var i=t["spans_"+e.id],o=0
e.iter(Math.max(e.first,r),Math.min(e.first+e.size,n),function(r){r.markedSpans&&((i||(i=t["spans_"+e.id]={}))[o]=r.markedSpans),++o})}function gi(e){if(!e)return null
for(var t,r=0;r<e.length;++r)e[r].marker.explicitlyCleared?t||(t=e.slice(0,r)):t&&t.push(e[r])
return t?t.length?t:null:e}function vi(e,t){var r=t["spans_"+e.id]
if(!r)return null
for(var n=0,i=[];n<t.text.length;++n)i.push(gi(r[n]))
return i}function mi(e,t,r){for(var n=0,i=[];n<e.length;++n){var o=e[n]
if(o.ranges)i.push(r?ue.prototype.deepCopy.call(o):o)
else{var l=o.changes,s=[]
i.push({changes:s})
for(var a=0;a<l.length;++a){var c,u=l[a]
if(s.push({from:u.from,to:u.to,text:u.text}),t)for(var f in u)(c=f.match(/^spans_(\d+)$/))&&zi(t,Number(c[1]))>-1&&(Hi(s)[f]=u[f],delete u[f])}}}return i}function yi(e,t,r,n){r<e.line?e.line+=n:t<e.line&&(e.line=t,e.ch=0)}function bi(e,t,r,n){for(var i=0;i<e.length;++i){var o=e[i],l=!0
if(o.ranges){o.copied||(o=e[i]=o.deepCopy(),o.copied=!0)
for(var s=0;s<o.ranges.length;s++)yi(o.ranges[s].anchor,t,r,n),yi(o.ranges[s].head,t,r,n)}else{for(var s=0;s<o.changes.length;++s){var a=o.changes[s]
if(r<a.from.line)a.from=Bo(a.from.line+n,a.from.ch),a.to=Bo(a.to.line+n,a.to.ch)
else if(t<=a.to.line){l=!1
break}}l||(e.splice(0,i+1),i=0)}}}function wi(e,t){var r=t.from.line,n=t.to.line,i=t.text.length-(n-r)-1
bi(e.done,r,n,i),bi(e.undone,r,n,i)}function xi(e){return null!=e.defaultPrevented?e.defaultPrevented:0==e.returnValue}function Ci(e){return e.target||e.srcElement}function Si(e){var t=e.which
return null==t&&(1&e.button?t=1:2&e.button?t=3:4&e.button&&(t=2)),Do&&e.ctrlKey&&1==t&&(t=3),t}function Li(e,t,r){var n=e._handlers&&e._handlers[t]
return r?n&&n.length>0?n.slice():Hl:n||Hl}function Mi(e,t){function r(e){return function(){e.apply(null,o)}}var n=Li(e,t,!1)
if(n.length){var i,o=Array.prototype.slice.call(arguments,2)
Yo?i=Yo.delayedCallbacks:Pl?i=Pl:(i=Pl=[],setTimeout(ki,0))
for(var l=0;l<n.length;++l)i.push(r(n[l]))}}function ki(){var e=Pl
Pl=null
for(var t=0;t<e.length;++t)e[t]()}function Ti(e,t,r){return"string"==typeof t&&(t={type:t,preventDefault:function(){this.defaultPrevented=!0}}),El(e,r||t.type,e,t),xi(t)||t.codemirrorIgnore}function Ni(e){var t=e._handlers&&e._handlers.cursorActivity
if(t)for(var r=e.curOp.cursorActivityHandlers||(e.curOp.cursorActivityHandlers=[]),n=0;n<t.length;++n)zi(r,t[n])==-1&&r.push(t[n])}function Ai(e,t){return Li(e,t).length>0}function Oi(e){e.prototype.on=function(e,t){Dl(this,e,t)},e.prototype.off=function(e,t){zl(this,e,t)}}function Wi(){this.id=null}function Di(e){for(;Kl.length<=e;)Kl.push(Hi(Kl)+" ")
return Kl[e]}function Hi(e){return e[e.length-1]}function zi(e,t){for(var r=0;r<e.length;++r)if(e[r]==t)return r
return-1}function Ei(e,t){for(var r=[],n=0;n<e.length;n++)r[n]=t(e[n],n)
return r}function Pi(e,t,r){for(var n=0,i=r(t);n<e.length&&r(e[n])<=i;)n++
e.splice(n,0,t)}function Ii(){}function Ri(e,t){var r
return Object.create?r=Object.create(e):(Ii.prototype=e,r=new Ii),t&&Fi(t,r),r}function Fi(e,t,r){t||(t={})
for(var n in e)!e.hasOwnProperty(n)||r===!1&&t.hasOwnProperty(n)||(t[n]=e[n])
return t}function Bi(e){var t=Array.prototype.slice.call(arguments,1)
return function(){return e.apply(null,t)}}function Ui(e,t){return t?!!(t.source.indexOf("\\w")>-1&&_l(e))||t.test(e):_l(e)}function Gi(e){for(var t in e)if(e.hasOwnProperty(t)&&e[t])return!1
return!0}function Vi(e){return e.charCodeAt(0)>=768&&ql.test(e)}function Ki(e,t,r,n){var i=document.createElement(e)
if(r&&(i.className=r),n&&(i.style.cssText=n),"string"==typeof t)i.appendChild(document.createTextNode(t))
else if(t)for(var o=0;o<t.length;++o)i.appendChild(t[o])
return i}function ji(e){for(var t=e.childNodes.length;t>0;--t)e.removeChild(e.firstChild)
return e}function Xi(e,t){return ji(e).appendChild(t)}function Yi(){for(var e=document.activeElement;e&&e.root&&e.root.activeElement;)e=e.root.activeElement
return e}function _i(e){return new RegExp("(^|\\s)"+e+"(?:$|\\s)\\s*")}function qi(e,t){for(var r=e.split(" "),n=0;n<r.length;n++)r[n]&&!_i(r[n]).test(t)&&(t+=" "+r[n])
return t}function $i(e){if(document.body.getElementsByClassName)for(var t=document.body.getElementsByClassName("CodeMirror"),r=0;r<t.length;r++){var n=t[r].CodeMirror
n&&e(n)}}function Zi(){ts||(Ji(),ts=!0)}function Ji(){var e
Dl(window,"resize",function(){null==e&&(e=setTimeout(function(){e=null,$i(jt)},100))}),Dl(window,"blur",function(){$i(yr)})}function Qi(e){if(null==Zl){var t=Ki("span","​")
Xi(e,Ki("span",[t,document.createTextNode("x")])),0!=e.firstChild.offsetHeight&&(Zl=t.offsetWidth<=1&&t.offsetHeight>2&&!(xo&&Co<8))}var r=Zl?Ki("span","​"):Ki("span"," ",null,"display: inline-block; width: 1px; margin-right: -1px")
return r.setAttribute("cm-text",""),r}function eo(e){if(null!=Jl)return Jl
var t=Xi(e,document.createTextNode("AخA")),r=Xl(t,0,1).getBoundingClientRect(),n=Xl(t,1,2).getBoundingClientRect()
return ji(e),!(!r||r.left==r.right)&&(Jl=n.right-r.right<3)}function to(e){if(null!=ls)return ls
var t=Xi(e,Ki("span","x")),r=t.getBoundingClientRect(),n=Xl(t,0,1).getBoundingClientRect()
return ls=Math.abs(r.left-n.left)>1}function ro(e,t,r,n){if(!e)return n(t,r,"ltr")
for(var i=!1,o=0;o<e.length;++o){var l=e[o];(l.from<r&&l.to>t||t==r&&l.to==t)&&(n(Math.max(l.from,t),Math.min(l.to,r),1==l.level?"rtl":"ltr"),i=!0)}i||n(t,r,"ltr")}function no(e){return e.level%2?e.to:e.from}function io(e){return e.level%2?e.from:e.to}function oo(e){var t=oi(e)
return t?no(t[0]):0}function lo(e){var t=oi(e)
return t?io(Hi(t)):e.text.length}function so(e,t){var r=Jn(e.doc,t),n=bn(r)
n!=r&&(t=ri(n))
var i=oi(n),o=i?i[0].level%2?lo(n):oo(n):0
return Bo(t,o)}function ao(e,t){for(var r,n=Jn(e.doc,t);r=mn(n);)n=r.find(1,!0).line,t=null
var i=oi(n),o=i?i[0].level%2?oo(n):lo(n):n.text.length
return Bo(null==t?ri(n):t,o)}function co(e,t){var r=so(e,t.line),n=Jn(e.doc,r.line),i=oi(n)
if(!i||0==i[0].level){var o=Math.max(0,n.text.search(/\S/)),l=t.line==r.line&&t.ch<=o&&t.ch
return Bo(r.line,l?0:o)}return r}function uo(e,t,r){var n=e[0].level
return t==n||r!=n&&t<r}function fo(e,t){as=null
for(var r,n=0;n<e.length;++n){var i=e[n]
if(i.from<t&&i.to>t)return n
if(i.from==t||i.to==t){if(null!=r)return uo(e,i.level,e[r].level)?(i.from!=i.to&&(as=r),n):(i.from!=i.to&&(as=n),r)
r=n}}return r}function ho(e,t,r,n){if(!n)return t+r
do t+=r
while(t>0&&Vi(e.text.charAt(t)))
return t}function po(e,t,r,n){var i=oi(e)
if(!i)return go(e,t,r,n)
for(var o=fo(i,t),l=i[o],s=ho(e,t,l.level%2?-r:r,n);;){if(s>l.from&&s<l.to)return s
if(s==l.from||s==l.to)return fo(i,s)==o?s:(l=i[o+=r],r>0==l.level%2?l.to:l.from)
if(l=i[o+=r],!l)return null
s=r>0==l.level%2?ho(e,l.to,-1,n):ho(e,l.from,1,n)}}function go(e,t,r,n){var i=t+r
if(n)for(;i>0&&Vi(e.text.charAt(i));)i+=r
return i<0||i>e.text.length?null:i}var vo=navigator.userAgent,mo=navigator.platform,yo=/gecko\/\d/i.test(vo),bo=/MSIE \d/.test(vo),wo=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(vo),xo=bo||wo,Co=xo&&(bo?document.documentMode||6:wo[1]),So=/WebKit\//.test(vo),Lo=So&&/Qt\/\d+\.\d+/.test(vo),Mo=/Chrome\//.test(vo),ko=/Opera\//.test(vo),To=/Apple Computer/.test(navigator.vendor),No=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(vo),Ao=/PhantomJS/.test(vo),Oo=/AppleWebKit/.test(vo)&&/Mobile\/\w+/.test(vo),Wo=Oo||/Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(vo),Do=Oo||/Mac/.test(mo),Ho=/\bCrOS\b/.test(vo),zo=/win/i.test(mo),Eo=ko&&vo.match(/Version\/(\d*\.\d*)/)
Eo&&(Eo=Number(Eo[1])),Eo&&Eo>=15&&(ko=!1,So=!0)
var Po=Do&&(Lo||ko&&(null==Eo||Eo<12.11)),Io=yo||xo&&Co>=9,Ro=!1,Fo=!1
g.prototype=Fi({update:function(e){var t=e.scrollWidth>e.clientWidth+1,r=e.scrollHeight>e.clientHeight+1,n=e.nativeBarWidth
if(r){this.vert.style.display="block",this.vert.style.bottom=t?n+"px":"0"
var i=e.viewHeight-(t?n:0)
this.vert.firstChild.style.height=Math.max(0,e.scrollHeight-e.clientHeight+i)+"px"}else this.vert.style.display="",this.vert.firstChild.style.height="0"
if(t){this.horiz.style.display="block",this.horiz.style.right=r?n+"px":"0",this.horiz.style.left=e.barLeft+"px"
var o=e.viewWidth-e.barLeft-(r?n:0)
this.horiz.firstChild.style.width=e.scrollWidth-e.clientWidth+o+"px"}else this.horiz.style.display="",this.horiz.firstChild.style.width="0"
return!this.checkedZeroWidth&&e.clientHeight>0&&(0==n&&this.zeroWidthHack(),this.checkedZeroWidth=!0),{right:r?n:0,bottom:t?n:0}},setScrollLeft:function(e){this.horiz.scrollLeft!=e&&(this.horiz.scrollLeft=e),this.disableHoriz&&this.enableZeroWidthBar(this.horiz,this.disableHoriz)},setScrollTop:function(e){this.vert.scrollTop!=e&&(this.vert.scrollTop=e),this.disableVert&&this.enableZeroWidthBar(this.vert,this.disableVert)},zeroWidthHack:function(){var e=Do&&!No?"12px":"18px"
this.horiz.style.height=this.vert.style.width=e,this.horiz.style.pointerEvents=this.vert.style.pointerEvents="none",this.disableHoriz=new Wi,this.disableVert=new Wi},enableZeroWidthBar:function(e,t){function r(){var n=e.getBoundingClientRect(),i=document.elementFromPoint(n.left+1,n.bottom-1)
i!=e?e.style.pointerEvents="none":t.set(1e3,r)}e.style.pointerEvents="auto",t.set(1e3,r)},clear:function(){var e=this.horiz.parentNode
e.removeChild(this.horiz),e.removeChild(this.vert)}},g.prototype),v.prototype=Fi({update:function(){return{bottom:0,right:0}},setScrollLeft:function(){},setScrollTop:function(){},clear:function(){}},v.prototype),e.scrollbarModel={native:g,null:v},M.prototype.signal=function(e,t){Ai(e,t)&&this.events.push(arguments)},M.prototype.finish=function(){for(var e=0;e<this.events.length;e++)El.apply(null,this.events[e])}
var Bo=e.Pos=function(e,t){return this instanceof Bo?(this.line=e,void(this.ch=t)):new Bo(e,t)},Uo=e.cmpPos=function(e,t){return e.line-t.line||e.ch-t.ch},Go=null
re.prototype=Fi({init:function(e){function t(e){if(!Ti(n,e)){if(n.somethingSelected())Go={lineWise:!1,text:n.getSelections()},r.inaccurateSelection&&(r.prevInput="",r.inaccurateSelection=!1,o.value=Go.text.join("\n"),jl(o))
else{if(!n.options.lineWiseCopyCut)return
var t=ee(n)
Go={lineWise:!0,text:t.text},"cut"==e.type?n.setSelections(t.ranges,null,Fl):(r.prevInput="",o.value=t.text.join("\n"),jl(o))}"cut"==e.type&&(n.state.cutIncoming=!0)}}var r=this,n=this.cm,i=this.wrapper=ne(),o=this.textarea=i.firstChild
e.wrapper.insertBefore(i,e.wrapper.firstChild),Oo&&(o.style.width="0px"),Dl(o,"input",function(){xo&&Co>=9&&r.hasSelection&&(r.hasSelection=null),r.poll()}),Dl(o,"paste",function(e){Ti(n,e)||J(e,n)||(n.state.pasteIncoming=!0,r.fastPoll())}),Dl(o,"cut",t),Dl(o,"copy",t),Dl(e.scroller,"paste",function(t){Xt(e,t)||Ti(n,t)||(n.state.pasteIncoming=!0,r.focus())}),Dl(e.lineSpace,"selectstart",function(t){Xt(e,t)||Al(t)}),Dl(o,"compositionstart",function(){var e=n.getCursor("from")
r.composing&&r.composing.range.clear(),r.composing={start:e,range:n.markText(e,n.getCursor("to"),{className:"CodeMirror-composing"})}}),Dl(o,"compositionend",function(){r.composing&&(r.poll(),r.composing.range.clear(),r.composing=null)})},prepareSelection:function(){var e=this.cm,t=e.display,r=e.doc,n=Ee(e)
if(e.options.moveInputWithCursor){var i=pt(e,r.sel.primary().head,"div"),o=t.wrapper.getBoundingClientRect(),l=t.lineDiv.getBoundingClientRect()
n.teTop=Math.max(0,Math.min(t.wrapper.clientHeight-10,i.top+l.top-o.top)),n.teLeft=Math.max(0,Math.min(t.wrapper.clientWidth-10,i.left+l.left-o.left))}return n},showSelection:function(e){var t=this.cm,r=t.display
Xi(r.cursorDiv,e.cursors),Xi(r.selectionDiv,e.selection),null!=e.teTop&&(this.wrapper.style.top=e.teTop+"px",this.wrapper.style.left=e.teLeft+"px")},reset:function(e){if(!this.contextMenuPending){var t,r,n=this.cm,i=n.doc
if(n.somethingSelected()){this.prevInput=""
var o=i.sel.primary()
t=os&&(o.to().line-o.from().line>100||(r=n.getSelection()).length>1e3)
var l=t?"-":r||n.getSelection()
this.textarea.value=l,n.state.focused&&jl(this.textarea),xo&&Co>=9&&(this.hasSelection=l)}else e||(this.prevInput=this.textarea.value="",xo&&Co>=9&&(this.hasSelection=null))
this.inaccurateSelection=t}},getField:function(){return this.textarea},supportsTouch:function(){return!1},focus:function(){if("nocursor"!=this.cm.options.readOnly&&(!Wo||Yi()!=this.textarea))try{this.textarea.focus()}catch(e){}},blur:function(){this.textarea.blur()},resetPosition:function(){this.wrapper.style.top=this.wrapper.style.left=0},receivedFocus:function(){this.slowPoll()},slowPoll:function(){var e=this
e.pollingFast||e.polling.set(this.cm.options.pollInterval,function(){e.poll(),e.cm.state.focused&&e.slowPoll()})},fastPoll:function(){function e(){var n=r.poll()
n||t?(r.pollingFast=!1,r.slowPoll()):(t=!0,r.polling.set(60,e))}var t=!1,r=this
r.pollingFast=!0,r.polling.set(20,e)},poll:function(){var e=this.cm,t=this.textarea,r=this.prevInput
if(this.contextMenuPending||!e.state.focused||is(t)&&!r&&!this.composing||e.isReadOnly()||e.options.disableInput||e.state.keySeq)return!1
var n=t.value
if(n==r&&!e.somethingSelected())return!1
if(xo&&Co>=9&&this.hasSelection===n||Do&&/[\uf700-\uf7ff]/.test(n))return e.display.input.reset(),!1
if(e.doc.sel==e.display.selForContextMenu){var i=n.charCodeAt(0)
if(8203!=i||r||(r="​"),8666==i)return this.reset(),this.cm.execCommand("undo")}for(var o=0,l=Math.min(r.length,n.length);o<l&&r.charCodeAt(o)==n.charCodeAt(o);)++o
var s=this
return Ot(e,function(){Z(e,n.slice(o),r.length-o,null,s.composing?"*compose":null),n.length>1e3||n.indexOf("\n")>-1?t.value=s.prevInput="":s.prevInput=n,s.composing&&(s.composing.range.clear(),s.composing.range=e.markText(s.composing.start,e.getCursor("to"),{className:"CodeMirror-composing"}))}),!0},ensurePolled:function(){this.pollingFast&&this.poll()&&(this.pollingFast=!1)},onKeyPress:function(){xo&&Co>=9&&(this.hasSelection=null),this.fastPoll()},onContextMenu:function(e){function t(){if(null!=l.selectionStart){var e=i.somethingSelected(),t="​"+(e?l.value:"")
l.value="⇚",l.value=t,n.prevInput=e?"":"​",l.selectionStart=1,l.selectionEnd=t.length,o.selForContextMenu=i.doc.sel}}function r(){if(n.contextMenuPending=!1,n.wrapper.style.cssText=f,l.style.cssText=u,xo&&Co<9&&o.scrollbars.setScrollTop(o.scroller.scrollTop=a),null!=l.selectionStart){(!xo||xo&&Co<9)&&t()
var e=0,r=function(){o.selForContextMenu==i.doc.sel&&0==l.selectionStart&&l.selectionEnd>0&&"​"==n.prevInput?Wt(i,hl.selectAll)(i):e++<10?o.detectingSelectAll=setTimeout(r,500):o.input.reset()}
o.detectingSelectAll=setTimeout(r,200)}}var n=this,i=n.cm,o=i.display,l=n.textarea,s=Yt(i,e),a=o.scroller.scrollTop
if(s&&!ko){var c=i.options.resetSelectionOnContextMenu
c&&i.doc.sel.contains(s)==-1&&Wt(i,ke)(i.doc,de(s),Fl)
var u=l.style.cssText,f=n.wrapper.style.cssText
n.wrapper.style.cssText="position: absolute"
var h=n.wrapper.getBoundingClientRect()
if(l.style.cssText="position: absolute; width: 30px; height: 30px; top: "+(e.clientY-h.top-5)+"px; left: "+(e.clientX-h.left-5)+"px; z-index: 1000; background: "+(xo?"rgba(255, 255, 255, .05)":"transparent")+"; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);",So)var d=window.scrollY
if(o.input.focus(),So&&window.scrollTo(null,d),o.input.reset(),i.somethingSelected()||(l.value=n.prevInput=" "),n.contextMenuPending=!0,o.selForContextMenu=i.doc.sel,clearTimeout(o.detectingSelectAll),xo&&Co>=9&&t(),Io){Wl(e)
var p=function(){zl(window,"mouseup",p),setTimeout(r,20)}
Dl(window,"mouseup",p)}else setTimeout(r,50)}},readOnlyChanged:function(e){e||this.reset()},setUneditable:Ii,needsContentAttribute:!1},re.prototype),ie.prototype=Fi({init:function(e){function t(e){if(!Ti(n,e)){if(n.somethingSelected())Go={lineWise:!1,text:n.getSelections()},"cut"==e.type&&n.replaceSelection("",null,"cut")
else{if(!n.options.lineWiseCopyCut)return
var t=ee(n)
Go={lineWise:!0,text:t.text},"cut"==e.type&&n.operation(function(){n.setSelections(t.ranges,0,Fl),n.replaceSelection("",null,"cut")})}if(e.clipboardData){e.clipboardData.clearData()
var o=Go.text.join("\n")
if(e.clipboardData.setData("Text",o),e.clipboardData.getData("Text")==o)return void e.preventDefault()}var l=ne(),s=l.firstChild
n.display.lineSpace.insertBefore(l,n.display.lineSpace.firstChild),s.value=Go.text.join("\n")
var a=document.activeElement
jl(s),setTimeout(function(){n.display.lineSpace.removeChild(l),a.focus(),a==i&&r.showPrimarySelection()},50)}}var r=this,n=r.cm,i=r.div=e.lineDiv
te(i,n.options.spellcheck),Dl(i,"paste",function(e){Ti(n,e)||J(e,n)||Co<=11&&setTimeout(Wt(n,function(){r.pollContent()||Pt(n)}),20)}),Dl(i,"compositionstart",function(e){var t=e.data
if(r.composing={sel:n.doc.sel,data:t,startData:t},t){var i=n.doc.sel.primary(),o=n.getLine(i.head.line),l=o.indexOf(t,Math.max(0,i.head.ch-t.length))
l>-1&&l<=i.head.ch&&(r.composing.sel=de(Bo(i.head.line,l),Bo(i.head.line,l+t.length)))}}),Dl(i,"compositionupdate",function(e){r.composing.data=e.data}),Dl(i,"compositionend",function(e){var t=r.composing
t&&(e.data==t.startData||/\u200b/.test(e.data)||(t.data=e.data),setTimeout(function(){t.handled||r.applyComposition(t),r.composing==t&&(r.composing=null)},50))}),Dl(i,"touchstart",function(){r.forceCompositionEnd()}),Dl(i,"input",function(){r.composing||!n.isReadOnly()&&r.pollContent()||Ot(r.cm,function(){Pt(n)})}),Dl(i,"copy",t),Dl(i,"cut",t)},prepareSelection:function(){var e=Ee(this.cm,!1)
return e.focus=this.cm.state.focused,e},showSelection:function(e,t){e&&this.cm.display.view.length&&((e.focus||t)&&this.showPrimarySelection(),this.showMultipleSelections(e))},showPrimarySelection:function(){var e=window.getSelection(),t=this.cm.doc.sel.primary(),r=se(this.cm,e.anchorNode,e.anchorOffset),n=se(this.cm,e.focusNode,e.focusOffset)
if(!r||r.bad||!n||n.bad||0!=Uo(q(r,n),t.from())||0!=Uo(_(r,n),t.to())){var i=oe(this.cm,t.from()),o=oe(this.cm,t.to())
if(i||o){var l=this.cm.display.view,s=e.rangeCount&&e.getRangeAt(0)
if(i){if(!o){var a=l[l.length-1].measure,c=a.maps?a.maps[a.maps.length-1]:a.map
o={node:c[c.length-1],offset:c[c.length-2]-c[c.length-3]}}}else i={node:l[0].measure.map[2],offset:0}
try{var u=Xl(i.node,i.offset,o.offset,o.node)}catch(f){}u&&(!yo&&this.cm.state.focused?(e.collapse(i.node,i.offset),u.collapsed||e.addRange(u)):(e.removeAllRanges(),e.addRange(u)),s&&null==e.anchorNode?e.addRange(s):yo&&this.startGracePeriod()),this.rememberSelection()}}},startGracePeriod:function(){var e=this
clearTimeout(this.gracePeriod),this.gracePeriod=setTimeout(function(){e.gracePeriod=!1,e.selectionChanged()&&e.cm.operation(function(){e.cm.curOp.selectionChanged=!0})},20)},showMultipleSelections:function(e){Xi(this.cm.display.cursorDiv,e.cursors),Xi(this.cm.display.selectionDiv,e.selection)},rememberSelection:function(){var e=window.getSelection()
this.lastAnchorNode=e.anchorNode,this.lastAnchorOffset=e.anchorOffset,this.lastFocusNode=e.focusNode,this.lastFocusOffset=e.focusOffset},selectionInEditor:function(){var e=window.getSelection()
if(!e.rangeCount)return!1
var t=e.getRangeAt(0).commonAncestorContainer
return $l(this.div,t)},focus:function(){"nocursor"!=this.cm.options.readOnly&&this.div.focus()},blur:function(){this.div.blur()},getField:function(){return this.div},supportsTouch:function(){return!0},receivedFocus:function(){function e(){t.cm.state.focused&&(t.pollSelection(),t.polling.set(t.cm.options.pollInterval,e))}var t=this
this.selectionInEditor()?this.pollSelection():Ot(this.cm,function(){t.cm.curOp.selectionChanged=!0}),this.polling.set(this.cm.options.pollInterval,e)},selectionChanged:function(){var e=window.getSelection()
return e.anchorNode!=this.lastAnchorNode||e.anchorOffset!=this.lastAnchorOffset||e.focusNode!=this.lastFocusNode||e.focusOffset!=this.lastFocusOffset},pollSelection:function(){if(!this.composing&&!this.gracePeriod&&this.selectionChanged()){var e=window.getSelection(),t=this.cm
this.rememberSelection()
var r=se(t,e.anchorNode,e.anchorOffset),n=se(t,e.focusNode,e.focusOffset)
r&&n&&Ot(t,function(){ke(t.doc,de(r,n),Fl),(r.bad||n.bad)&&(t.curOp.selectionChanged=!0)})}},pollContent:function(){var e=this.cm,t=e.display,r=e.doc.sel.primary(),n=r.from(),i=r.to()
if(n.line<t.viewFrom||i.line>t.viewTo-1)return!1
var o
if(n.line==t.viewFrom||0==(o=Ft(e,n.line)))var l=ri(t.view[0].line),s=t.view[0].node
else var l=ri(t.view[o].line),s=t.view[o-1].node.nextSibling
var a=Ft(e,i.line)
if(a==t.view.length-1)var c=t.viewTo-1,u=t.lineDiv.lastChild
else var c=ri(t.view[a+1].line)-1,u=t.view[a+1].node.previousSibling
for(var f=e.doc.splitLines(ce(e,s,u,l,c)),h=Qn(e.doc,Bo(l,0),Bo(c,Jn(e.doc,c).text.length));f.length>1&&h.length>1;)if(Hi(f)==Hi(h))f.pop(),h.pop(),c--
else{if(f[0]!=h[0])break
f.shift(),h.shift(),l++}for(var d=0,p=0,g=f[0],v=h[0],m=Math.min(g.length,v.length);d<m&&g.charCodeAt(d)==v.charCodeAt(d);)++d
for(var y=Hi(f),b=Hi(h),w=Math.min(y.length-(1==f.length?d:0),b.length-(1==h.length?d:0));p<w&&y.charCodeAt(y.length-p-1)==b.charCodeAt(b.length-p-1);)++p
f[f.length-1]=y.slice(0,y.length-p),f[0]=f[0].slice(d)
var x=Bo(l,d),C=Bo(c,h.length?Hi(h).length-p:0)
return f.length>1||f[0]||Uo(x,C)?(Dr(e.doc,f,x,C,"+input"),!0):void 0},ensurePolled:function(){this.forceCompositionEnd()},reset:function(){this.forceCompositionEnd()},forceCompositionEnd:function(){this.composing&&!this.composing.handled&&(this.applyComposition(this.composing),this.composing.handled=!0,this.div.blur(),this.div.focus())},applyComposition:function(e){this.cm.isReadOnly()?Wt(this.cm,Pt)(this.cm):e.data&&e.data!=e.startData&&Wt(this.cm,Z)(this.cm,e.data,0,e.sel)},setUneditable:function(e){e.contentEditable="false"},onKeyPress:function(e){e.preventDefault(),this.cm.isReadOnly()||Wt(this.cm,Z)(this.cm,String.fromCharCode(null==e.charCode?e.keyCode:e.charCode),0)},readOnlyChanged:function(e){this.div.contentEditable=String("nocursor"!=e)},onContextMenu:Ii,resetPosition:Ii,needsContentAttribute:!0},ie.prototype),e.inputStyles={textarea:re,contenteditable:ie},ue.prototype={primary:function(){return this.ranges[this.primIndex]},equals:function(e){if(e==this)return!0
if(e.primIndex!=this.primIndex||e.ranges.length!=this.ranges.length)return!1
for(var t=0;t<this.ranges.length;t++){var r=this.ranges[t],n=e.ranges[t]
if(0!=Uo(r.anchor,n.anchor)||0!=Uo(r.head,n.head))return!1}return!0},deepCopy:function(){for(var e=[],t=0;t<this.ranges.length;t++)e[t]=new fe(Y(this.ranges[t].anchor),Y(this.ranges[t].head))
return new ue(e,this.primIndex)},somethingSelected:function(){for(var e=0;e<this.ranges.length;e++)if(!this.ranges[e].empty())return!0
return!1},contains:function(e,t){t||(t=e)
for(var r=0;r<this.ranges.length;r++){var n=this.ranges[r]
if(Uo(t,n.from())>=0&&Uo(e,n.to())<=0)return r}return-1}},fe.prototype={from:function(){return q(this.anchor,this.head)},to:function(){return _(this.anchor,this.head)},empty:function(){return this.head.line==this.anchor.line&&this.head.ch==this.anchor.ch}}
var Vo,Ko,jo,Xo={left:0,right:0,top:0,bottom:0},Yo=null,_o=0,qo=0,$o=0,Zo=null
xo?Zo=-.53:yo?Zo=15:Mo?Zo=-.7:To&&(Zo=-1/3)
var Jo=function(e){var t=e.wheelDeltaX,r=e.wheelDeltaY
return null==t&&e.detail&&e.axis==e.HORIZONTAL_AXIS&&(t=e.detail),null==r&&e.detail&&e.axis==e.VERTICAL_AXIS?r=e.detail:null==r&&(r=e.wheelDelta),{x:t,y:r}}
e.wheelEventPixels=function(e){var t=Jo(e)
return t.x*=Zo,t.y*=Zo,t}
var Qo=new Wi,el=null,tl=e.changeEnd=function(e){return e.text?Bo(e.from.line+e.text.length-1,Hi(e.text).length+(1==e.text.length?e.from.ch:0)):e.to}
e.prototype={constructor:e,focus:function(){window.focus(),this.display.input.focus()},setOption:function(e,t){var r=this.options,n=r[e]
r[e]==t&&"mode"!=e||(r[e]=t,nl.hasOwnProperty(e)&&Wt(this,nl[e])(this,t,n))},getOption:function(e){return this.options[e]},getDoc:function(){return this.doc},addKeyMap:function(e,t){this.state.keyMaps[t?"push":"unshift"](Yr(e))},removeKeyMap:function(e){for(var t=this.state.keyMaps,r=0;r<t.length;++r)if(t[r]==e||t[r].name==e)return t.splice(r,1),!0},addOverlay:Dt(function(t,r){var n=t.token?t:e.getMode(this.options,t)
if(n.startState)throw new Error("Overlays may not be stateful.")
Pi(this.state.overlays,{mode:n,modeSpec:t,opaque:r&&r.opaque,priority:r&&r.priority||0},function(e){return e.priority}),this.state.modeGen++,Pt(this)}),removeOverlay:Dt(function(e){for(var t=this.state.overlays,r=0;r<t.length;++r){var n=t[r].modeSpec
if(n==e||"string"==typeof e&&n.name==e)return t.splice(r,1),this.state.modeGen++,void Pt(this)}}),indentLine:Dt(function(e,t,r){"string"!=typeof t&&"number"!=typeof t&&(t=null==t?this.options.smartIndent?"smart":"prev":t?"add":"subtract"),me(this.doc,e)&&Br(this,e,t,r)}),indentSelection:Dt(function(e){for(var t=this.doc.sel.ranges,r=-1,n=0;n<t.length;n++){var i=t[n]
if(i.empty())i.head.line>r&&(Br(this,i.head.line,e,!0),r=i.head.line,n==this.doc.sel.primIndex&&Rr(this))
else{var o=i.from(),l=i.to(),s=Math.max(r,o.line)
r=Math.min(this.lastLine(),l.line-(l.ch?0:1))+1
for(var a=s;a<r;++a)Br(this,a,e)
var c=this.doc.sel.ranges
0==o.ch&&t.length==c.length&&c[n].from().ch>0&&Ce(this.doc,n,new fe(o,c[n].to()),Fl)}}}),getTokenAt:function(e,t){return Hn(this,e,t)},getLineTokens:function(e,t){return Hn(this,Bo(e),t,!0)},getTokenTypeAt:function(e){e=ge(this.doc,e)
var t,r=Pn(this,Jn(this.doc,e.line)),n=0,i=(r.length-1)/2,o=e.ch
if(0==o)t=r[2]
else for(;;){var l=n+i>>1
if((l?r[2*l-1]:0)>=o)i=l
else{if(!(r[2*l+1]<o)){t=r[2*l+2]
break}n=l+1}}var s=t?t.indexOf("cm-overlay "):-1
return s<0?t:0==s?null:t.slice(0,s-1)},getModeAt:function(t){var r=this.doc.mode
return r.innerMode?e.innerMode(r,this.getTokenAt(t).state).mode:r},getHelper:function(e,t){return this.getHelpers(e,t)[0]},getHelpers:function(e,t){var r=[]
if(!cl.hasOwnProperty(t))return r
var n=cl[t],i=this.getModeAt(e)
if("string"==typeof i[t])n[i[t]]&&r.push(n[i[t]])
else if(i[t])for(var o=0;o<i[t].length;o++){var l=n[i[t][o]]
l&&r.push(l)}else i.helperType&&n[i.helperType]?r.push(n[i.helperType]):n[i.name]&&r.push(n[i.name])
for(var o=0;o<n._global.length;o++){var s=n._global[o]
s.pred(i,this)&&zi(r,s.val)==-1&&r.push(s.val)}return r},getStateAfter:function(e,t){var r=this.doc
return e=pe(r,null==e?r.first+r.size-1:e),Ge(this,e+1,t)},cursorCoords:function(e,t){var r,n=this.doc.sel.primary()
return r=null==e?n.head:"object"==typeof e?ge(this.doc,e):e?n.from():n.to(),pt(this,r,t||"page")},charCoords:function(e,t){return dt(this,ge(this.doc,e),t||"page")},coordsChar:function(e,t){return e=ht(this,e,t||"page"),mt(this,e.left,e.top)},lineAtHeight:function(e,t){return e=ht(this,{top:e,left:0},t||"page").top,ni(this.doc,e+this.display.viewOffset)},heightAtLine:function(e,t){var r,n=!1
if("number"==typeof e){var i=this.doc.first+this.doc.size-1
e<this.doc.first?e=this.doc.first:e>i&&(e=i,n=!0),r=Jn(this.doc,e)}else r=e
return ft(this,r,{top:0,left:0},t||"page").top+(n?this.doc.height-ii(r):0)},defaultTextHeight:function(){return bt(this.display)},defaultCharWidth:function(){return wt(this.display)},setGutterMarker:Dt(function(e,t,r){return Ur(this.doc,e,"gutter",function(e){var n=e.gutterMarkers||(e.gutterMarkers={})
return n[t]=r,!r&&Gi(n)&&(e.gutterMarkers=null),!0})}),clearGutter:Dt(function(e){var t=this,r=t.doc,n=r.first
r.iter(function(r){r.gutterMarkers&&r.gutterMarkers[e]&&(r.gutterMarkers[e]=null,It(t,n,"gutter"),Gi(r.gutterMarkers)&&(r.gutterMarkers=null)),++n})}),lineInfo:function(e){if("number"==typeof e){if(!me(this.doc,e))return null
var t=e
if(e=Jn(this.doc,e),!e)return null}else{var t=ri(e)
if(null==t)return null}return{line:t,handle:e,text:e.text,gutterMarkers:e.gutterMarkers,textClass:e.textClass,bgClass:e.bgClass,wrapClass:e.wrapClass,widgets:e.widgets}},getViewport:function(){return{from:this.display.viewFrom,to:this.display.viewTo}},addWidget:function(e,t,r,n,i){var o=this.display
e=pt(this,ge(this.doc,e))
var l=e.bottom,s=e.left
if(t.style.position="absolute",t.setAttribute("cm-ignore-events","true"),this.display.input.setUneditable(t),o.sizer.appendChild(t),"over"==n)l=e.top
else if("above"==n||"near"==n){var a=Math.max(o.wrapper.clientHeight,this.doc.height),c=Math.max(o.sizer.clientWidth,o.lineSpace.clientWidth);("above"==n||e.bottom+t.offsetHeight>a)&&e.top>t.offsetHeight?l=e.top-t.offsetHeight:e.bottom+t.offsetHeight<=a&&(l=e.bottom),s+t.offsetWidth>c&&(s=c-t.offsetWidth)}t.style.top=l+"px",t.style.left=t.style.right="","right"==i?(s=o.sizer.clientWidth-t.offsetWidth,t.style.right="0px"):("left"==i?s=0:"middle"==i&&(s=(o.sizer.clientWidth-t.offsetWidth)/2),t.style.left=s+"px"),r&&Er(this,s,l,s+t.offsetWidth,l+t.offsetHeight)},triggerOnKeyDown:Dt(hr),triggerOnKeyPress:Dt(gr),triggerOnKeyUp:pr,execCommand:function(e){if(hl.hasOwnProperty(e))return hl[e].call(null,this)},triggerElectric:Dt(function(e){Q(this,e)}),findPosH:function(e,t,r,n){var i=1
t<0&&(i=-1,t=-t)
for(var o=0,l=ge(this.doc,e);o<t&&(l=Vr(this.doc,l,i,r,n),!l.hitSide);++o);return l},moveH:Dt(function(e,t){var r=this
r.extendSelectionsBy(function(n){return r.display.shift||r.doc.extend||n.empty()?Vr(r.doc,n.head,e,t,r.options.rtlMoveVisually):e<0?n.from():n.to()},Ul)}),deleteH:Dt(function(e,t){var r=this.doc.sel,n=this.doc
r.somethingSelected()?n.replaceSelection("",null,"+delete"):Gr(this,function(r){var i=Vr(n,r.head,e,t,!1)
return e<0?{from:i,to:r.head}:{from:r.head,to:i}})}),findPosV:function(e,t,r,n){var i=1,o=n
t<0&&(i=-1,t=-t)
for(var l=0,s=ge(this.doc,e);l<t;++l){var a=pt(this,s,"div")
if(null==o?o=a.left:a.left=o,s=Kr(this,a,i,r),s.hitSide)break}return s},moveV:Dt(function(e,t){var r=this,n=this.doc,i=[],o=!r.display.shift&&!n.extend&&n.sel.somethingSelected()
if(n.extendSelectionsBy(function(l){if(o)return e<0?l.from():l.to()
var s=pt(r,l.head,"div")
null!=l.goalColumn&&(s.left=l.goalColumn),i.push(s.left)
var a=Kr(r,s,e,t)
return"page"==t&&l==n.sel.primary()&&Ir(r,null,dt(r,a,"div").top-s.top),a},Ul),i.length)for(var l=0;l<n.sel.ranges.length;l++)n.sel.ranges[l].goalColumn=i[l]}),findWordAt:function(e){var t=this.doc,r=Jn(t,e.line).text,n=e.ch,i=e.ch
if(r){var o=this.getHelper(e,"wordChars");(e.xRel<0||i==r.length)&&n?--n:++i
for(var l=r.charAt(n),s=Ui(l,o)?function(e){return Ui(e,o)}:/\s/.test(l)?function(e){return/\s/.test(e)}:function(e){return!/\s/.test(e)&&!Ui(e)};n>0&&s(r.charAt(n-1));)--n
for(;i<r.length&&s(r.charAt(i));)++i}return new fe(Bo(e.line,n),Bo(e.line,i))},toggleOverwrite:function(e){null!=e&&e==this.state.overwrite||((this.state.overwrite=!this.state.overwrite)?es(this.display.cursorDiv,"CodeMirror-overwrite"):Ql(this.display.cursorDiv,"CodeMirror-overwrite"),El(this,"overwriteToggle",this,this.state.overwrite))},hasFocus:function(){return this.display.input.getField()==Yi()},isReadOnly:function(){return!(!this.options.readOnly&&!this.doc.cantEdit)},scrollTo:Dt(function(e,t){null==e&&null==t||Fr(this),null!=e&&(this.curOp.scrollLeft=e),null!=t&&(this.curOp.scrollTop=t)}),getScrollInfo:function(){var e=this.display.scroller
return{left:e.scrollLeft,top:e.scrollTop,height:e.scrollHeight-Xe(this)-this.display.barHeight,width:e.scrollWidth-Xe(this)-this.display.barWidth,clientHeight:_e(this),clientWidth:Ye(this)}},scrollIntoView:Dt(function(e,t){if(null==e?(e={from:this.doc.sel.primary().head,to:null},null==t&&(t=this.options.cursorScrollMargin)):"number"==typeof e?e={from:Bo(e,0),to:null}:null==e.from&&(e={from:e,to:null}),e.to||(e.to=e.from),e.margin=t||0,null!=e.from.line)Fr(this),this.curOp.scrollToPos=e
else{var r=Pr(this,Math.min(e.from.left,e.to.left),Math.min(e.from.top,e.to.top)-e.margin,Math.max(e.from.right,e.to.right),Math.max(e.from.bottom,e.to.bottom)+e.margin)
this.scrollTo(r.scrollLeft,r.scrollTop)}}),setSize:Dt(function(e,t){function r(e){return"number"==typeof e||/^\d+$/.test(String(e))?e+"px":e}var n=this
null!=e&&(n.display.wrapper.style.width=r(e)),null!=t&&(n.display.wrapper.style.height=r(t)),n.options.lineWrapping&&st(this)
var i=n.display.viewFrom
n.doc.iter(i,n.display.viewTo,function(e){if(e.widgets)for(var t=0;t<e.widgets.length;t++)if(e.widgets[t].noHScroll){It(n,i,"widget")
break}++i}),n.curOp.forceUpdate=!0,El(n,"refresh",this)}),operation:function(e){return Ot(this,e)},refresh:Dt(function(){var e=this.display.cachedTextHeight
Pt(this),this.curOp.forceUpdate=!0,at(this),this.scrollTo(this.doc.scrollLeft,this.doc.scrollTop),u(this),(null==e||Math.abs(e-bt(this.display))>.5)&&l(this),El(this,"refresh",this)}),swapDoc:Dt(function(e){var t=this.doc
return t.cm=null,Zn(this,e),at(this),this.display.input.reset(),this.scrollTo(e.scrollLeft,e.scrollTop),this.curOp.forceScroll=!0,Mi(this,"swapDoc",this,t),t}),getInputField:function(){return this.display.input.getField()},getWrapperElement:function(){return this.display.wrapper},getScrollerElement:function(){return this.display.scroller},getGutterElement:function(){return this.display.gutters}},Oi(e)
var rl=e.defaults={},nl=e.optionHandlers={},il=e.Init={toString:function(){return"CodeMirror.Init"}}
jr("value","",function(e,t){e.setValue(t)},!0),jr("mode",null,function(e,t){e.doc.modeOption=t,r(e)},!0),jr("indentUnit",2,r,!0),jr("indentWithTabs",!1),jr("smartIndent",!0),jr("tabSize",4,function(e){n(e),at(e),Pt(e)},!0),jr("lineSeparator",null,function(e,t){if(e.doc.lineSep=t,t){var r=[],n=e.doc.first
e.doc.iter(function(e){for(var i=0;;){var o=e.text.indexOf(t,i)
if(o==-1)break
i=o+t.length,r.push(Bo(n,o))}n++})
for(var i=r.length-1;i>=0;i--)Dr(e.doc,t,r[i],Bo(r[i].line,r[i].ch+t.length))}}),jr("specialChars",/[\u0000-\u001f\u007f\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g,function(t,r,n){t.state.specialChars=new RegExp(r.source+(r.test("\t")?"":"|\t"),"g"),n!=e.Init&&t.refresh()}),jr("specialCharPlaceholder",Bn,function(e){e.refresh()},!0),jr("electricChars",!0),jr("inputStyle",Wo?"contenteditable":"textarea",function(){throw new Error("inputStyle can not (yet) be changed in a running editor")},!0),jr("spellcheck",!1,function(e,t){e.getInputField().spellcheck=t},!0),jr("rtlMoveVisually",!zo),jr("wholeLineUpdateBefore",!0),jr("theme","default",function(e){s(e),a(e)},!0),jr("keyMap","default",function(t,r,n){var i=Yr(r),o=n!=e.Init&&Yr(n)
o&&o.detach&&o.detach(t,i),i.attach&&i.attach(t,o||null)}),jr("extraKeys",null),jr("lineWrapping",!1,i,!0),jr("gutters",[],function(e){d(e.options),a(e)},!0),jr("fixedGutter",!0,function(e,t){e.display.gutters.style.left=t?L(e.display)+"px":"0",e.refresh()},!0),jr("coverGutterNextToScrollbar",!1,function(e){y(e)},!0),jr("scrollbarStyle","native",function(e){m(e),y(e),e.display.scrollbars.setScrollTop(e.doc.scrollTop),e.display.scrollbars.setScrollLeft(e.doc.scrollLeft)},!0),jr("lineNumbers",!1,function(e){d(e.options),a(e)},!0),jr("firstLineNumber",1,a,!0),jr("lineNumberFormatter",function(e){return e},a,!0),jr("showCursorWhenSelecting",!1,ze,!0),jr("resetSelectionOnContextMenu",!0),jr("lineWiseCopyCut",!0),jr("readOnly",!1,function(e,t){"nocursor"==t?(yr(e),e.display.input.blur(),e.display.disabled=!0):e.display.disabled=!1,e.display.input.readOnlyChanged(t)}),jr("disableInput",!1,function(e,t){t||e.display.input.reset()},!0),jr("dragDrop",!0,Kt),jr("allowDropFileTypes",null),jr("cursorBlinkRate",530),jr("cursorScrollMargin",0),jr("cursorHeight",1,ze,!0),jr("singleCursorHeightPerLine",!0,ze,!0),jr("workTime",100),jr("workDelay",100),jr("flattenSpans",!0,n,!0),jr("addModeClass",!1,n,!0),jr("pollInterval",100),jr("undoDepth",200,function(e,t){e.doc.history.undoDepth=t}),jr("historyEventDelay",1250),jr("viewportMargin",10,function(e){e.refresh()},!0),jr("maxHighlightLength",1e4,n,!0),jr("moveInputWithCursor",!0,function(e,t){t||e.display.input.resetPosition()}),jr("tabindex",null,function(e,t){e.display.input.getField().tabIndex=t||""}),jr("autofocus",null)
var ol=e.modes={},ll=e.mimeModes={}
e.defineMode=function(t,r){e.defaults.mode||"null"==t||(e.defaults.mode=t),arguments.length>2&&(r.dependencies=Array.prototype.slice.call(arguments,2)),ol[t]=r},e.defineMIME=function(e,t){ll[e]=t},e.resolveMode=function(t){if("string"==typeof t&&ll.hasOwnProperty(t))t=ll[t]
else if(t&&"string"==typeof t.name&&ll.hasOwnProperty(t.name)){var r=ll[t.name]
"string"==typeof r&&(r={name:r}),t=Ri(r,t),t.name=r.name}else{if("string"==typeof t&&/^[\w\-]+\/[\w\-]+\+xml$/.test(t))return e.resolveMode("application/xml")
if("string"==typeof t&&/^[\w\-]+\/[\w\-]+\+json$/.test(t))return e.resolveMode("application/json")}return"string"==typeof t?{name:t}:t||{name:"null"}},e.getMode=function(t,r){var r=e.resolveMode(r),n=ol[r.name]
if(!n)return e.getMode(t,"text/plain")
var i=n(t,r)
if(sl.hasOwnProperty(r.name)){var o=sl[r.name]
for(var l in o)o.hasOwnProperty(l)&&(i.hasOwnProperty(l)&&(i["_"+l]=i[l]),i[l]=o[l])}if(i.name=r.name,r.helperType&&(i.helperType=r.helperType),r.modeProps)for(var l in r.modeProps)i[l]=r.modeProps[l]
return i},e.defineMode("null",function(){return{token:function(e){e.skipToEnd()}}}),e.defineMIME("text/plain","null")
var sl=e.modeExtensions={}
e.extendMode=function(e,t){var r=sl.hasOwnProperty(e)?sl[e]:sl[e]={}
Fi(t,r)},e.defineExtension=function(t,r){e.prototype[t]=r},e.defineDocExtension=function(e,t){kl.prototype[e]=t},e.defineOption=jr
var al=[]
e.defineInitHook=function(e){al.push(e)}
var cl=e.helpers={}
e.registerHelper=function(t,r,n){cl.hasOwnProperty(t)||(cl[t]=e[t]={_global:[]}),cl[t][r]=n},e.registerGlobalHelper=function(t,r,n,i){e.registerHelper(t,r,i),cl[t]._global.push({pred:n,val:i})}
var ul=e.copyState=function(e,t){if(t===!0)return t
if(e.copyState)return e.copyState(t)
var r={}
for(var n in t){var i=t[n]
i instanceof Array&&(i=i.concat([])),r[n]=i}return r},fl=e.startState=function(e,t,r){return!e.startState||e.startState(t,r)}
e.innerMode=function(e,t){for(;e.innerMode;){var r=e.innerMode(t)
if(!r||r.mode==e)break
t=r.state,e=r.mode}return r||{mode:e,state:t}}
var hl=e.commands={selectAll:function(e){e.setSelection(Bo(e.firstLine(),0),Bo(e.lastLine()),Fl)},singleSelection:function(e){e.setSelection(e.getCursor("anchor"),e.getCursor("head"),Fl)},killLine:function(e){Gr(e,function(t){if(t.empty()){var r=Jn(e.doc,t.head.line).text.length
return t.head.ch==r&&t.head.line<e.lastLine()?{from:t.head,to:Bo(t.head.line+1,0)}:{from:t.head,to:Bo(t.head.line,r)}}return{from:t.from(),to:t.to()}})},deleteLine:function(e){Gr(e,function(t){return{from:Bo(t.from().line,0),to:ge(e.doc,Bo(t.to().line+1,0))}})},delLineLeft:function(e){Gr(e,function(e){return{from:Bo(e.from().line,0),to:e.from()}})},delWrappedLineLeft:function(e){Gr(e,function(t){var r=e.charCoords(t.head,"div").top+5,n=e.coordsChar({left:0,top:r},"div")
return{from:n,to:t.from()}})},delWrappedLineRight:function(e){Gr(e,function(t){var r=e.charCoords(t.head,"div").top+5,n=e.coordsChar({left:e.display.lineDiv.offsetWidth+100,top:r},"div")
return{from:t.from(),to:n}})},undo:function(e){e.undo()},redo:function(e){e.redo()},undoSelection:function(e){e.undoSelection()},redoSelection:function(e){e.redoSelection()},goDocStart:function(e){e.extendSelection(Bo(e.firstLine(),0))},goDocEnd:function(e){e.extendSelection(Bo(e.lastLine()))},goLineStart:function(e){e.extendSelectionsBy(function(t){return so(e,t.head.line)},{origin:"+move",bias:1})},goLineStartSmart:function(e){e.extendSelectionsBy(function(t){return co(e,t.head)},{origin:"+move",bias:1})},goLineEnd:function(e){e.extendSelectionsBy(function(t){return ao(e,t.head.line)},{origin:"+move",bias:-1})},goLineRight:function(e){e.extendSelectionsBy(function(t){var r=e.charCoords(t.head,"div").top+5
return e.coordsChar({left:e.display.lineDiv.offsetWidth+100,top:r},"div")},Ul)},goLineLeft:function(e){e.extendSelectionsBy(function(t){var r=e.charCoords(t.head,"div").top+5
return e.coordsChar({left:0,top:r},"div")},Ul)},goLineLeftSmart:function(e){e.extendSelectionsBy(function(t){var r=e.charCoords(t.head,"div").top+5,n=e.coordsChar({left:0,top:r},"div")
return n.ch<e.getLine(n.line).search(/\S/)?co(e,t.head):n},Ul)},goLineUp:function(e){e.moveV(-1,"line")},goLineDown:function(e){e.moveV(1,"line")},goPageUp:function(e){e.moveV(-1,"page")},goPageDown:function(e){e.moveV(1,"page")},goCharLeft:function(e){e.moveH(-1,"char")},goCharRight:function(e){e.moveH(1,"char")},goColumnLeft:function(e){e.moveH(-1,"column")},goColumnRight:function(e){e.moveH(1,"column")},goWordLeft:function(e){e.moveH(-1,"word")},goGroupRight:function(e){e.moveH(1,"group")},goGroupLeft:function(e){e.moveH(-1,"group")},goWordRight:function(e){e.moveH(1,"word")},delCharBefore:function(e){e.deleteH(-1,"char")},delCharAfter:function(e){e.deleteH(1,"char")},delWordBefore:function(e){e.deleteH(-1,"word")},delWordAfter:function(e){e.deleteH(1,"word")},delGroupBefore:function(e){e.deleteH(-1,"group")},delGroupAfter:function(e){e.deleteH(1,"group")},indentAuto:function(e){e.indentSelection("smart")},indentMore:function(e){e.indentSelection("add")},indentLess:function(e){e.indentSelection("subtract")},insertTab:function(e){e.replaceSelection("\t")},insertSoftTab:function(e){for(var t=[],r=e.listSelections(),n=e.options.tabSize,i=0;i<r.length;i++){var o=r[i].from(),l=Gl(e.getLine(o.line),o.ch,n)
t.push(Di(n-l%n))}e.replaceSelections(t)},defaultTab:function(e){e.somethingSelected()?e.indentSelection("add"):e.execCommand("insertTab")},transposeChars:function(e){Ot(e,function(){for(var t=e.listSelections(),r=[],n=0;n<t.length;n++){var i=t[n].head,o=Jn(e.doc,i.line).text
if(o)if(i.ch==o.length&&(i=new Bo(i.line,i.ch-1)),i.ch>0)i=new Bo(i.line,i.ch+1),e.replaceRange(o.charAt(i.ch-1)+o.charAt(i.ch-2),Bo(i.line,i.ch-2),i,"+transpose")
else if(i.line>e.doc.first){var l=Jn(e.doc,i.line-1).text
l&&e.replaceRange(o.charAt(0)+e.doc.lineSeparator()+l.charAt(l.length-1),Bo(i.line-1,l.length-1),Bo(i.line,1),"+transpose")}r.push(new fe(i,i))}e.setSelections(r)})},newlineAndIndent:function(e){Ot(e,function(){for(var t=e.listSelections().length,r=0;r<t;r++){var n=e.listSelections()[r]
e.replaceRange(e.doc.lineSeparator(),n.anchor,n.head,"+input"),e.indentLine(n.from().line+1,null,!0)}Rr(e)})},openLine:function(e){e.replaceSelection("\n","start")},toggleOverwrite:function(e){e.toggleOverwrite()}},dl=e.keyMap={}
dl.basic={Left:"goCharLeft",Right:"goCharRight",Up:"goLineUp",Down:"goLineDown",End:"goLineEnd",Home:"goLineStartSmart",PageUp:"goPageUp",PageDown:"goPageDown",Delete:"delCharAfter",Backspace:"delCharBefore","Shift-Backspace":"delCharBefore",Tab:"defaultTab","Shift-Tab":"indentAuto",Enter:"newlineAndIndent",Insert:"toggleOverwrite",Esc:"singleSelection"},dl.pcDefault={"Ctrl-A":"selectAll","Ctrl-D":"deleteLine","Ctrl-Z":"undo","Shift-Ctrl-Z":"redo","Ctrl-Y":"redo","Ctrl-Home":"goDocStart","Ctrl-End":"goDocEnd","Ctrl-Up":"goLineUp","Ctrl-Down":"goLineDown","Ctrl-Left":"goGroupLeft","Ctrl-Right":"goGroupRight","Alt-Left":"goLineStart","Alt-Right":"goLineEnd","Ctrl-Backspace":"delGroupBefore","Ctrl-Delete":"delGroupAfter","Ctrl-S":"save","Ctrl-F":"find","Ctrl-G":"findNext","Shift-Ctrl-G":"findPrev","Shift-Ctrl-F":"replace","Shift-Ctrl-R":"replaceAll","Ctrl-[":"indentLess","Ctrl-]":"indentMore","Ctrl-U":"undoSelection","Shift-Ctrl-U":"redoSelection","Alt-U":"redoSelection",fallthrough:"basic"},dl.emacsy={"Ctrl-F":"goCharRight","Ctrl-B":"goCharLeft","Ctrl-P":"goLineUp","Ctrl-N":"goLineDown","Alt-F":"goWordRight","Alt-B":"goWordLeft","Ctrl-A":"goLineStart","Ctrl-E":"goLineEnd","Ctrl-V":"goPageDown","Shift-Ctrl-V":"goPageUp","Ctrl-D":"delCharAfter","Ctrl-H":"delCharBefore","Alt-D":"delWordAfter","Alt-Backspace":"delWordBefore","Ctrl-K":"killLine","Ctrl-T":"transposeChars","Ctrl-O":"openLine"},dl.macDefault={"Cmd-A":"selectAll","Cmd-D":"deleteLine","Cmd-Z":"undo","Shift-Cmd-Z":"redo","Cmd-Y":"redo","Cmd-Home":"goDocStart","Cmd-Up":"goDocStart","Cmd-End":"goDocEnd","Cmd-Down":"goDocEnd","Alt-Left":"goGroupLeft","Alt-Right":"goGroupRight","Cmd-Left":"goLineLeft","Cmd-Right":"goLineRight","Alt-Backspace":"delGroupBefore","Ctrl-Alt-Backspace":"delGroupAfter","Alt-Delete":"delGroupAfter","Cmd-S":"save","Cmd-F":"find","Cmd-G":"findNext","Shift-Cmd-G":"findPrev","Cmd-Alt-F":"replace","Shift-Cmd-Alt-F":"replaceAll","Cmd-[":"indentLess","Cmd-]":"indentMore","Cmd-Backspace":"delWrappedLineLeft","Cmd-Delete":"delWrappedLineRight","Cmd-U":"undoSelection","Shift-Cmd-U":"redoSelection","Ctrl-Up":"goDocStart","Ctrl-Down":"goDocEnd",fallthrough:["basic","emacsy"]},dl["default"]=Do?dl.macDefault:dl.pcDefault,e.normalizeKeyMap=function(e){var t={}
for(var r in e)if(e.hasOwnProperty(r)){var n=e[r]
if(/^(name|fallthrough|(de|at)tach)$/.test(r))continue
if("..."==n){delete e[r]
continue}for(var i=Ei(r.split(" "),Xr),o=0;o<i.length;o++){var l,s
o==i.length-1?(s=i.join(" "),l=n):(s=i.slice(0,o+1).join(" "),l="...")
var a=t[s]
if(a){if(a!=l)throw new Error("Inconsistent bindings for "+s)}else t[s]=l}delete e[r]}for(var c in t)e[c]=t[c]
return e}
var pl=e.lookupKey=function(e,t,r,n){t=Yr(t)
var i=t.call?t.call(e,n):t[e]
if(i===!1)return"nothing"
if("..."===i)return"multi"
if(null!=i&&r(i))return"handled"
if(t.fallthrough){if("[object Array]"!=Object.prototype.toString.call(t.fallthrough))return pl(e,t.fallthrough,r,n)
for(var o=0;o<t.fallthrough.length;o++){var l=pl(e,t.fallthrough[o],r,n)
if(l)return l}}},gl=e.isModifierKey=function(e){var t="string"==typeof e?e:ss[e.keyCode]
return"Ctrl"==t||"Alt"==t||"Shift"==t||"Mod"==t},vl=e.keyName=function(e,t){if(ko&&34==e.keyCode&&e["char"])return!1
var r=ss[e.keyCode],n=r
return null!=n&&!e.altGraphKey&&(e.altKey&&"Alt"!=r&&(n="Alt-"+n),(Po?e.metaKey:e.ctrlKey)&&"Ctrl"!=r&&(n="Ctrl-"+n),(Po?e.ctrlKey:e.metaKey)&&"Cmd"!=r&&(n="Cmd-"+n),!t&&e.shiftKey&&"Shift"!=r&&(n="Shift-"+n),n)}
e.fromTextArea=function(t,r){function n(){t.value=c.getValue()}if(r=r?Fi(r):{},r.value=t.value,!r.tabindex&&t.tabIndex&&(r.tabindex=t.tabIndex),!r.placeholder&&t.placeholder&&(r.placeholder=t.placeholder),null==r.autofocus){var i=Yi()
r.autofocus=i==t||null!=t.getAttribute("autofocus")&&i==document.body}if(t.form&&(Dl(t.form,"submit",n),!r.leaveSubmitMethodAlone)){var o=t.form,l=o.submit
try{var s=o.submit=function(){n(),o.submit=l,o.submit(),o.submit=s}}catch(a){}}r.finishInit=function(e){e.save=n,e.getTextArea=function(){return t},e.toTextArea=function(){e.toTextArea=isNaN,n(),t.parentNode.removeChild(e.getWrapperElement()),t.style.display="",t.form&&(zl(t.form,"submit",n),"function"==typeof t.form.submit&&(t.form.submit=l))}},t.style.display="none"
var c=e(function(e){t.parentNode.insertBefore(e,t.nextSibling)},r)
return c}
var ml=e.StringStream=function(e,t){this.pos=this.start=0,this.string=e,this.tabSize=t||8,this.lastColumnPos=this.lastColumnValue=0,this.lineStart=0}
ml.prototype={eol:function(){return this.pos>=this.string.length},sol:function(){return this.pos==this.lineStart},peek:function(){return this.string.charAt(this.pos)||void 0},next:function(){if(this.pos<this.string.length)return this.string.charAt(this.pos++)},eat:function(e){var t=this.string.charAt(this.pos)
if("string"==typeof e)var r=t==e
else var r=t&&(e.test?e.test(t):e(t))
if(r)return++this.pos,t},eatWhile:function(e){for(var t=this.pos;this.eat(e););return this.pos>t},eatSpace:function(){for(var e=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos
return this.pos>e},skipToEnd:function(){this.pos=this.string.length},skipTo:function(e){var t=this.string.indexOf(e,this.pos)
if(t>-1)return this.pos=t,!0},backUp:function(e){this.pos-=e},column:function(){return this.lastColumnPos<this.start&&(this.lastColumnValue=Gl(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),this.lastColumnPos=this.start),this.lastColumnValue-(this.lineStart?Gl(this.string,this.lineStart,this.tabSize):0)},indentation:function(){return Gl(this.string,null,this.tabSize)-(this.lineStart?Gl(this.string,this.lineStart,this.tabSize):0)},match:function(e,t,r){if("string"!=typeof e){var n=this.string.slice(this.pos).match(e)
return n&&n.index>0?null:(n&&t!==!1&&(this.pos+=n[0].length),n)}var i=function(e){return r?e.toLowerCase():e},o=this.string.substr(this.pos,e.length)
if(i(o)==i(e))return t!==!1&&(this.pos+=e.length),!0},current:function(){return this.string.slice(this.start,this.pos)},hideFirstChars:function(e,t){this.lineStart+=e
try{return t()}finally{this.lineStart-=e}}}
var yl=0,bl=e.TextMarker=function(e,t){this.lines=[],this.type=t,this.doc=e,this.id=++yl}
Oi(bl),bl.prototype.clear=function(){if(!this.explicitlyCleared){var e=this.doc.cm,t=e&&!e.curOp
if(t&&xt(e),Ai(this,"clear")){var r=this.find()
r&&Mi(this,"clear",r.from,r.to)}for(var n=null,i=null,o=0;o<this.lines.length;++o){var l=this.lines[o],s=en(l.markedSpans,this)
e&&!this.collapsed?It(e,ri(l),"text"):e&&(null!=s.to&&(i=ri(l)),null!=s.from&&(n=ri(l))),l.markedSpans=tn(l.markedSpans,s),null==s.from&&this.collapsed&&!Sn(this.doc,l)&&e&&ti(l,bt(e.display))}if(e&&this.collapsed&&!e.options.lineWrapping)for(var o=0;o<this.lines.length;++o){var a=bn(this.lines[o]),c=f(a)
c>e.display.maxLineLength&&(e.display.maxLine=a,e.display.maxLineLength=c,e.display.maxLineChanged=!0)}null!=n&&e&&this.collapsed&&Pt(e,n,i+1),this.lines.length=0,this.explicitlyCleared=!0,this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1,e&&Ae(e.doc)),e&&Mi(e,"markerCleared",e,this),t&&St(e),this.parent&&this.parent.clear()}},bl.prototype.find=function(e,t){null==e&&"bookmark"==this.type&&(e=1)
for(var r,n,i=0;i<this.lines.length;++i){var o=this.lines[i],l=en(o.markedSpans,this)
if(null!=l.from&&(r=Bo(t?o:ri(o),l.from),e==-1))return r
if(null!=l.to&&(n=Bo(t?o:ri(o),l.to),1==e))return n}return r&&{from:r,to:n}},bl.prototype.changed=function(){var e=this.find(-1,!0),t=this,r=this.doc.cm
e&&r&&Ot(r,function(){var n=e.line,i=ri(e.line),o=Qe(r,i)
if(o&&(lt(o),r.curOp.selectionChanged=r.curOp.forceUpdate=!0),r.curOp.updateMaxLine=!0,!Sn(t.doc,n)&&null!=t.height){var l=t.height
t.height=null
var s=kn(t)-l
s&&ti(n,n.height+s)}})},bl.prototype.attachLine=function(e){if(!this.lines.length&&this.doc.cm){var t=this.doc.cm.curOp
t.maybeHiddenMarkers&&zi(t.maybeHiddenMarkers,this)!=-1||(t.maybeUnhiddenMarkers||(t.maybeUnhiddenMarkers=[])).push(this)}this.lines.push(e)},bl.prototype.detachLine=function(e){if(this.lines.splice(zi(this.lines,e),1),!this.lines.length&&this.doc.cm){var t=this.doc.cm.curOp;(t.maybeHiddenMarkers||(t.maybeHiddenMarkers=[])).push(this)}}
var yl=0,wl=e.SharedTextMarker=function(e,t){this.markers=e,this.primary=t
for(var r=0;r<e.length;++r)e[r].parent=this}
Oi(wl),wl.prototype.clear=function(){if(!this.explicitlyCleared){this.explicitlyCleared=!0
for(var e=0;e<this.markers.length;++e)this.markers[e].clear()
Mi(this,"clear")}},wl.prototype.find=function(e,t){return this.primary.find(e,t)}
var xl=e.LineWidget=function(e,t,r){if(r)for(var n in r)r.hasOwnProperty(n)&&(this[n]=r[n])
this.doc=e,this.node=t}
Oi(xl),xl.prototype.clear=function(){var e=this.doc.cm,t=this.line.widgets,r=this.line,n=ri(r)
if(null!=n&&t){for(var i=0;i<t.length;++i)t[i]==this&&t.splice(i--,1)
t.length||(r.widgets=null)
var o=kn(this)
ti(r,Math.max(0,r.height-o)),e&&Ot(e,function(){Mn(e,r,-o),It(e,n,"widget")})}},xl.prototype.changed=function(){var e=this.height,t=this.doc.cm,r=this.line
this.height=null
var n=kn(this)-e
n&&(ti(r,r.height+n),t&&Ot(t,function(){t.curOp.forceUpdate=!0,Mn(t,r,n)}))}
var Cl=e.Line=function(e,t,r){this.text=e,fn(this,t),this.height=r?r(this):1}
Oi(Cl),Cl.prototype.lineNo=function(){return ri(this)}
var Sl={},Ll={}
_n.prototype={chunkSize:function(){return this.lines.length},removeInner:function(e,t){for(var r=e,n=e+t;r<n;++r){var i=this.lines[r]
this.height-=i.height,An(i),Mi(i,"delete")}this.lines.splice(e,t)},collapse:function(e){e.push.apply(e,this.lines)},insertInner:function(e,t,r){this.height+=r,this.lines=this.lines.slice(0,e).concat(t).concat(this.lines.slice(e))
for(var n=0;n<t.length;++n)t[n].parent=this},iterN:function(e,t,r){for(var n=e+t;e<n;++e)if(r(this.lines[e]))return!0}},qn.prototype={chunkSize:function(){return this.size},removeInner:function(e,t){this.size-=t
for(var r=0;r<this.children.length;++r){var n=this.children[r],i=n.chunkSize()
if(e<i){var o=Math.min(t,i-e),l=n.height
if(n.removeInner(e,o),this.height-=l-n.height,i==o&&(this.children.splice(r--,1),n.parent=null),0==(t-=o))break
e=0}else e-=i}if(this.size-t<25&&(this.children.length>1||!(this.children[0]instanceof _n))){var s=[]
this.collapse(s),this.children=[new _n(s)],this.children[0].parent=this}},collapse:function(e){for(var t=0;t<this.children.length;++t)this.children[t].collapse(e)},insertInner:function(e,t,r){this.size+=t.length,this.height+=r
for(var n=0;n<this.children.length;++n){var i=this.children[n],o=i.chunkSize()
if(e<=o){if(i.insertInner(e,t,r),i.lines&&i.lines.length>50){for(var l=i.lines.length%25+25,s=l;s<i.lines.length;){var a=new _n(i.lines.slice(s,s+=25))
i.height-=a.height,this.children.splice(++n,0,a),a.parent=this}i.lines=i.lines.slice(0,l),this.maybeSpill()}break}e-=o}},maybeSpill:function(){if(!(this.children.length<=10)){var e=this
do{var t=e.children.splice(e.children.length-5,5),r=new qn(t)
if(e.parent){e.size-=r.size,e.height-=r.height
var n=zi(e.parent.children,e)
e.parent.children.splice(n+1,0,r)}else{var i=new qn(e.children)
i.parent=e,e.children=[i,r],e=i}r.parent=e.parent}while(e.children.length>10)
e.parent.maybeSpill()}},iterN:function(e,t,r){for(var n=0;n<this.children.length;++n){var i=this.children[n],o=i.chunkSize()
if(e<o){var l=Math.min(t,o-e)
if(i.iterN(e,l,r))return!0
if(0==(t-=l))break
e=0}else e-=o}}}
var Ml=0,kl=e.Doc=function(e,t,r,n){if(!(this instanceof kl))return new kl(e,t,r,n)
null==r&&(r=0),qn.call(this,[new _n([new Cl("",null)])]),this.first=r,this.scrollTop=this.scrollLeft=0,this.cantEdit=!1,this.cleanGeneration=1,this.frontier=r
var i=Bo(r,0)
this.sel=de(i),this.history=new li(null),this.id=++Ml,this.modeOption=t,this.lineSep=n,this.extend=!1,"string"==typeof e&&(e=this.splitLines(e)),Yn(this,{from:i,to:i,text:e}),ke(this,de(i),Fl)}
kl.prototype=Ri(qn.prototype,{constructor:kl,iter:function(e,t,r){r?this.iterN(e-this.first,t-e,r):this.iterN(this.first,this.first+this.size,e)},insert:function(e,t){for(var r=0,n=0;n<t.length;++n)r+=t[n].height
this.insertInner(e-this.first,t,r)},remove:function(e,t){this.removeInner(e-this.first,t)},getValue:function(e){var t=ei(this,this.first,this.first+this.size)
return e===!1?t:t.join(e||this.lineSeparator())},setValue:Ht(function(e){var t=Bo(this.first,0),r=this.first+this.size-1
kr(this,{from:t,to:Bo(r,Jn(this,r).text.length),text:this.splitLines(e),origin:"setValue",full:!0},!0),ke(this,de(t))}),replaceRange:function(e,t,r,n){t=ge(this,t),r=r?ge(this,r):t,Dr(this,e,t,r,n)},getRange:function(e,t,r){var n=Qn(this,ge(this,e),ge(this,t))
return r===!1?n:n.join(r||this.lineSeparator())},getLine:function(e){var t=this.getLineHandle(e)
return t&&t.text},getLineHandle:function(e){if(me(this,e))return Jn(this,e)},getLineNumber:function(e){return ri(e)},getLineHandleVisualStart:function(e){return"number"==typeof e&&(e=Jn(this,e)),bn(e)},lineCount:function(){return this.size},firstLine:function(){return this.first},lastLine:function(){return this.first+this.size-1},clipPos:function(e){return ge(this,e)},getCursor:function(e){var t,r=this.sel.primary()
return t=null==e||"head"==e?r.head:"anchor"==e?r.anchor:"end"==e||"to"==e||e===!1?r.to():r.from()},listSelections:function(){return this.sel.ranges},somethingSelected:function(){return this.sel.somethingSelected()},setCursor:Ht(function(e,t,r){Se(this,ge(this,"number"==typeof e?Bo(e,t||0):e),null,r)}),setSelection:Ht(function(e,t,r){Se(this,ge(this,e),ge(this,t||e),r)}),extendSelection:Ht(function(e,t,r){we(this,ge(this,e),t&&ge(this,t),r)}),extendSelections:Ht(function(e,t){xe(this,ye(this,e),t)}),extendSelectionsBy:Ht(function(e,t){var r=Ei(this.sel.ranges,e)
xe(this,ye(this,r),t)}),setSelections:Ht(function(e,t,r){if(e.length){for(var n=0,i=[];n<e.length;n++)i[n]=new fe(ge(this,e[n].anchor),ge(this,e[n].head))
null==t&&(t=Math.min(e.length-1,this.sel.primIndex)),ke(this,he(i,t),r)}}),addSelection:Ht(function(e,t,r){var n=this.sel.ranges.slice(0)
n.push(new fe(ge(this,e),ge(this,t||e))),ke(this,he(n,n.length-1),r)}),getSelection:function(e){for(var t,r=this.sel.ranges,n=0;n<r.length;n++){var i=Qn(this,r[n].from(),r[n].to())
t=t?t.concat(i):i}return e===!1?t:t.join(e||this.lineSeparator())},getSelections:function(e){for(var t=[],r=this.sel.ranges,n=0;n<r.length;n++){var i=Qn(this,r[n].from(),r[n].to())
e!==!1&&(i=i.join(e||this.lineSeparator())),t[n]=i}return t},replaceSelection:function(e,t,r){for(var n=[],i=0;i<this.sel.ranges.length;i++)n[i]=e
this.replaceSelections(n,t,r||"+input")},replaceSelections:Ht(function(e,t,r){for(var n=[],i=this.sel,o=0;o<i.ranges.length;o++){var l=i.ranges[o]
n[o]={from:l.from(),to:l.to(),text:this.splitLines(e[o]),origin:r}}for(var s=t&&"end"!=t&&Lr(this,n,t),o=n.length-1;o>=0;o--)kr(this,n[o])
s?Me(this,s):this.cm&&Rr(this.cm)}),undo:Ht(function(){Nr(this,"undo")}),redo:Ht(function(){Nr(this,"redo")}),undoSelection:Ht(function(){Nr(this,"undo",!0)}),redoSelection:Ht(function(){Nr(this,"redo",!0)}),setExtending:function(e){this.extend=e},getExtending:function(){return this.extend},historySize:function(){for(var e=this.history,t=0,r=0,n=0;n<e.done.length;n++)e.done[n].ranges||++t
for(var n=0;n<e.undone.length;n++)e.undone[n].ranges||++r
return{undo:t,redo:r}},clearHistory:function(){this.history=new li(this.history.maxGeneration)},markClean:function(){this.cleanGeneration=this.changeGeneration(!0)},changeGeneration:function(e){return e&&(this.history.lastOp=this.history.lastSelOp=this.history.lastOrigin=null),this.history.generation},isClean:function(e){return this.history.generation==(e||this.cleanGeneration)},getHistory:function(){return{done:mi(this.history.done),undone:mi(this.history.undone)}},setHistory:function(e){var t=this.history=new li(this.history.maxGeneration)
t.done=mi(e.done.slice(0),null,!0),t.undone=mi(e.undone.slice(0),null,!0)},addLineClass:Ht(function(e,t,r){return Ur(this,e,"gutter"==t?"gutter":"class",function(e){var n="text"==t?"textClass":"background"==t?"bgClass":"gutter"==t?"gutterClass":"wrapClass"
if(e[n]){if(_i(r).test(e[n]))return!1
e[n]+=" "+r}else e[n]=r
return!0})}),removeLineClass:Ht(function(e,t,r){return Ur(this,e,"gutter"==t?"gutter":"class",function(e){var n="text"==t?"textClass":"background"==t?"bgClass":"gutter"==t?"gutterClass":"wrapClass",i=e[n]
if(!i)return!1
if(null==r)e[n]=null
else{var o=i.match(_i(r))
if(!o)return!1
var l=o.index+o[0].length
e[n]=i.slice(0,o.index)+(o.index&&l!=i.length?" ":"")+i.slice(l)||null}return!0})}),addLineWidget:Ht(function(e,t,r){return Tn(this,e,t,r)}),removeLineWidget:function(e){e.clear()},markText:function(e,t,r){return _r(this,ge(this,e),ge(this,t),r,r&&r.type||"range")},setBookmark:function(e,t){var r={replacedWith:t&&(null==t.nodeType?t.widget:t),insertLeft:t&&t.insertLeft,clearWhenEmpty:!1,shared:t&&t.shared,handleMouseEvents:t&&t.handleMouseEvents}
return e=ge(this,e),_r(this,e,e,r,"bookmark")},findMarksAt:function(e){e=ge(this,e)
var t=[],r=Jn(this,e.line).markedSpans
if(r)for(var n=0;n<r.length;++n){var i=r[n];(null==i.from||i.from<=e.ch)&&(null==i.to||i.to>=e.ch)&&t.push(i.marker.parent||i.marker)}return t},findMarks:function(e,t,r){e=ge(this,e),t=ge(this,t)
var n=[],i=e.line
return this.iter(e.line,t.line+1,function(o){var l=o.markedSpans
if(l)for(var s=0;s<l.length;s++){var a=l[s]
null!=a.to&&i==e.line&&e.ch>=a.to||null==a.from&&i!=e.line||null!=a.from&&i==t.line&&a.from>=t.ch||r&&!r(a.marker)||n.push(a.marker.parent||a.marker)}++i}),n},getAllMarks:function(){var e=[]
return this.iter(function(t){var r=t.markedSpans
if(r)for(var n=0;n<r.length;++n)null!=r[n].from&&e.push(r[n].marker)}),e},posFromIndex:function(e){var t,r=this.first,n=this.lineSeparator().length
return this.iter(function(i){var o=i.text.length+n
return o>e?(t=e,!0):(e-=o,void++r)}),ge(this,Bo(r,t))},indexFromPos:function(e){e=ge(this,e)
var t=e.ch
if(e.line<this.first||e.ch<0)return 0
var r=this.lineSeparator().length
return this.iter(this.first,e.line,function(e){t+=e.text.length+r}),t},copy:function(e){var t=new kl(ei(this,this.first,this.first+this.size),this.modeOption,this.first,this.lineSep)
return t.scrollTop=this.scrollTop,t.scrollLeft=this.scrollLeft,t.sel=this.sel,t.extend=!1,e&&(t.history.undoDepth=this.history.undoDepth,t.setHistory(this.getHistory())),t},linkedDoc:function(e){e||(e={})
var t=this.first,r=this.first+this.size
null!=e.from&&e.from>t&&(t=e.from),null!=e.to&&e.to<r&&(r=e.to)
var n=new kl(ei(this,t,r),e.mode||this.modeOption,t,this.lineSep)
return e.sharedHist&&(n.history=this.history),(this.linked||(this.linked=[])).push({doc:n,sharedHist:e.sharedHist}),n.linked=[{doc:this,isParent:!0,sharedHist:e.sharedHist}],Zr(n,$r(this)),n},unlinkDoc:function(t){if(t instanceof e&&(t=t.doc),this.linked)for(var r=0;r<this.linked.length;++r){var n=this.linked[r]
if(n.doc==t){this.linked.splice(r,1),t.unlinkDoc(this),Jr($r(this))
break}}if(t.history==this.history){var i=[t.id]
$n(t,function(e){i.push(e.id)},!0),t.history=new li(null),t.history.done=mi(this.history.done,i),t.history.undone=mi(this.history.undone,i)}},iterLinkedDocs:function(e){$n(this,e)},getMode:function(){return this.mode},getEditor:function(){return this.cm},splitLines:function(e){return this.lineSep?e.split(this.lineSep):ns(e)},lineSeparator:function(){return this.lineSep||"\n"}}),kl.prototype.eachLine=kl.prototype.iter
var Tl="iter insert remove copy getEditor constructor".split(" ")
for(var Nl in kl.prototype)kl.prototype.hasOwnProperty(Nl)&&zi(Tl,Nl)<0&&(e.prototype[Nl]=function(e){return function(){return e.apply(this.doc,arguments)}}(kl.prototype[Nl]))
Oi(kl)
var Al=e.e_preventDefault=function(e){e.preventDefault?e.preventDefault():e.returnValue=!1},Ol=e.e_stopPropagation=function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0},Wl=e.e_stop=function(e){Al(e),Ol(e)},Dl=e.on=function(e,t,r){if(e.addEventListener)e.addEventListener(t,r,!1)
else if(e.attachEvent)e.attachEvent("on"+t,r)
else{var n=e._handlers||(e._handlers={}),i=n[t]||(n[t]=[])
i.push(r)}},Hl=[],zl=e.off=function(e,t,r){if(e.removeEventListener)e.removeEventListener(t,r,!1)
else if(e.detachEvent)e.detachEvent("on"+t,r)
else for(var n=Li(e,t,!1),i=0;i<n.length;++i)if(n[i]==r){n.splice(i,1)
break}},El=e.signal=function(e,t){var r=Li(e,t,!0)
if(r.length)for(var n=Array.prototype.slice.call(arguments,2),i=0;i<r.length;++i)r[i].apply(null,n)},Pl=null,Il=30,Rl=e.Pass={toString:function(){return"CodeMirror.Pass"}},Fl={scroll:!1},Bl={origin:"*mouse"},Ul={origin:"+move"}
Wi.prototype.set=function(e,t){clearTimeout(this.id),this.id=setTimeout(t,e)}
var Gl=e.countColumn=function(e,t,r,n,i){null==t&&(t=e.search(/[^\s\u00a0]/),t==-1&&(t=e.length))
for(var o=n||0,l=i||0;;){var s=e.indexOf("\t",o)
if(s<0||s>=t)return l+(t-o)
l+=s-o,l+=r-l%r,o=s+1}},Vl=e.findColumn=function(e,t,r){for(var n=0,i=0;;){var o=e.indexOf("\t",n)
o==-1&&(o=e.length)
var l=o-n
if(o==e.length||i+l>=t)return n+Math.min(l,t-i)
if(i+=o-n,i+=r-i%r,n=o+1,i>=t)return n}},Kl=[""],jl=function(e){e.select()}
Oo?jl=function(e){e.selectionStart=0,e.selectionEnd=e.value.length}:xo&&(jl=function(e){try{e.select()}catch(t){}})
var Xl,Yl=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,_l=e.isWordChar=function(e){return/\w/.test(e)||e>""&&(e.toUpperCase()!=e.toLowerCase()||Yl.test(e))},ql=/[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/
Xl=document.createRange?function(e,t,r,n){var i=document.createRange()
return i.setEnd(n||e,r),i.setStart(e,t),i}:function(e,t,r){var n=document.body.createTextRange()
try{n.moveToElementText(e.parentNode)}catch(i){return n}return n.collapse(!0),n.moveEnd("character",r),n.moveStart("character",t),n}
var $l=e.contains=function(e,t){if(3==t.nodeType&&(t=t.parentNode),e.contains)return e.contains(t)
do if(11==t.nodeType&&(t=t.host),t==e)return!0
while(t=t.parentNode)}
xo&&Co<11&&(Yi=function(){try{return document.activeElement}catch(e){return document.body}})
var Zl,Jl,Ql=e.rmClass=function(e,t){var r=e.className,n=_i(t).exec(r)
if(n){var i=r.slice(n.index+n[0].length)
e.className=r.slice(0,n.index)+(i?n[1]+i:"")}},es=e.addClass=function(e,t){var r=e.className
_i(t).test(r)||(e.className+=(r?" ":"")+t)},ts=!1,rs=function(){if(xo&&Co<9)return!1
var e=Ki("div")
return"draggable"in e||"dragDrop"in e}(),ns=e.splitLines=3!="\n\nb".split(/\n/).length?function(e){for(var t=0,r=[],n=e.length;t<=n;){var i=e.indexOf("\n",t)
i==-1&&(i=e.length)
var o=e.slice(t,"\r"==e.charAt(i-1)?i-1:i),l=o.indexOf("\r")
l!=-1?(r.push(o.slice(0,l)),t+=l+1):(r.push(o),t=i+1)}return r}:function(e){return e.split(/\r\n?|\n/)},is=window.getSelection?function(e){try{return e.selectionStart!=e.selectionEnd}catch(t){return!1}}:function(e){try{var t=e.ownerDocument.selection.createRange()}catch(r){}return!(!t||t.parentElement()!=e)&&0!=t.compareEndPoints("StartToEnd",t)},os=function(){var e=Ki("div")
return"oncopy"in e||(e.setAttribute("oncopy","return;"),"function"==typeof e.oncopy)}(),ls=null,ss=e.keyNames={3:"Enter",8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"PrintScrn",45:"Insert",46:"Delete",59:";",61:"=",91:"Mod",92:"Mod",93:"Mod",106:"*",107:"=",109:"-",110:".",111:"/",127:"Delete",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",63232:"Up",63233:"Down",63234:"Left",63235:"Right",63272:"Delete",63273:"Home",63275:"End",63276:"PageUp",63277:"PageDown",63302:"Insert"}
!function(){for(var e=0;e<10;e++)ss[e+48]=ss[e+96]=String(e)
for(var e=65;e<=90;e++)ss[e]=String.fromCharCode(e)
for(var e=1;e<=12;e++)ss[e+111]=ss[e+63235]="F"+e}()
var as,cs=function(){function e(e){return e<=247?r.charAt(e):1424<=e&&e<=1524?"R":1536<=e&&e<=1773?n.charAt(e-1536):1774<=e&&e<=2220?"r":8192<=e&&e<=8203?"w":8204==e?"b":"L"}function t(e,t,r){this.level=e,this.from=t,this.to=r}var r="bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN",n="rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm",i=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,o=/[stwN]/,l=/[LRr]/,s=/[Lb1n]/,a=/[1n]/,c="L"
return function(r){if(!i.test(r))return!1
for(var n,u=r.length,f=[],h=0;h<u;++h)f.push(n=e(r.charCodeAt(h)))
for(var h=0,d=c;h<u;++h){var n=f[h]
"m"==n?f[h]=d:d=n}for(var h=0,p=c;h<u;++h){var n=f[h]
"1"==n&&"r"==p?f[h]="n":l.test(n)&&(p=n,"r"==n&&(f[h]="R"))}for(var h=1,d=f[0];h<u-1;++h){var n=f[h]
"+"==n&&"1"==d&&"1"==f[h+1]?f[h]="1":","!=n||d!=f[h+1]||"1"!=d&&"n"!=d||(f[h]=d),d=n}for(var h=0;h<u;++h){var n=f[h]
if(","==n)f[h]="N"
else if("%"==n){for(var g=h+1;g<u&&"%"==f[g];++g);for(var v=h&&"!"==f[h-1]||g<u&&"1"==f[g]?"1":"N",m=h;m<g;++m)f[m]=v
h=g-1}}for(var h=0,p=c;h<u;++h){var n=f[h]
"L"==p&&"1"==n?f[h]="L":l.test(n)&&(p=n)}for(var h=0;h<u;++h)if(o.test(f[h])){for(var g=h+1;g<u&&o.test(f[g]);++g);for(var y="L"==(h?f[h-1]:c),b="L"==(g<u?f[g]:c),v=y||b?"L":"R",m=h;m<g;++m)f[m]=v
h=g-1}for(var w,x=[],h=0;h<u;)if(s.test(f[h])){var C=h
for(++h;h<u&&s.test(f[h]);++h);x.push(new t(0,C,h))}else{var S=h,L=x.length
for(++h;h<u&&"L"!=f[h];++h);for(var m=S;m<h;)if(a.test(f[m])){S<m&&x.splice(L,0,new t(1,S,m))
var M=m
for(++m;m<h&&a.test(f[m]);++m);x.splice(L,0,new t(2,M,m)),S=m}else++m
S<h&&x.splice(L,0,new t(1,S,h))}return 1==x[0].level&&(w=r.match(/^\s+/))&&(x[0].from=w[0].length,x.unshift(new t(0,0,w[0].length))),1==Hi(x).level&&(w=r.match(/\s+$/))&&(Hi(x).to-=w[0].length,x.push(new t(0,u-w[0].length,u))),2==x[0].level&&x.unshift(new t(1,x[0].to,x[0].to)),x[0].level!=Hi(x).level&&x.push(new t(x[0].level,u,u)),x}}()
return e.version="5.19.0",e})},874:function(e,t,r){t=e.exports=r(875)(),t.push([e.id,".CodeMirror{font-family:monospace;height:300px;color:#000}.CodeMirror-lines{padding:4px 0}.CodeMirror pre{padding:0 4px}.CodeMirror-gutter-filler,.CodeMirror-scrollbar-filler{background-color:#fff}.CodeMirror-gutters{border-right:1px solid #ddd;background-color:#f7f7f7;white-space:nowrap}.CodeMirror-linenumber{padding:0 3px 0 5px;min-width:20px;text-align:right;color:#999;white-space:nowrap}.CodeMirror-guttermarker{color:#000}.CodeMirror-guttermarker-subtle{color:#999}.CodeMirror-cursor{border-left:1px solid #000;border-right:none;width:0}.CodeMirror div.CodeMirror-secondarycursor{border-left:1px solid silver}.cm-fat-cursor .CodeMirror-cursor{width:auto;border:0!important;background:#7e7}.cm-fat-cursor div.CodeMirror-cursors{z-index:1}.cm-animate-fat-cursor{width:auto;border:0;-webkit-animation:blink 1.06s steps(1) infinite;animation:blink 1.06s steps(1) infinite;background-color:#7e7}@-webkit-keyframes blink{50%{background-color:transparent}}@keyframes blink{50%{background-color:transparent}}.cm-tab{display:inline-block;text-decoration:inherit}.CodeMirror-rulers{position:absolute;left:0;right:0;top:-50px;bottom:-20px;overflow:hidden}.CodeMirror-ruler{border-left:1px solid #ccc;top:0;bottom:0;position:absolute}.cm-s-default .cm-header{color:blue}.cm-s-default .cm-quote{color:#090}.cm-negative{color:#d44}.cm-positive{color:#292}.cm-header,.cm-strong{font-weight:700}.cm-em{font-style:italic}.cm-link{text-decoration:underline}.cm-strikethrough{text-decoration:line-through}.cm-s-default .cm-keyword{color:#708}.cm-s-default .cm-atom{color:#219}.cm-s-default .cm-number{color:#164}.cm-s-default .cm-def{color:#00f}.cm-s-default .cm-variable-2{color:#05a}.cm-s-default .cm-variable-3{color:#085}.cm-s-default .cm-comment{color:#a50}.cm-s-default .cm-string{color:#a11}.cm-s-default .cm-string-2{color:#f50}.cm-s-default .cm-meta,.cm-s-default .cm-qualifier{color:#555}.cm-s-default .cm-builtin{color:#30a}.cm-s-default .cm-bracket{color:#997}.cm-s-default .cm-tag{color:#170}.cm-s-default .cm-attribute{color:#00c}.cm-s-default .cm-hr{color:#999}.cm-s-default .cm-link{color:#00c}.cm-invalidchar,.cm-s-default .cm-error{color:red}.CodeMirror-composing{border-bottom:2px solid}div.CodeMirror span.CodeMirror-matchingbracket{color:#0f0}div.CodeMirror span.CodeMirror-nonmatchingbracket{color:#f22}.CodeMirror-matchingtag{background:rgba(255,150,0,.3)}.CodeMirror-activeline-background{background:#e8f2ff}.CodeMirror{position:relative;overflow:hidden;background:#fff}.CodeMirror-scroll{overflow:scroll!important;margin-bottom:-30px;margin-right:-30px;padding-bottom:30px;height:100%;outline:none;position:relative}.CodeMirror-sizer{position:relative;border-right:30px solid transparent}.CodeMirror-gutter-filler,.CodeMirror-hscrollbar,.CodeMirror-scrollbar-filler,.CodeMirror-vscrollbar{position:absolute;z-index:6;display:none}.CodeMirror-vscrollbar{right:0;top:0;overflow-x:hidden;overflow-y:scroll}.CodeMirror-hscrollbar{bottom:0;left:0;overflow-y:hidden;overflow-x:scroll}.CodeMirror-scrollbar-filler{right:0;bottom:0}.CodeMirror-gutter-filler{left:0;bottom:0}.CodeMirror-gutters{position:absolute;left:0;top:0;min-height:100%;z-index:3}.CodeMirror-gutter{white-space:normal;height:100%;display:inline-block;vertical-align:top;margin-bottom:-30px;*zoom:1;*display:inline}.CodeMirror-gutter-wrapper{position:absolute;z-index:4;background:none!important;border:none!important}.CodeMirror-gutter-background{position:absolute;top:0;bottom:0;z-index:4}.CodeMirror-gutter-elt{position:absolute;cursor:default;z-index:4}.CodeMirror-gutter-wrapper{-webkit-user-select:none;-moz-user-select:none;user-select:none}.CodeMirror-lines{cursor:text;min-height:1px}.CodeMirror pre{border-radius:0;border-width:0;background:transparent;font-family:inherit;font-size:inherit;margin:0;white-space:pre;word-wrap:normal;line-height:inherit;color:inherit;z-index:2;position:relative;overflow:visible;-webkit-tap-highlight-color:transparent;-webkit-font-variant-ligatures:none;font-variant-ligatures:none}.CodeMirror-wrap pre{word-wrap:break-word;white-space:pre-wrap;word-break:normal}.CodeMirror-linebackground{position:absolute;left:0;right:0;top:0;bottom:0;z-index:0}.CodeMirror-linewidget{position:relative;z-index:2;overflow:auto}.CodeMirror-code{outline:none}.CodeMirror-gutter,.CodeMirror-gutters,.CodeMirror-linenumber,.CodeMirror-scroll,.CodeMirror-sizer{box-sizing:content-box}.CodeMirror-measure{position:absolute;width:100%;height:0;overflow:hidden;visibility:hidden}.CodeMirror-cursor{position:absolute;pointer-events:none}.CodeMirror-measure pre{position:static}div.CodeMirror-cursors{visibility:hidden;position:relative;z-index:3}.CodeMirror-focused div.CodeMirror-cursors,div.CodeMirror-dragcursors{visibility:visible}.CodeMirror-selected{background:#d9d9d9}.CodeMirror-focused .CodeMirror-selected{background:#d7d4f0}.CodeMirror-crosshair{cursor:crosshair}.CodeMirror-line::selection,.CodeMirror-line>span::selection,.CodeMirror-line>span>span::selection{background:#d7d4f0}.CodeMirror-line::-moz-selection,.CodeMirror-line>span::-moz-selection,.CodeMirror-line>span>span::-moz-selection{background:#d7d4f0}.cm-searching{background:#ffa;background:rgba(255,255,0,.4)}.CodeMirror span{*vertical-align:text-bottom}.cm-force-border{padding-right:.1px}@media print{.CodeMirror div.CodeMirror-cursors{visibility:hidden}}.cm-tab-wrap-hack:after{content:''}span.CodeMirror-selectedtext{background:none}",""])},875:function(e,t){e.exports=function(){var e=[]
return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var r=this[t]
r[2]?e.push("@media "+r[2]+"{"+r[1]+"}"):e.push(r[1])}return e.join("")},e.i=function(t,r){"string"==typeof t&&(t=[[null,t,""]])
for(var n={},i=0;i<this.length;i++){var o=this[i][0]
"number"==typeof o&&(n[o]=!0)}for(i=0;i<t.length;i++){var l=t[i]
"number"==typeof l[0]&&n[l[0]]||(r&&!l[2]?l[2]=r:r&&(l[2]="("+l[2]+") and ("+r+")"),e.push(l))}},e}},1340:function(e,t,r){function n(e,t){for(var r=0;r<e.length;r++){var n=e[r],i=d[n.id]
if(i){i.refs++
for(var o=0;o<i.parts.length;o++)i.parts[o](n.parts[o])
for(;o<n.parts.length;o++)i.parts.push(c(n.parts[o],t))}else{for(var l=[],o=0;o<n.parts.length;o++)l.push(c(n.parts[o],t))
d[n.id]={id:n.id,refs:1,parts:l}}}}function i(e){for(var t=[],r={},n=0;n<e.length;n++){var i=e[n],o=i[0],l=i[1],s=i[2],a=i[3],c={css:l,media:s,sourceMap:a}
r[o]?r[o].parts.push(c):t.push(r[o]={id:o,parts:[c]})}return t}function o(e,t){var r=v(),n=b[b.length-1]
if("top"===e.insertAt)n?n.nextSibling?r.insertBefore(t,n.nextSibling):r.appendChild(t):r.insertBefore(t,r.firstChild),b.push(t)
else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.")
r.appendChild(t)}}function l(e){e.parentNode.removeChild(e)
var t=b.indexOf(e)
t>=0&&b.splice(t,1)}function s(e){var t=document.createElement("style")
return t.type="text/css",o(e,t),t}function a(e){var t=document.createElement("link")
return t.rel="stylesheet",o(e,t),t}function c(e,t){var r,n,i
if(t.singleton){var o=y++
r=m||(m=s(t)),n=u.bind(null,r,o,!1),i=u.bind(null,r,o,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=a(t),n=h.bind(null,r),i=function(){l(r),r.href&&URL.revokeObjectURL(r.href)}):(r=s(t),n=f.bind(null,r),i=function(){l(r)})
return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return
n(e=t)}else i()}}function u(e,t,r,n){var i=r?"":n.css
if(e.styleSheet)e.styleSheet.cssText=w(t,i)
else{var o=document.createTextNode(i),l=e.childNodes
l[t]&&e.removeChild(l[t]),l.length?e.insertBefore(o,l[t]):e.appendChild(o)}}function f(e,t){var r=t.css,n=t.media
if(n&&e.setAttribute("media",n),e.styleSheet)e.styleSheet.cssText=r
else{for(;e.firstChild;)e.removeChild(e.firstChild)
e.appendChild(document.createTextNode(r))}}function h(e,t){var r=t.css,n=t.sourceMap
n&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */")
var i=new Blob([r],{type:"text/css"}),o=e.href
e.href=URL.createObjectURL(i),o&&URL.revokeObjectURL(o)}var d={},p=function(e){var t
return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},g=p(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),v=p(function(){return document.head||document.getElementsByTagName("head")[0]}),m=null,y=0,b=[]
e.exports=function(e,t){t=t||{},"undefined"==typeof t.singleton&&(t.singleton=g()),"undefined"==typeof t.insertAt&&(t.insertAt="bottom")
var r=i(e)
return n(r,t),function(e){for(var o=[],l=0;l<r.length;l++){var s=r[l],a=d[s.id]
a.refs--,o.push(a)}if(e){var c=i(e)
n(c,t)}for(var l=0;l<o.length;l++){var a=o[l]
if(0===a.refs){for(var u=0;u<a.parts.length;u++)a.parts[u]()
delete d[a.id]}}}}
var w=function(){var e=[]
return function(t,r){return e[t]=r,e.filter(Boolean).join("\n")}}()},1341:function(e,t,r){var n=r(874)
"string"==typeof n&&(n=[[e.id,n,""]])
r(1340)(n,{})
n.locals&&(e.exports=n.locals)}})
