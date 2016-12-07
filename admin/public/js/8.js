webpackJsonp([8],{674:function(e,t,n){"use strict"
function i(e){return e&&e.__esModule?e:{default:e}}function a(e,t){var n=e?e.length:0,i=t?t.length:0
if(n!==i)return!1
for(var a=0;a<n;a++)if(e[a]!==t[a])return!1
return!0}var s=n(187),r=i(s),l=n(18),o=i(l),u=n(120),p=n(1),h=i(p),c=n(140),d=i(c),f=n(141),v=i(f),m=n(3),y=n(67),C=i(y)
e.exports=o["default"].create({displayName:"RelationshipField",statics:{type:"Relationship"},getInitialState:function(){return{value:null,createIsOpen:!1}},componentDidMount:function(){this._itemsCache={},this.loadValue(this.props.value)},componentWillReceiveProps:function(e){e.value===this.props.value||e.many&&a(this.props.value,e.value)||this.loadValue(e.value)},shouldCollapse:function(){return this.props.many?this.props.collapse&&!this.props.value.length:this.props.collapse&&!this.props.value},buildFilters:function(){var e=this,t={}
C["default"].forEach(this.props.filters,function(n,i){if("string"==typeof n&&":"===n[0]){var a=n.slice(1),s=e.props.values[a]
if(s)return void(t[i]=s)
if(":_id"===a&&Keystone.item)return void(t[i]=Keystone.item.id)}else t[i]=n},this)
var n=[]
return C["default"].forEach(t,function(e,t){n.push("filters["+t+"][value]="+encodeURIComponent(e))}),n.join("&")},cacheItem:function(e){e.href=Keystone.adminPath+"/"+this.props.refList.path+"/"+e.id,this._itemsCache[e.id]=e},loadValue:function(e){var t=this
if(!e)return this.setState({loading:!1,value:null})
e=Array.isArray(e)?e:e.split(",")
var n=e.map(function(e){return t._itemsCache[e]}).filter(function(e){return e})
return n.length===e.length?void this.setState({loading:!1,value:this.props.many?n:n[0]}):(this.setState({loading:!0,value:null}),void r["default"].map(e,function(e,n){(0,v["default"])({url:Keystone.adminPath+"/api/"+t.props.refList.path+"/"+e+"?basic",responseType:"json"},function(e,i,a){return e||!a?n(e):(t.cacheItem(a),void n(e,a))})},function(e,n){t.isMounted()&&t.setState({loading:!1,value:t.props.many?n:n[0]})}))},loadOptionsCallback:{},loadOptions:function(e,t){var n=this
this.loadOptionsCallback=t
var i=this.buildFilters();(0,v["default"])({url:Keystone.adminPath+"/api/"+this.props.refList.path+"?basic&search="+e+"&"+i,responseType:"json"},function(e,i,a){return e?(console.error("Error loading items:",e),t(null,[])):(a.results.forEach(n.cacheItem),void t(null,{options:a.results,complete:a.results.length===a.count}))})},valueChanged:function(e){this.props.onChange({path:this.props.path,value:e})},openCreate:function(){this.setState({createIsOpen:!0})},closeCreate:function(){this.setState({createIsOpen:!1})},onCreate:function(e){var t=this
if(this.cacheItem(e),Array.isArray(this.state.value)){var n=this.state.value.map(function(e){return e.id})
n.push(e.id),this.valueChanged(n.join(","))}else this.valueChanged(e.id)
this.loadOptionsCallback(null,{complete:!0,options:Object.keys(this._itemsCache).map(function(e){return t._itemsCache[e]})}),this.closeCreate()},renderSelect:function(e){return h["default"].createElement(d["default"].Async,{multi:this.props.many,disabled:e,loadOptions:this.loadOptions,labelKey:"name",name:this.getInputName(this.props.path),onChange:this.valueChanged,simpleValue:!0,value:this.state.value,valueKey:"id"})},renderInputGroup:function(){var e=n(192)
return h["default"].createElement(m.InlineGroup,null,h["default"].createElement(m.InlineGroupSection,{grow:!0},this.renderSelect()),h["default"].createElement(m.InlineGroupSection,null,h["default"].createElement(m.Button,{onClick:this.openCreate,type:"success"},"+")),h["default"].createElement(e,{list:u.listsByKey[this.props.refList.key],isOpen:this.state.createIsOpen,onCreate:this.onCreate,onCancel:this.closeCreate}))},renderValue:function(){var e=this.props.many,t=this.state.value,n={children:t?t.name:null,component:t?"a":"span",href:t?t.href:null,noedit:!0}
return e?this.renderSelect(!0):h["default"].createElement(m.FormInput,n)},renderField:function(){return this.props.createInline?this.renderInputGroup():this.renderSelect()}})}})
