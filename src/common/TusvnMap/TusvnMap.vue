<template>
    <div style="height:100%">
        <div :id="targetId"  style="height:100%"></div>
        <div :id="overlayContainerId" style="display: none;">
            <!-- <div id="marker" title="Marker">
                <img src="../../static/assets/images/loading.gif"/>
            </div> -->
            <!-- <img id="marker" src="../../static/assets/images/loading.gif"/> -->
        </div>
        <template v-for="(popupData,key,index) in popupDatas">
            <div :id="popupData.id+'-popup'" :ref="popupData.id+'-popup'" class="ol-popup" :key="index">
                <a href="#" :overlayid="popupData.id" :id="popupData.id+'-popup-closer'" class="ol-popup-closer" @click="closePopup($event)"></a>
                <div :id="popupData.id+'-popup-content'">
                    <span v-html="popupData.content"></span>
                </div>
            </div>
        </template>
        
        <template>
            <div v-show="showTrafficInfoPop" id="traffic-info-release-popup" class="ol-popup yk-pointer-normal" >
                <a href="#" overlayid="traffic-info-release" id="traffic-info-release-popup-closer" class="ol-popup-closer" @click="closeMyInfoWindow($event)"></a>
                <div id="traffic-info-release-popup-content">
                    <!-- <span v-html="popupData.content"></span> -->

                    <div>
                        <el-row class="yk-pad-10 yk-bottom-border">
                            <label class="yk-info-window-title">交通信息发布</label>                        
                        </el-row>
                        <el-row class="yk-pad-1040">                            
                            
                            <el-form ref="ruleFormMap" :rules="rules" :model="trafficInfo" size="mini" label-width="108px" class="demo-ruleForm yk-left">

                                <el-form-item label="信息类型" class="yk-bottom-6">                               
                                    <span>{{trafficInfo.eventName}}</span>
                                </el-form-item>

                                <el-form-item label="中心位置" prop="name" class="yk-bottom-6">                                
                                    <span>{{trafficInfo.longitude + ',' + trafficInfo.latitude}}</span>
                                </el-form-item>

                                <el-form-item label="广播范围" prop="name" class="yk-bottom-6" style="height: 50px;">
                                    <el-slider v-model="trafficInfo.affectRange" :marks="broadcastRangeMarks" :max="broadcastMax" :step="broadcastStep" @change="sliderChange"></el-slider>
                                </el-form-item>

                                <el-form-item label="信息内容" prop="content" class="yk-bottom-16">
                                    <el-input type="textarea" size="mini" v-model="trafficInfo.content"></el-input>
                                </el-form-item>

                                <el-form-item label="默认广播频率" prop="frequency" class="yk-bottom-12">
                                    <el-input size="mini" v-model="trafficInfo.frequency">
                                        <template slot="append">
                                            <select class="yk-w-60 yk-border-left-none" v-model="select.frequencyUnit">
                                                <option v-for="(item,index) in frequencyUnitList" :key="index" :value="item">{{item.name}}</option>
                                            </select>
                                        </template>
                                    </el-input>
                                </el-form-item>
                                
                                <el-form-item label="发送生效时间" prop="beginTime" class="yk-bottom-12">
                                    <el-date-picker
                                        v-model="trafficInfo.beginTime"
                                        type="datetime"
                                        placeholder="选择日期时间">
                                    </el-date-picker>
                                </el-form-item>

                                <el-form-item label="发送失效时间" prop="endTime" class="yk-bottom-12">
                                    <el-date-picker
                                        v-model="trafficInfo.endTime"
                                        type="datetime"
                                        placeholder="选择日期时间">
                                    </el-date-picker>
                                </el-form-item>

                                <el-form-item v-show="trafficInfo.isEdit" prop="datasource" label="信息来源" class="yk-bottom-12">                                    
                                    <select v-model="select.datasource">
                                        <option v-for="(item,index) in datasourceList" :key="index" :value="item">{{item.name}}</option>                                        
                                    </select>
                                </el-form-item>

                                <el-form-item style="text-align:right;">
                                    <el-button class="yk-w-80" type="warning" v-show="!trafficInfo.isEdit" @click="publichInfo($event);">发布</el-button>
                                    <el-button class="yk-w-80" type="info" v-show="!trafficInfo.isEdit" @click="closeInforWindow($event);">取消</el-button>

                                    <el-button class="yk-w-80" type="warning" v-show="trafficInfo.isEdit" @click="updateInfo($event);">更新</el-button>
                                    <el-button type="info" v-show="trafficInfo.isEdit" @click="destroyInfo($event);">手动失效</el-button>                                    
                                </el-form-item>

                            </el-form>
                        </el-row>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script>

// import startIcon from '@/assets/images/start.png';
// import endIcon from '@/assets/images/end.png';
// import startIcon2 from '@/assets/images/start2.png';
// import endIcon2 from '@/assets/images/end2.png';

import _ from 'lodash';
import "ol/ol.css";
import { unByKey } from 'ol/Observable.js'
// import OLObservable from 'ol/Observable.js'
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Overlay from 'ol/Overlay.js';
import {Image as ImageLayer} from 'ol/layer.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {defaults as defaultControls,ScaleLine,FullScreen} from 'ol/control.js';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction.js';
import TileLayer from 'ol/layer/Tile.js';
import BingMaps from 'ol/source/BingMaps';
import OSM from 'ol/source/OSM.js';
import Polygon from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import MousePosition from 'ol/control/MousePosition.js';
import * as mapInit from './MapUtils.js';

import TDate from '@/common/date.js'

export default {
    name:"TusvnMap",
    props:["targetId","overlayContainerId",], //'trafficInfo'
    data(){
        return {
             orderStatus: -1
            ,map: null
            ,project:"EPSG:4326"//地图投影
            // 120.80224989415075-----latitude:31.28000259048651
            ,center: [120.80224989415075,31.28000259048651]//地图初始中心
            ,zoom: 10//地图初始缩放级别
            ,planLineTracks: []
            ,realLineTracks: []
            ,pageHeight: 400
            ,carLayerId:"carLayer"
            ,currentDivPolygon:null//记录旋转过后的，div窗口对应的矩形
            // ,startIcon: '@/assets/images/start.png'
            // ,endIcon: '@/assets/images/end.png'
            ,popupDatas:{}
            ,overlays:{},

            // 交通信息发布系统
            showTrafficInfoPop: false,
            ruleForm: {
                eventName: '',
                eventType: '',
                name: '',
                eventCategory: '',
                frequency: '',
                frequencyUnit: '',
                delivery: false,
                content: '',
            },
            rules: {                
                content: [
                    { required: true, message: '请输入默认信息内容', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                frequency: [
                    { required: true, message: '请填写默认广播频率', trigger: 'blur' },
                ],
                // beginTime: [
                //     { type: 'date', required: true, message: '发送生效时间', trigger: 'change' },
                // ],
                // endTime: [
                //     { type: 'date', required: true, message: '发送失效时间', trigger: 'change' },
                // ],
                datasource: [
                    { required: true, message: '请选择信息来源', trigger: 'change' }
                ],
            },

            trafficInfo : {
                id: '',
                title: '信息发布',
                isEdit: false,
                eventName: '',
                eventType: '',
                taskCode: '',                          
                longitude: '',
                latitude: '',
                affectRange: 1000,
                content: '',
                frequency: 500,
                frequencyUnit: '',
                beginTime: TDate.formatTime(),
                endTime: TDate.formatTime(),
                datasource: '',
            },
            frequencyUnitList: [],
            datasourceList: [],
            broadcastMax: 3000,
            broadcastStep: 100,
            broadcastRangeMarks: {
                200: '200米',                                
                3000: '3000米'
                // {
                //     style: {
                //         color: '#1989FA',
                //     },
                //     label: this.$createElement('strong', '3000米')
                // },
            },
            clickEventKey: null,
            select: {
                datasource: '',
                frequencyUnit: {
                    name: '',
                    value: '',
                },
                sliderVal: 1000,
            },
            circleRadius: 1000,    // 圆形半径
            circleID: '',
            circleLon: '',
            circleLat: '',
        }
    },
    watch:{
    },
    methods: {
        submitForm(formName='ruleFormMap') {
            let bool = false;
            this.$refs[formName].validate((valid) => {
                if (valid) {           
                    bool = true;
                } else {
                    console.log('error submit!!');
                    bool = false;
                }
            });
            return bool;
        },
        resetForm(formName='ruleFormMap') {
            this.$refs[formName].resetFields();
        },
        
        // 表单事件
        sliderChange(value){
            this.select.sliderVal = value;
            this.circleRadius = value;
            // this.circleRadius = this.circleRadius + 0.001;
            this.drawBgCircle(this.circleLon,this.circleLat);
        },
        publichInfo(e){
            this.trafficInfo.datasource = this.select.datasource ? (this.select.datasource.key ? this.select.datasource.key : '') : '';
            this.trafficInfo.frequencyUnit = this.select.frequencyUnit ? (this.select.frequencyUnit.key ? this.select.frequencyUnit.key : '') : '';
            this.trafficInfo.affectRange = this.select.sliderVal;

            if(!this.submitForm()) return; 

            this.$emit('PublishInfo',this.trafficInfo);
            this.closeMyInfoWindow();
        },        
        updateInfo(e){
           
            this.trafficInfo.datasource = this.select.datasource ? (this.select.datasource.key ? this.select.datasource.key : '') : '';
            this.trafficInfo.frequencyUnit = this.select.frequencyUnit ? (this.select.frequencyUnit.key ? this.select.frequencyUnit.key : '') : '';
            this.trafficInfo.affectRange = this.select.sliderVal;

           if(!this.submitForm()) return; 

            this.$emit('UpdateInfo',this.trafficInfo);
            this.closeMyInfoWindow();
        },
        destroyInfo(e){           
            this.$emit('DestroyInfo',this.trafficInfo);
            this.closeMyInfoWindow(e);
        },
        closeInforWindow(e){
            
            this.closeMyInfoWindow();
        },
        initDatasourceList(isEdit=false,datasource){
            let url = 'common/queryDictionary';
            let params = {
                parentCode: 'trafficSource',
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        this.datasourceList = response.data ? response.data : [];
                        if(this.datasourceList.length){
                            
                            if (!isEdit) {
                                this.select.datasource = this.datasourceList[0];
                            }else{
                             
                                for(let item of this.datasourceList){
                                    if(item.key == datasource){
                                        this.select.datasource = item;
                                        break;
                                    }
                                }
                            }
                        }
                    
                    } else {                     
                        this.$message("获取单位失败 ！"); 
                    }
                }
            );
        },
        initUnintList(isEdit=false,frequencyUnit){
            let url = 'common/queryDictionary';
            let params = {
                parentCode: 'timeUnit',
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        this.frequencyUnitList = response.data ? response.data : [];
                     
                        if(this.frequencyUnitList.length){
                            if(!isEdit){
                                this.select.frequencyUnit = this.frequencyUnitList[0];
                            }else{
                                for(let item of this.frequencyUnitList){
                                    if(item.key == frequencyUnit){
                                        this.select.frequencyUnit = item;
                                        break;
                                    }
                                }
                            }
                        }                        
                    
                    } else {                     
                        this.$message("获取单位失败 ！"); 
                    }
                }
            );
        },
        initDetail(marker) {
            let url = 'event/task/findDetail';
            let params = {
                id: marker.id,
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {
                        
                        this.trafficInfo.id = response.data.id;
                        this.trafficInfo.taskCode = response.data.taskCode;
                        this.trafficInfo.eventName = response.data.eventName;
                        this.trafficInfo.eventType = response.data.eventType;
                        this.trafficInfo.longitude = response.data.longitude;
                        this.trafficInfo.latitude = response.data.latitude;
                        this.trafficInfo.affectRange = response.data.affectRange; 
                        this.trafficInfo.content = response.data.content; 
                        this.trafficInfo.frequency = response.data.frequency; 
                        this.trafficInfo.frequencyUnit = response.data.frequencyUnit; 
                        this.trafficInfo.beginTime = response.data.beginTime; 
                        this.trafficInfo.endTime = response.data.endTime; 
                        this.trafficInfo.datasource = response.data.datasource;                                 

                        if(response.data.status == 200){                            
                            this.$message('获取详情成功！');
                        }
                        this.initUnintList(true,this.trafficInfo.frequencyUnit);
                        this.initDatasourceList(true,this.trafficInfo.datasource);
                        
                    } else {                     
                        this.$message("获取详情失败 ！"); 
                    }
                }
            );
        },
        // ------------------------------------------------------------------------------

        //初始化地图
        initMap:function(){

            this.$data.map = new Map({
                controls: defaultControls({attribution: false,zoom: false,}).extend([
                    // overviewMapControl
                    new ScaleLine()
                    // ,new FullScreen()
                    // ,new MousePosition()
                ]),
                interactions: defaultInteractions().extend([
                    // new DragRotateAndZoom()
                ]),
                layers: [
                    new TileLayer({
                        source: new OSM({
                            wrapX: false,
                            // url:"https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            // url:"http://113.208.118.62:8086/mapserver/getMapTile?protocol=https&cache=true&server={a-c}&xyz={z}/{x}/{y}&type=vector&format=png&baseUrl=tile.openstreetmap.org"
                            url:"http://120.133.21.14:8086/mapserver/getMapTile?protocol=https&cache=true&server={a-c}&xyz={z}/{x}/{y}&type=vector&format=png&baseUrl=tile.openstreetmap.org"
                            // url:"http://10.0.1.22:8086/mapserver/getMapTile?protocol=https&cache=true&server={a-c}&xyz={z}/{x}/{y}&type=vector&format=png&baseUrl=tile.openstreetmap.org"
                            // url:"https://api.chinavehiclenet.cn:8769/mapproxy/mapserver/getMapTile?protocol=https&cache=true&server={a-c}&xyz={z}/{x}/{y}&type=vector&format=png&baseUrl=tile.openstreetmap.org"
                        })
                        // source: new BingMaps({
                        //     key: 'AlgNEg0cVVHbTuJ8jXqJzA6uah5MIklbLmMySfTMb-GQZzEndCrxR1PxBEaWC3Bt',
                        //     imagerySet: "Aerial"  //'Road','RoadOnDemand','Aerial','AerialWithLabels','collinsBart','ordnanceSurvey'
                        //     // use maxZoom 19 to see stretched tiles instead of the BingMaps
                        //     // "no photos at this zoom level" tiles
                        //     // maxZoom: 19
                        // })
                    })
                ],
                target: this.targetId,
                // fit:true,
                view: new View({
                    projection:this.$data.project,
                    center: this.$data.center,
                    zoom: this.$data.zoom
                })
            });
           
            // this.clickEventKey = this.$data.map.on("click",this.mapClick);
            this.$data.map.getView().on("change:resolution",this.viewLevelChange);
            this.$data.map.on("moveend",this.moveEnd);
            
            this.removeClickEvent();
            // unByKey(this.clickEventKey);
        },

        addClickEvent(){
            this.clickEventKey = this.$data.map.on("click",this.mapClick);
        },
        removeClickEvent(){
            
            unByKey(this.clickEventKey);
            
        },

        /**
         * 添加信息窗口到地图中
         * obj格式如下：
         * {
         *     id:"0011",  //唯一编码
         *     content:"<span style='color:red'>001</span>",//信息框中显示的内容
         *     lon:117,//经度
         *     lat:39  //纬度
         * }
         */
        addInfoWindow:function(obj){           

            this.$set(this.$data.popupDatas, obj.id, obj);
            this.$nextTick(function(){
                let container = document.getElementById(obj.id+'-popup');
                let overlay = new Overlay({
                    element: container,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                this.$data.overlays[obj.id]=overlay;
                this.$data.map.addOverlay(overlay);
                overlay.setPosition([obj.lon,obj.lat]);
            });
        },

        addMyInfoWindow: function(obj){

            console.log('addMyInfoWindow --- ' + obj);
            // debugger
            
            this.trafficInfo.id = obj.id;
            this.trafficInfo.eventName = obj.trafficInfo.eventName;
            
            if(obj.isEdit){
                this.initDetail(obj);
                this.trafficInfo.isEdit = true;
            }else{
                this.trafficInfo = obj.trafficInfo;
                this.trafficInfo.isEdit = false;

                this.initDatasourceList();
            }            

            this.showTrafficInfoPop = true;
            this.$nextTick(function(){
                let container = document.getElementById('traffic-info-release-popup');
                let overlay = new Overlay({
                    element: container,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                this.$data.overlays[obj.id]=overlay;
                this.$data.map.addOverlay(overlay);
                overlay.setPosition([obj.lon,obj.lat]);
            });

            this.circleID= 'circle_' + obj.id;
            this.circleLon = obj.lon;
            this.circleLat = obj.lat;
            this.drawBgCircle(obj.lon,obj.lat);

            this.pubMsgIconID = 'pub_msg_ico_' + obj.id;
            // let icoSrc = obj.
            // this.drawPubMsgIcon(lon,lat,);

        },
        // 画圆形背景图片
        drawBgCircle(lon,lat){
            // 245,147,7
            this.addCircle(lon,lat,this.circleRadius,this.circleID,[245,147,7,0.1],'#F59307',null,null,null,null,null,null,'MessageLayer');
            
        },
        // 移除圆形背景图片
        clearCircle(){
            // MessageLayer
            if(!this.circleID) return;
            this.removeFeature(this.circleID,'MessageLayer');
        },
        // 画 发布信息图标
        drawPubMsgIcon(lon,lat,icon){

            // lon,lat,id,layerId,carImgUrl,size,rotation,rotateWithView,opacity,offset,scale
            this.addImg(lon,lat,this.pubMsgIconID,'MessageLayer',icon)            
        },
        // 移除 发布信息图标
        clearPubMsgIcon(){
            if(!this.pubMsgIconID) return;
            this.removeFeature(this.pubMsgIconID,'MessageLayer');
        },

        /**
         *关闭信息框
         */
        closeMyInfoWindow:function(e){

           this.clearCircle();
           this.resetForm();

           // 关闭信息框
            let overlayid = 'traffic-info-release';
            let overlay = this.$data.overlays[overlayid];
            this.$data.map.removeOverlay(overlay);
            // e.target.blur();

            this.showTrafficInfoPop = false;

            return false;
        },
        


        /**
         *关闭信息框
         */
        closePopup:function(e){
            let overlayid = e.target.attributes.overlayid.value;
            let overlay = this.$data.overlays[overlayid];
            this.$data.map.removeOverlay(overlay);
            e.target.blur();
            return false;
        },
        // testImgOverlayClick:function(e){
        //     console.log(e.target.getAttribute("bdata"));
        // },
        mapClick:function(mevent){
            this.$emit("MapClick",this,mevent);

            this.removeClickEvent();        // 移除点击事件
        },
        viewLevelChange:function(mevent){
            let z = parseInt(this.$data.map.getView().getZoom());
            if(this.$data.zoom!=z)
            {
                this.$emit("ViewLevelChange",this,z);
                this.$data.zoom=z;
            }
        },
        moveEnd:function(mevent){
            this.$emit("ExtentChange",this,this.getCurrentExtent());
        },
        /**
         * 固定地图到某一缩放级别，使鼠标滚轮失效
         * 
         * @param {Number} level  缩放级别
         */
        forbidZoom:function(level){
            let view = this.$data.map.getView();
            view.setZoom(level);
            view.setMaxZoom(level);
            view.setMinZoom(level);
        },
        /**
         * 旋转地图
         * 
         * @param {Number} rotation  弧度，180度=Math.PI弧度
         */
        rotateMap:function(rotation){
            let view = this.$data.map.getView();
            view.animate({
                rotation: rotation
            });
            //获取旋转后的当前窗口矩形Polygon
            let currentExtent = this.getCurrentExtent();
            this.$data.currentDivPolygon=new Polygon([[
                [currentExtent[2],currentExtent[3]],
                [currentExtent[2],currentExtent[1]],
                [currentExtent[0],currentExtent[1]],
                [currentExtent[0],currentExtent[3]],
                [currentExtent[2],currentExtent[3]]
            ]]);
            // view.setRotation(rotation);
            this.$data.currentDivPolygon.rotate(rotation,[(currentExtent[0]+currentExtent[2])/2,(currentExtent[1]+currentExtent[3])/2]);
            
        },
        /**
         * 判断是否在点在当前地图div对应Polygon的范围内
         */
        isInDivPolygon:function(x,y)
        {
            if(this.$data.currentDivPolygon==null)
            {
                let currentExtent = this.getCurrentExtent();
                this.$data.currentDivPolygon=new Polygon([[
                    [currentExtent[2],currentExtent[3]],
                    [currentExtent[2],currentExtent[1]],
                    [currentExtent[0],currentExtent[1]],
                    [currentExtent[0],currentExtent[3]],
                    [currentExtent[2],currentExtent[3]]
                ]]);
            }
            return this.$data.currentDivPolygon.intersectsCoordinate([x,y]);
        },

        /**
         * 禁止缩放
         */
        forbidDrag:function(){
            let controls = this.$data.map.getControls();
            let interactions = this.$data.map.getInteractions();
            for(var i=0;i<interactions.getArray().length;i++)
            {
                this.$data.map.removeInteraction(interactions.getArray()[i]);
            }
        },
        /**
         * 向地图中添加覆盖物
         * 
         * @param {any} id 
         * @param {Document} dom 
         * @param {Number} lon 
         * @param {Number} lat 
         * @param {String} className  样式
         * @param {Array.<Number>} offset  位置偏移
         */
        addOverlay:function(id, dom, lon, lat, className,offset) {
            mapInit.addOverlay(id, dom, lon, lat, className,offset,this.$data.map);
        },
        /**
         * 向地图中添加图片覆盖物
         * 
         * @param {any} id 
         * @param {String} imgUrl  图片地址
         * @param {Number} courseAngle 旋转角度
         * @param {Number} lon 
         * @param {Number} lat 
         * @param {String} bdata 业务数据
         * @param {Array.<Number>} offset  位置偏移
         * @param {Function} callback 点击的回调
         */
        addImgOverlay:function(id, imgUrl, courseAngle, lon, lat, bdata, offset, callback){

            let overLay_container = document.getElementById(this.overlayContainerId);
            let overLay_img = document.createElement("img");
            overLay_img.setAttribute("src",imgUrl);
            overLay_img.setAttribute("id",id);
            overLay_img.setAttribute("bdata",bdata);
            if(courseAngle!=null){
                overLay_img.style.transform = 'rotate(' + courseAngle + 'deg)';
            }

            if(callback!=null)
            {
                overLay_img.onclick=callback;                
            }
            
            overLay_container.appendChild(overLay_img);
            mapInit.addOverlay(id, overLay_img, lon, lat, null,offset,this.$data.map);
        },
        /**
         * 重新设置覆盖物的位置
         * @param {String} id 
         * @param {Number} lon 
         * @param {Number} lat 
         */
        setOverlayPosition:function(id, lon, lat) {
            mapInit.setOverlayPosition(id, lon, lat,this.$data.map);
        },
        /**
         * 清除地图中的覆盖物
         * 
         */
        clearOverlays:function() {
            mapInit.clearOverlays(this.$data.map);
        },
        /**
         * 根据id移除覆盖物
         * 
         * @param {String} id 覆盖物的id
         */
        removeOverlayById:function(id) {
            mapInit.removeOverlayById(id,this.$data.map);
        },
        /**
         * 添加矢量图层
         * @param {string} id 矢量图层id
         */
        addVectorLayer:function(id){
            let carLayer = mapInit.generateVectorLayer(id);
            mapInit.addLayer(this.$data.map,carLayer);
        },
        /**
         * 通过Id获取图层
         * @param {string} id 图层id
         */
        getLayerById:function(id){
            return mapInit.getLayerByAttr(this.$data.map, "id", id);
        },
        /**
         * 通过Id获取图层
         * @param {string} id 图层id
         */
        removeLayerById:function(id){
           let layer = this.getLayerById(id);
           if(layer!=undefined)
           {
               this.$data.map.removeLayer(layer);
           }
        },        
        // /**
        //  * 向地图中添加图片
        //  * 
        //  * @param {number} lon 浮点型的值
        //  * @param {number} lat 浮点型的值
        //  * @param {string} id 图片id
        //  * @param {string} layerId 图层id
        //  * @param {string} carImgUrl 图片地址
        //  * @param {Array.<number>} size 图片大小，例如：[22,37]
        //  * @param {number} rotation 旋转角度（弧度），顺时针方向为正。例如：顺时针方向偏转90度，对应的值是Math.PI/2
        //  * @param {boolean} rotateWithView 是否跟view一起旋转
        //  * @param {number} opacity 透明度，0到1之间的值
        //  * @param {Array.<number>} offset x、y方向的偏移，默认值是[0,0]。例如：[0,0]
        //  * @param {number} scale 图片缩放，默认为1
        //  */
        // addImg:function(lon,lat,id,layerId,carImgUrl,size,rotation,rotateWithView,opacity,offset,scale){
        //      let carStyle = new Style({
        //         image:mapInit.generateIcon(carImgUrl||"static/images/warning.png",size||[22,37],rotation||0,rotateWithView||true,opacity||1,offset||[0,0],scale)
        //     });
        //     mapInit.addPoint(lon,lat,id,carStyle,this.getLayerById(layerId));
        // },
        /**
        * 向地图中添加图片
        *
        * @param {number} lon 浮点型的值
        * @param {number} lat 浮点型的值
        * @param {string} id 图片id
        * @param {string} layerId 图层id
        * @param {string} carImgUrl 图片地址
        * @param {Array.<number>} size 图片大小，例如：[22,37]
        * @param {number} rotation 旋转角度（弧度），顺时针方向为正。例如：顺时针方向偏转90度，对应的值是Math.PI/2
        * @param {boolean} rotateWithView 是否跟view一起旋转
        * @param {number} opacity 透明度，0到1之间的值
        * @param {Array.<number>} offset x、y方向的偏移，默认值是[0,0]。例如：[0,0]
        * @param {number} scale 图片缩放，默认为1
        * @param {Array.<number>} anchor Anchor. Default value is the icon center.
        */
        addImg:function(lon,lat,id,layerId,carImgUrl,size,rotation,rotateWithView,opacity,offset,scale,anchor){
        let carStyle = new Style({
        image:mapInit.generateIcon(carImgUrl||"../../static/assets/images/geolocation_marker_heading.png",size||[22,37],rotation||0,rotateWithView||true,opacity||1,offset||[0,0],scale,anchor)
        });
        mapInit.addPoint(lon,lat,id,carStyle,this.getLayerById(layerId));
        },


        

        /**                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
         * 向地图中添加规则图形形点
         * 
         * @param {number} lon 浮点型的值
         * @param {number} lat 浮点型的值
         * @param {string} id id
         * @param {string} layerId 图层id
         * 图形的样式
         * @param {module:ol/style/Fill~Fill} fill 填充样式。调用generateFill生成
         * @param {number} points 点数
         * @param {number} radius 半径
         * @param {number} radius1  外半径（星形）
         * @param {number} radius2  内半径（星形）
         * @param {number} angle 偏转角度，弧度
         * @param {module:ol/style/Stroke~Stroke} stroke 边线的样式。调用generateStroke函数生成
         * @param {number} rotation 旋转角度，弧度
         * @param {boolean} rotateWithView 是否和view一起偏转
        */
        addRegularShapePoint:function(lon,lat,id,layerId,fill, points, radius, radius1, radius2, angle, stroke, rotation, rotateWithView){
             let carStyle = new Style({
                image:mapInit.generateRegularShape(fill, points, radius, radius1, radius2, angle, stroke, rotation, rotateWithView)
            });
            mapInit.addPoint(lon,lat,id,carStyle,this.getLayerById(layerId));
        },
        /**
         * 向地图中添加普通点
         * @param {number} lon 浮点型的值
         * @param {number} lat 浮点型的值
         * @param {string} id 图片id
         * @param {string} layerId 图层id
         * 
         * @param {number} radius 圆的半径 默认值是5
         * @param {module:ol/color~Color | module:ol/colorlike~ColorLike} fillColor 颜色值，默认值是red，'black'、'red'、'green'、'white'、'#4271AE' 
         * @param {module:ol/color~Color | module:ol/colorlike~ColorLike} strokeColor 颜色值，默认值是green，'black'、'red'、'green'、'white'、'#4271AE'
         * @param {number} StrokeWidth 线宽度 默认值是3
         */
        addNormalPoint:function(lon,lat,id,layerId,radius,fillColor,strokeColor,StrokeWidth){
            let image = new CircleStyle({
                radius: radius||5,
                fill: new Fill({
                    color: fillColor||"red"
                }),
                stroke: new Stroke({
                    color: strokeColor||"green",
                    width: StrokeWidth||3
                })
            });
            let carStyle = new Style({
                image:image
            });
            mapInit.addPoint(lon,lat,id,carStyle,this.getLayerById(layerId));
        },

        /**
         * 向地图中添加文字
         * 
         * @param {number} lon 浮点型的值
         * @param {number} lat 浮点型的值
         * @param {string} id 图片id
         * @param {string} layerId 图层id
         * @param {string} text 显示的文字
         * @param {string} font 字体，默认值：'bold 14px "Open Sans", "Arial Unicode MS", "sans-serif"'
         * @param {string} placement 位置，可取值，line、point,默认值：line
         * @param {number} textOffsetX  x方向上的偏移，单位像素，默认值：0
         * @param {number} textOffsetY  y方向上的偏移，单位像素，默认值：0
         * @param {string} fillColor 文字颜色，默认值：white
         * @param {module:ol/style/Stroke~Stroke} stroke 绘制的线条的样式
         * @param {string} backgroundFillColor 文字颜色，默认值：black
         * @param {module:ol/style/Stroke~Stroke} backgroundStroke 背景边框绘制的线条的样式
         * @param {Array.<number>} padding 内边距，默认值是[0, 0, 0, 0]
         * 
         * @param {boolean} withImg 是否带图标
         * @param {string} imgUrl 图片地址
         * @param {Array.<number>} imgSize 图片大小，例如：[22,37]
         * @param {Array.<number>} imgOffset x、y方向的偏移，默认值是[0,0]。例如：[0,0]
         * @param {number} scale 图片缩放，默认为1
         */
        addText:function(lon,lat,id,layerId,text, font, placement, textOffsetX, textOffsetY, fillColor, stroke, backgroundFillColor, backgroundStroke, padding,withImg,imgUrl,imgSize,imgOffset,scale){
             let textStyle = null;
             if(withImg){
                textStyle = new Style({
                    image:mapInit.generateIcon(imgUrl||"../../static/assets/images/geolocation_marker_heading.png",imgSize||[22,37],0,true,1,imgOffset||[0,0],scale),
                    text:mapInit.generateText(text, font, placement, textOffsetX, textOffsetY, fillColor, stroke, backgroundFillColor, backgroundStroke, padding||[0, 0, 0, 0]),
                });
             }else{
                textStyle = new Style({
                    text:mapInit.generateText(text, font, placement, textOffsetX, textOffsetY, fillColor, stroke, backgroundFillColor, backgroundStroke, padding||[0, 0, 0, 0]),
                });
             }
             
            mapInit.addPoint(lon,lat,id,textStyle,this.getLayerById(layerId));
        },

        /**
         * 添加线条
         * @param {Array.<Array.<number>>} coordinates 坐标序列[[112,39],[113,40]]
         * @param {string} id 线条的ID
         * @param {module:ol/color~Color | module:ol/colorlike~ColorLike} color 颜色值，'black'、'red'、'green'、'white'、'#4271AE' [red, green, blue, alpha]
         * @param {string} lineCap 线端点的样式。butt, round, or square.
         * @param {string} lineJoin 线连接处的样式。bevel, round, or miter.
         * @param {Array.<number>} lineDash 虚线设置。[5,5]
         * @param {number} lineDashOffset 默认值是0。
         * @param {number} miterLimit 默认值10
         * @param {number} width 线宽度
         * @param {string} layerId 图层id
         */
        addLineString:function(coordinates, id, color, lineCap, lineJoin, lineDash, lineDashOffset, miterLimit, width, layerId) {
            let lineStyle = new Style({
                stroke:mapInit.generateStroke(color, lineCap, lineJoin, lineDash, lineDashOffset, miterLimit, width)
            });
            mapInit.addLineString(coordinates, id, lineStyle, this.getLayerById(layerId));            
        },
        /**
         * 向地图中添加圆
         *  @param {number} lon 经度，浮点型的值
         *  @param {number} lat 纬度，浮点型的值
         *  @param {number} radius 半径
         *  @param {any} id 唯一标识
         *  @param {module:ol/color~Color | module:ol/colorlike~ColorLike} fillColor 颜色值，'black'、'red'、'green'、'white'、'#4271AE' [red, green, blue, alpha]
         *  @param {module:ol/color~Color | module:ol/colorlike~ColorLike} strokeColor 颜色值，'black'、'red'、'green'、'white'、'#4271AE' [red, green, blue, alpha]
         *  @param {string} lineCap 线端点的样式。butt, round, or square.
         *  @param {string} lineJoin 线连接处的样式。bevel, round, or miter.
         *  @param {Array.<number>} lineDash 虚线设置。[5,5]
         *  @param {number} lineDashOffset 默认值是0。
         *  @param {number} miterLimit 默认值10
         *  @param {number} width 线宽度
         *  @param {module:ol/Layer} layer Openlayers的Layer对象
         */
        addCircle:function(lon, lat, radius, id,fillColor,strokeColor, lineCap, lineJoin, lineDash, lineDashOffset, miterLimit, width, layerId) {
            let circleStyle = new Style({
                stroke:mapInit.generateStroke(strokeColor, lineCap, lineJoin, lineDash, lineDashOffset, miterLimit, width),
                fill:mapInit.generateFill(fillColor)
            });
            mapInit.addCircle(lon, lat,radius, id, circleStyle, this.getLayerById(layerId));
        },
        /**
         * 添加面
         * @param {Array.<Array.<Array.<module:ol/coordinate~Coordinate>>>} coords 数组型的值
         * @param {string} id 线条的ID
         * @param {module:ol/color~Color | module:ol/colorlike~ColorLike} fillColor 颜色值，'black'、'red'、'green'、'white'、'#4271AE' [red, green, blue, alpha]
         * @param {module:ol/color~Color | module:ol/colorlike~ColorLike} strokeColor 颜色值，'black'、'red'、'green'、'white'、'#4271AE' [red, green, blue, alpha]
         * @param {string} lineCap 线端点的样式。butt, round, or square.
         * @param {string} lineJoin 线连接处的样式。bevel, round, or miter.
         * @param {Array.<number>} lineDash 虚线设置。[5,5]
         * @param {number} lineDashOffset 默认值是0。
         * @param {number} miterLimit 默认值10
         * @param {number} width 线宽度
         * @param {string} layerId 图层id
         */
        addMultiPolygon:function(coords, id, fillColor,strokeColor, lineCap, lineJoin, lineDash, lineDashOffset, miterLimit, width, layerId) {
            let polygonStyle = new Style({
                stroke:mapInit.generateStroke(strokeColor, lineCap, lineJoin, lineDash, lineDashOffset, miterLimit, width),
                fill:mapInit.generateFill(fillColor)
            });
            mapInit.addMultiPolygon(coords, id, polygonStyle, this.getLayerById(layerId));
        },
        /**
         * 添加箭头
         * @param {Array.<Array.<number>>} coordinates 坐标二维数组[[x1,y1],[x2,y2],[x3,y3]]
         * @param {*} id 箭头id
         * 
         * @param {module:ol/color~Color | module:ol/colorlike~ColorLike} color 颜色值，'black'、'red'、'green'、'white'、'#4271AE'
         * @param {string} lineCap 线端点的样式。butt, round, or square.
         * @param {string} lineJoin 线连接处的样式。bevel, round, or miter.
         * @param {Array.<number>} lineDash 虚线设置。[5,5]
         * @param {number} lineDashOffset 默认值是0。
         * @param {number} miterLimit 默认值10
         * @param {number} width 线宽度
         * 
         * @param {string} tailImgUrl 箭头尾的图片
         * @param {string} headImgUrl 箭头头的图片
         * @param {string} layerId 图层id
         */
        addArrow:function(coordinates, id, color, lineCap, lineJoin, lineDash, lineDashOffset, miterLimit, width, tailImgUrl, headImgUrl, layerId) {
            let lineStyle = new Style({
                stroke:mapInit.generateStroke(color, lineCap, lineJoin, lineDash, lineDashOffset, miterLimit, width)
            });
            mapInit.addArrow(coordinates, id, lineStyle, tailImgUrl||"../../static/assets/images/geolocation_marker.png", headImgUrl||"../../static/assets/images/geolocation_marker_heading.png", this.getLayerById(layerId));
        },
        /**
         * 将地图的中心移动到指定的点
         * @param {number} lon 浮点型的值
         * @param {number} lat 浮点型的值 
         */
        centerAt:function(lon,lat){
            this.$data.map.getView().setCenter([lon,lat]);
        },
        /**
         * 将地图缩放到某一级别
         * 
         * @param {number} level 整数值，取0到19的整数值
         */
        zoomTo:function(level){
            this.$data.map.getView().setZoom(level);
        },
        /**
         * 获取地图当前的矩形范围
         */
        getCurrentExtent:function(){
            return this.$data.map.getView().calculateExtent(this.$data.map.getSize());
        },
        /**
         * 获取地图当前的缩放级别
         */
        getCurrentLevel:function(){
            let z = parseInt(this.$data.map.getView().getZoom());
            return z;
        },
        /**
         * 移除地图上的要素
         * @param {*} id 要素id
         * @param {*} layerId 要素所在的图层ID
         */
        removeFeature:function(id, layerId) {
            let source = this.getLayerById(layerId).getSource();
            let f = source.getFeatureById(id);
            if (f != null) {
                source.removeFeature(f);
            }
        },
        /**
         * 移除所有要素
         * @param {*} layerId 要素所在的图层ID
         */
        removeAllFeature:function(layerId) {
            let source = this.getLayerById(layerId).getSource();
            if (source != null) {
                source.clear();
            }
        },
        // 绘制规划路线
        storkeLine(tracks) {
            
        },
        /**
         * 添加wms图层
         * 
         * @param {String} id 图层id
         * @param {String} url wms图层的地址
         * @param {String} layers wms图层的名称
         * @param {String} styles wms图层的样式，默认为空
         * @param {number} opacity wms图层的透明度，取值0~1,1不透明，0透明
         * @param {boolean} visble  wms是否可见，默认true
         * @param {String} version  wms是版本号
         */
        addWms:function(id,url,layers,styles,opacity,visble,version){
            mapInit.addWms(id,url,layers,styles,opacity,visble,version,this.$data.map)
        },
        // 规划路线
        translateCallback(data,color){

        },
        pageResize(){
            const borwserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.pageHeight = borwserHeight - 64;         
        },
        resize:function(size)
        {
            this.$data.map.setSize(size);
        }
    },
    created(){
        this.initUnintList();
        // this.initDatasourceList();
    },
    mounted(){
        this.pageResize();
        window.onresize = () => {
            // this.pageResize();
        }
        //初始化地图
        setTimeout(() => {
            this.initMap();
            this.$emit("MapInitComplete",this);

            
        }, 100);
    },
    destroyed(){

    }
}
</script>
<style>

    #map {
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin:0;
        font-family:"微软雅黑";

        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    .map:-moz-full-screen {
        height: 100%;
    }
    .map:-webkit-full-screen {
        height: 100%;
    }
    .map:-ms-fullscreen {
        height: 100%;
    }
    .map:fullscreen {
        height: 100%;
    }
    .ol-rotate {
        top: 3em;
    }

    .ol-popup {
        position: absolute;
        background-color: white;
        -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        min-width: 280px;
    }
    .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    .ol-popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
    }
    .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
    }
    .ol-popup-closer {
        text-decoration: none;
        position: absolute;
        top: 18px;
        right: 18px;
        font-size: 16px;
        color: #F59307;
        cursor: pointer;
        z-index: 9999;
    }
    .ol-popup-closer:hover{
        color: rgb(238, 195, 131);
    }
    .ol-popup-closer:after {
        content: "✖";        
    }
   

    .yk-pointer-normal{
        cursor: default;
    }
</style>
