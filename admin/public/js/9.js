webpackJsonp([9],{629:function(e,t,a){"use strict"
function l(e){return e&&e.__esModule?e:{default:e}}var o=a(1),r=l(o),p=a(37),s=l(p),u=a(25),n=l(u),i=a(26),d=l(i),f=r["default"].createClass({displayName:"DateColumn",propTypes:{col:r["default"].PropTypes.object,data:r["default"].PropTypes.object,linkTo:r["default"].PropTypes.string},getValue:function(){var e=this.props.data.fields[this.props.col.path]
if(!e)return null
var t="datetime"===this.props.col.type?"MMMM Do YYYY, h:mm:ss a":"MMMM Do YYYY"
return(0,s["default"])(e).format(t)},render:function(){var e=this.getValue(),t=!(e||!this.props.linkTo)
return r["default"].createElement(n["default"],null,r["default"].createElement(d["default"],{field:this.props.col.type,to:this.props.linkTo,empty:t},e))}})
e.exports=f}})
