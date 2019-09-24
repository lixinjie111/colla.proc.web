webpackJsonp([2],{"D/EM":function(e,t){},KxGf:function(e,t){},Y6ah:function(e,t){},hR6b:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("3cXf"),i=a.n(n),r=a("Muz9"),o=a.n(r),s={props:{popData:Object},computed:{ruleForm:function(){return this.popData.data}},data:function(){return{submitLoading:!1,uploadPath:window.config.url+"event/info/uploadPic",fileList:[],typeList:[],frequencyUnitList:[],rules:{eventCategory:[{required:!0,message:"请选择信息所属分类",trigger:"change"}],name:[{required:!0,message:"请输入信息类型名称",trigger:"blur"}],icon:[{required:!0,message:"请上传信息类型图标",trigger:"blur"},{message:"请上传信息类型图标",trigger:"input"}],frequency:[{required:!0,message:"请填写默认广播频率",trigger:"blur"}],sendChannel:[{required:!0,message:"请选择下发通道",trigger:"change"}],infoType:[{required:!0,message:"请填写子类型代码",trigger:"blur"}]},select:{sendChannel:"",frequencyUnit:""},sendChannelList:[{id:1,name:"道路施工/路面打滑",key:"DM0202"},{id:2,name:"前方有障碍物",key:"DM0203"},{id:3,name:"公交专用车道",key:"DM0208"},{id:4,name:"无",key:"Done"}]}},created:function(){this.init()},methods:{init:function(){this.initTypeList(),this.initUnintList()},initTypeList:function(){var e=this;this.$api.post("common/queryDictionary",{parentCode:"trafficType"},function(t){t.status>=200&&t.status<300?e.typeList=t.data?t.data:[]:e.$message({type:"error",duration:"1500",message:"获取类型失败 ！",showClose:!0})})},initUnintList:function(){var e=this;this.$api.post("common/queryDictionary",{parentCode:"timeUnit"},function(t){t.status>=200&&t.status<300?(e.frequencyUnitList=t.data?t.data:[],e.frequencyUnitList.length&&(e.select.frequencyUnit=e.frequencyUnitList[0])):e.$message({type:"error",duration:"1500",message:"获取单位失败 ！",showClose:!0})})},selectFile:function(e){this.$refs.ruleForm.clearValidate("icon");var t=e.target.files[0];this.ruleForm.icon=t.name;var a=new FormData;a.append("upfile",t),this.uploadFile(a)},uploadFile:function(e){var t=this,a=this.uploadPath;o.a.post(a,e,{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){"200"==e.data.status&&(t.ruleForm.icon=e.data.data,t.$message({type:"success",duration:"1500",message:"上传成功！",showClose:!0})),"200"!=e.data.status&&t.$message({type:"error",duration:"1500",message:"上传失败！",showClose:!0})}).catch(function(e){var t="导入失败  ！"+e;console.log(t)})},frequencyUnitChange:function(e){this.data.frequencyUnit=this.ruleForm.frequencyUnit.key},handleCancel:function(){this.$emit("closeDialog")},handleOk:function(){var e=this;this.$refs.ruleForm.validate(function(t){t&&(e.submitLoading=!0,"info-type-add"==e.popData.type?e.addFn():"info-type-update"==e.popData.type&&e.updateFn())})},addFn:function(){var e=this,t=this.ruleForm;console.log(t),this.$api.post("event/info/save",t,function(t){t.status>=200&&t.status<300?(e.$emit("successBack"),e.$message({type:"success",duration:"1500",message:"新增信息类型成功 ！",showClose:!0}),e.submitLoading=!1):e.$message({type:"error",duration:"1500",message:"新增信息类型失败 ！",showClose:!0})})},updateFn:function(){var e=this,t={id:this.ruleForm.id,code:this.ruleForm.code,eventCategory:this.ruleForm.eventCategory,name:this.ruleForm.name,frequency:this.ruleForm.frequency,frequencyUnit:this.ruleForm.frequencyUnit,icon:this.ruleForm.icon,content:this.ruleForm.content,sendChannel:this.ruleForm.sendChannel,infoType:this.ruleForm.infoType,alertRadius:this.ruleForm.alertRadius,alertCategory:this.ruleForm.alertCategory};this.$api.post("event/info/update",t,function(t){200==t.status?(e.$emit("successBack"),e.$message({type:"success",duration:"1500",message:"修改信息类型成功 ！",showClose:!0}),e.submitLoading=!1):e.$message({type:"error",duration:"1500",message:"修改信息类型失败 ！",showClose:!0})})}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{staticClass:"yk-left",attrs:{"close-on-click-modal":!1,title:e.popData.title,width:"30%","before-close":e.handleCancel,visible:e.popData.visible},on:{"update:visible":function(t){return e.$set(e.popData,"visible",t)}}},[a("el-form",{ref:"ruleForm",attrs:{model:e.ruleForm,rules:e.rules,size:"mini","label-width":"120px"}},[a("el-form-item",{attrs:{label:"信息所属分类",prop:"eventCategory"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.ruleForm.eventCategory,callback:function(t){e.$set(e.ruleForm,"eventCategory","string"==typeof t?t.trim():t)},expression:"ruleForm.eventCategory"}},[e._l(e.typeList,function(t,n){return[a("el-option",{key:n,attrs:{label:t.name,value:t.key}},[e._v(e._s(t.name))])]})],2)],1),e._v(" "),a("el-form-item",{attrs:{label:"告警类别(国标)"}},[a("el-input",{model:{value:e.ruleForm.alertCategory,callback:function(t){e.$set(e.ruleForm,"alertCategory","string"==typeof t?t.trim():t)},expression:"ruleForm.alertCategory"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"信息类型名称",prop:"name"}},[a("el-input",{model:{value:e.ruleForm.name,callback:function(t){e.$set(e.ruleForm,"name","string"==typeof t?t.trim():t)},expression:"ruleForm.name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"信息类型图标",prop:"icon"}},[a("el-input",{attrs:{placeholder:"请上传信息类型图标"},model:{value:e.ruleForm.icon,callback:function(t){e.$set(e.ruleForm,"icon","string"==typeof t?t.trim():t)},expression:"ruleForm.icon"}},[a("template",{slot:"append"},[a("label",{staticClass:"yk_input_append",attrs:{for:"xFile"}},[e._v("上传")])])],2),e._v(" "),a("form",[a("input",{ref:"refUploadInput",staticClass:"yk-file",attrs:{type:"file",id:"xFile"},on:{change:e.selectFile}})])],1),e._v(" "),a("el-form-item",{attrs:{label:"默认广播频率",prop:"frequency"}},[a("el-input",{model:{value:e.ruleForm.frequency,callback:function(t){e.$set(e.ruleForm,"frequency","string"==typeof t?t.trim():t)},expression:"ruleForm.frequency"}},[a("template",{slot:"append"},[a("select",{directives:[{name:"model",rawName:"v-model.trim",value:e.ruleForm.frequencyUnit,expression:"ruleForm.frequencyUnit",modifiers:{trim:!0}}],staticClass:"yk-border-left-none yk-input-select",attrs:{placeholder:"请选择"},on:{change:function(t){var a=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(e.ruleForm,"frequencyUnit",t.target.multiple?a:a[0])}}},e._l(e.frequencyUnitList,function(t,n){return a("option",{key:n,domProps:{value:t.key}},[e._v(e._s(t.name))])}),0)])],2)],1),e._v(" "),a("el-form-item",{attrs:{label:"默认信息内容",prop:"content"}},[a("el-input",{attrs:{type:"textarea"},model:{value:e.ruleForm.content,callback:function(t){e.$set(e.ruleForm,"content","string"==typeof t?t.trim():t)},expression:"ruleForm.content"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"默认影响范围",prop:"alertRadius"}},[a("el-input-number",{attrs:{"controls-position":"right",min:1,max:1024},model:{value:e.ruleForm.alertRadius,callback:function(t){e.$set(e.ruleForm,"alertRadius","string"==typeof t?t.trim():t)},expression:"ruleForm.alertRadius"}}),e._v(" "),a("span",{staticClass:"c-ml-10"},[e._v("单位:10cm")])],1),e._v(" "),a("el-form-item",{attrs:{label:"下发通道",prop:"sendChannel"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.ruleForm.sendChannel,callback:function(t){e.$set(e.ruleForm,"sendChannel","string"==typeof t?t.trim():t)},expression:"ruleForm.sendChannel"}},[e._l(e.sendChannelList,function(t,n){return[a("el-option",{key:n,attrs:{label:t.key,value:t.key}},[e._v(e._s(t.key))])]})],2)],1),e._v(" "),a("el-form-item",{attrs:{label:"子类型代码",prop:"infoType"}},[a("el-input",{model:{value:e.ruleForm.infoType,callback:function(t){e.$set(e.ruleForm,"infoType","string"==typeof t?t.trim():t)},expression:"ruleForm.infoType"}})],1),e._v(" "),a("el-form-item",{staticStyle:{"text-align":"right"}},[a("el-button",{attrs:{type:"warning",loading:e.submitLoading},on:{click:e.handleOk}},[e._v("确 定")]),e._v(" "),a("el-button",{attrs:{type:"warning",plain:""},on:{click:e.handleCancel}},[e._v("取 消")])],1)],1)],1)},staticRenderFns:[]};var u=a("C7Lr")(s,l,!1,function(e){a("Y6ah")},"data-v-7a747a1a",null).exports,c={props:{popData:Object},computed:{ruleForm:function(){return this.popData.data}},data:function(){return{iconPath:"",disabled:!0}},methods:{handleCancel:function(){this.$emit("closeDialog")}},watch:{"ruleForm.icon":{handler:function(e,t){this.iconPath=window.config.iconPath+e},deep:!0,immediate:!0}}},p={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{staticClass:"yk-left",attrs:{"close-on-click-modal":!1,title:e.popData.title,width:"30%","before-close":e.handleCancel,visible:e.popData.visible},on:{"update:visible":function(t){return e.$set(e.popData,"visible",t)}}},[a("el-form",{ref:"ruleForm",attrs:{size:"mini","label-width":"120px"}},[a("el-form-item",{attrs:{label:"信息所属分类："}},["TI01"==e.ruleForm.eventCategory?a("span",[e._v("车辆异常信息")]):"TI02"==e.ruleForm.eventCategory?a("span",[e._v("道路异常信息")]):"TI03"==e.ruleForm.eventCategory?a("span",[e._v("交通管制信息")]):"TI04"==e.ruleForm.eventCategory?a("span",[e._v("天气服务信息")]):a("span",[e._v(e._s(e.ruleForm.eventCategory))])]),e._v(" "),a("el-form-item",{attrs:{label:"信息类型名称："}},[e._v("\r\n            "+e._s(e.ruleForm.name)+"\r\n        ")]),e._v(" "),a("el-form-item",{attrs:{label:"告警类别(国标)："}},[e._v("\r\n            "+e._s(e.ruleForm.alertCategory)+"\r\n        ")]),e._v(" "),a("el-form-item",{attrs:{label:"信息类型图标："}},[a("div",{staticClass:"image-box"},[a("img",{staticClass:"image",attrs:{src:e.iconPath}})])]),e._v(" "),a("el-form-item",{attrs:{label:"默认广播频率："}},[e._v("\r\n            "+e._s(e.ruleForm.frequency+" ")+"\r\n            "),1==e.ruleForm.frequencyUnit?a("span",[e._v("毫秒")]):2==e.ruleForm.frequencyUnit?a("span",[e._v("秒")]):3==e.ruleForm.frequencyUnit?a("span",[e._v("分钟")]):a("span",[e._v(e._s(e.ruleForm.frequencyUnit))])]),e._v(" "),a("el-form-item",{attrs:{label:"默认信息内容：",prop:"name"}},[e._v("\r\n            "+e._s(e.ruleForm.content)+"\r\n        ")])],1)],1)},staticRenderFns:[]};var m={components:{InfoTypePop:u,InfoTypeDetail:a("C7Lr")(c,p,!1,function(e){a("D/EM")},"data-v-0cd9468b",null).exports},data:function(){return{iconPath:window.config.iconPath,paging:{index:0,size:10,total:0,mini:!0},infoTypePopFlag:!1,infoTypeDetailFlag:!1,popData:{title:"提示",data:{},visible:!0},dataList:[],typeList:[],search:{name:""},isLoading:!1}},methods:{closeDialog:function(){this.infoTypePopFlag=!1,this.infoTypeDetailFlag=!1},init:function(){this.search.type="",this.initData(),this.initTypeList()},initVo:function(){return{code:"",content:"",frequency:"500",frequencyUnit:"1",icon:"",name:"",eventCategory:"",sendChannel:"",infoType:"",alertRadius:1024,alertPath:"",alertCategory:""}},initData:function(){var e=this;this.isLoading=!0;var t={name:this.search.name,page:{pageIndex:this.paging.index,pageSize:this.paging.size}};this.$api.post("event/info/queryPage",t,function(t){t.status>=200&&t.status<300?(e.dataList=t.data.list,e.$refs.table.bodyWrapper.scrollTop=0,e.paging.total=t.data.totalCount):e.$message({type:"error",duration:"1500",message:"获取信息类型列表失败  ！",showClose:!0}),e.isLoading=!1})},initTypeList:function(){var e=this;this.$api.post("common/queryDictionary",{parentCode:"trafficType"},function(t){t.status>=200&&t.status<300?e.typeList=t.data?t.data:[]:e.$message({type:"error",duration:"1500",message:"获取类型失败  ！",showClose:!0})})},getTypeCnName:function(e){this.typeList||this.initTypeList(e)},handleSearch:function(){this.initData()},handleFlush:function(){this.search.name="",this.initData()},handleAdd:function(e,t){this.popData.title="新增",this.popData.type="info-type-add",this.popData.data=this.initVo(),this.infoTypePopFlag=!0},handleUpdate:function(e,t){this.popData.title="修改",this.popData.type="info-type-update",this.popData.data=JSON.parse(i()(t)),this.infoTypePopFlag=!0},handleDelete:function(e,t){var a=this;this.$confirm("此操作将永久删除该文件, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var e={ids:[t.id]};a.$api.post("event/info/delete/ids",e,function(e){e.status>=200&&e.status<300?(a.initData(),a.$message({type:"success",duration:"1500",message:"删除信息类型成功  ！",showClose:!0})):a.$message({type:"success",duration:"1500",message:"删除信息类型失败  ！",showClose:!0})})})},handleCheck:function(e,t){this.popData.title="查看",this.popData.type="info-type-check",this.popData.data=t,this.infoTypeDetailFlag=!0},successBack:function(){this.initData(),"info-type-add"!=this.popData.type&&"info-type-update"!=this.popData.type||(this.infoTypePopFlag=!1),"info-type-check"==this.popData.type&&(this.infoTypeDetailFlag=!1)},pagingChange:function(e){this.paging.index=e-1,this.initData()}},created:function(){this.init()}},d={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"c-wrapper-20"},[a("el-form",{attrs:{inline:!0,size:"mini"}},[a("el-form-item",{attrs:{label:"信息类型名称："}},[a("el-input",{model:{value:e.search.name,callback:function(t){e.$set(e.search,"name","string"==typeof t?t.trim():t)},expression:"search.name"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"warning"},on:{click:e.handleSearch}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{type:"warning",plain:""},on:{click:e.handleFlush}},[e._v("刷新")])],1),e._v(" "),a("el-form-item",{staticClass:"yk-right"},[a("el-button",{attrs:{type:"warning"},on:{click:e.handleAdd}},[e._v("新增")])],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.isLoading,expression:"isLoading"}],ref:"table",staticClass:"c-mb-70",attrs:{"max-height":"724",data:e.dataList,border:"",stripe:"","header-cell-style":{background:"#E6E6E6",color:"#606266",border:"0px"}}},[a("el-table-column",{attrs:{label:"序号",type:"index"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v("\n                    "+e._s(t.$index+e.paging.index*e.paging.size+1)+"\n                ")])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"name",label:"信息类型名称","min-width":"15%"}}),e._v(" "),a("el-table-column",{attrs:{prop:"eventCategory",label:"信息分类","min-width":"15%"},scopedSlots:e._u([{key:"default",fn:function(t){return["TI01"==t.row.eventCategory?a("span",[e._v("车辆异常信息")]):e._e(),e._v(" "),"TI02"==t.row.eventCategory?a("span",[e._v("道路异常信息")]):e._e(),e._v(" "),"TI03"==t.row.eventCategory?a("span",[e._v("交通管制信息")]):e._e(),e._v(" "),"TI04"==t.row.eventCategory?a("span",[e._v("天气服务信息")]):e._e()]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"icon",label:"图标","min-width":"15%"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticClass:"image-box"},[a("img",{staticClass:"image",attrs:{src:e.iconPath+t.row.icon}})])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"告警类别(国标)",prop:"alertCategory","min-width":"15%"}}),e._v(" "),a("el-table-column",{attrs:{label:"信息编码",prop:"code","min-width":"15%"}}),e._v(" "),a("el-table-column",{attrs:{prop:"content",label:"默认信息内容","min-width":"20%"}}),e._v(" "),a("el-table-column",{attrs:{prop:"frequency",label:"默认广播频率(ms)","min-width":"15%"}}),e._v(" "),a("el-table-column",{attrs:{label:"管理","min-width":"20%"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"warning",plain:"",size:"mini"},on:{click:function(a){return e.handleCheck(t.$index,t.row)}}},[e._v("查看")]),e._v(" "),a("el-button",{attrs:{type:"warning",plain:"",size:"mini"},on:{click:function(a){return e.handleUpdate(t.$index,t.row)}}},[e._v("编辑")]),e._v(" "),a("el-button",{attrs:{type:"warning",plain:"",size:"mini"},on:{click:function(a){return e.handleDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],1),e._v(" "),a("el-row",{staticClass:"c-page"},[a("el-pagination",{attrs:{background:"",layout:"prev, pager, next","page-size":this.paging.size,total:this.paging.total},on:{"current-change":e.pagingChange}})],1),e._v(" "),e.infoTypePopFlag?a("info-type-pop",{attrs:{popData:e.popData},on:{closeDialog:e.closeDialog,successBack:e.successBack}}):e._e(),e._v(" "),e.infoTypeDetailFlag?a("info-type-detail",{attrs:{popData:e.popData},on:{closeDialog:e.closeDialog,successBack:e.successBack}}):e._e()],1)},staticRenderFns:[]};var f=a("C7Lr")(m,d,!1,function(e){a("KxGf")},"data-v-51e64c3c",null);t.default=f.exports}});
//# sourceMappingURL=2.901ca5a7710a7d265daa1568969137774.js.map