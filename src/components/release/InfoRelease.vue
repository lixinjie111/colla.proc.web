<template>
 
    <div id="ykMap" class="yk-map">

        <!-- 高德地图组件 -->
        <!-- <el-amap vid="amapDemo" :mapStyle="mapStyle">
            <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position"></el-amap-marker>
        </el-amap>
         -->

         <!-- <div id="container">

         </div> -->
        

        <!-- openlayer地图 -->
        <div>
            <InfoMapOL ref="refInfoMap" :msgTypeInfo="search.pubMsg"></InfoMapOL>
        </div>

        <!-- 左侧信息 -->
        <div class="yk-left">
            <!-- <el-card :body-style="{ padding: '0px' }"> 
                <img src="static/images/ico1.png" class="image">
                <div class="yk-card-title">
                    <span >27</span>
                </div>
            </el-card>

            <el-card :body-style="{ padding: '0px' }">
                <img src="static/images/ico2.png" class="image">
                <div class="yk-card-title">
                    <span>30</span>                    
                </div>
            </el-card>

            <el-card :body-style="{ padding: '0px' }">
                <img src="static/images/ico3.png" class="image">
                <div class="yk-card-title">
                    <span>22</span>
                </div>
            </el-card> -->

            <el-card v-for="(item,index) in statisicsData" :key="index" :body-style="{ padding: '0px' }">
                <!-- 背景图片 -->
                <!-- <img src="static/images/ico-bg.png" class="image-bg">
                <img :src="iconPath + item.icon" class="image"> -->
                <div class="image-box">
                    <img :src="iconPath + item.icon" class="image">
                </div>
                <div class="yk-card-title">
                    <span>{{item.num}}</span>
                </div>
            </el-card>           

        </div>

        <!-- 右侧信息 -->
        <div class="yk-right">
            <el-form size="mini">

                <el-form-item class="yk-f-right">
                     <!-- @change="publishMsgHandler" -->
                    <el-select placeholder="发布信息" v-model="search.pubMsg" :clearable='clearPoiSelect' value-key="name">                        
                        <el-option-group v-for="(group,groupIndex) in pubMsgGroup" label="发布信息" :key="groupIndex">
                            <template v-for="(item,index) in pubMsgList">
                                <el-option :key="index" :value="item" :disabled="item.disabled" @click.native="pubMsgClick(item);">                                        
                                    {{item.name}}
                                </el-option>
                            </template>
                        </el-option-group>
                    </el-select>                    
                </el-form-item>

                <el-form-item class="yk-f-right">
                     <!-- @change="poiHandler" -->
                    <el-select placeholder="POI" v-model="search.poi" :clearable='clearPoiSelect'>                                    
                        <el-option-group v-for="(group,groupIndex) in poiGruop" label="POI" :key="groupIndex">            
                            <template v-for="(item,index) in poiList">
                                <el-option :key="index" :value="item" :disabled="item.disabled" @click.native="poiClick(item);">
                                    <!-- <el-checkbox v-model="olMarker[item.value]"></el-checkbox> -->                                    
                                    {{item.value}}                                
                                </el-option>
                            </template>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                
            </el-form>
        </div>
    </div>

</template>
<script>

import Vue from 'vue';
import TDate from '@/common/date.js'

import InfoMapOL from '@/components/release/InfoMap_ol.vue'

export default {
    components: {
        InfoMapOL,
    },
    data(){
        return {
            iconPath: window.cfg.iconPath,
            map: null,
            mapStyle: 'amap://styles/macaron',
            mapMarker: {

                rsu: false,     // rsu
                rsuList: [],
                
                roadsideUnit: false,    // 路侧单元
                roadsideUnitList: [],
                
                trafficSignal: false,   // 交通信号灯
                trafficSignalList: [],      

                obstacleList: [],   // 障碍物
                goodsDropList: [],  // 货物散落
                roadWorksList: [],  // 道路施工
                msgList: [],        // 障碍物 + 货物散落 + 道路施工
            },
            tempMarker: {
                lon: '',
                lat: '',
                icon: '',
                name: '',
                type: '',
            },
            search: {
                poi: '',
                pubMsg: '',
            },
            popData: {
                title: '提示',
                type: 'info-type-normal',
                msg: '这是一段信息',
                data: {},
                visible: true,
            },
            poiList: [                
                { id: 1, name: 'RSU', value: 'rsu', isCheck: false},
                { id: 2, name: '路侧单元', value: 'roadsideUnit', isCheck: false},
                { id: 3, name: '红绿灯', value: 'trafficSignal', isCheck: false},
            ],
            pubMsgList: [
                
                // { id: 1, name: '障碍物', value: '障碍物', isCheck: false},
                // { id: 2, name: '道路施工', value: '道路施工', isCheck: false},
                // { id: 3, name: '货物散落', value: '货物散落', isCheck: false},
            ],
            markers: [],
            inforWindowInstance: null,
            circleInstance: null,

            poiGruop: [{id:1}],
            pubMsgGroup: [{id: 1}],

            paging: {
                index: 0,
                size: 10,
                total: 0,
            }, 
            statisicsData: [],
            olMarker: {
                show: false,
                rsu: false,     // rsu
                roadsideUnit: false,    // 路侧单元
                trafficSignal: false,   // 交通信号灯
            },
            clearPoiSelect: true,
        }
    },
    methods: {
        initPaging(){
            this.paging.index = 0;
            this.paging.size = 10;
            this.paging.total = 0;
        },
        initMap(){
            this.map = new AMap.Map('container', {
                resizeEnable: true,
                zoom:11,
                center: [116.397428, 39.90923],
                mapStyle: "amap://styles/macaron",
            });
        },

        initStatisics(){
            
            let url = 'event/task/statisticsTask';
            let params = {                
                
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        this.statisicsData = response.data ? response.data : [];

                    } else {                     
                        this.$message("获取信息列表失败 ！"); 
                    }
                }
            );
        },
        initMsgList(){
            
            this.initStatisics();
            this.clearMsgList();

            let url = 'event/task/findEffectiveList';
            let params = {                
                
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        let t = response.data ? response.data : [];

                        for(let i=0;i<t.length;i++){
                            let item = t[i];
                            let icon = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';
                            if(item.icon){
                                icon = this.iconPath + item.icon;
                            }
                            
                            var marker = new AMap.Marker({
                                extData: item.id,
                                title: item.eventType,
                                // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                                icon: icon,
                                // icon: "static/images/poi_2.png",
                                position: [item.longitude, item.latitude],
                                // position: [116.405467, 39.907761]
                            });
                            // 给marker添加点击事件
                            marker.on('click',this.markerClick);
                            this.map.add(marker);                                    
                            this.mapMarker.msgList.push(marker);
                            
                        }
                        
                    } else {                     
                        this.$message("获取信息列表失败 ！"); 
                    }
                }
            );
        },
        clearMsgList(){
            for(let i=0;i<this.mapMarker.msgList.length;i++){
                let t = this.mapMarker.msgList[i];
                this.map.remove(t);
            }
        },

        initPubMsgList(){
            let url = 'event/info/queryPage';
            let params = {
                code: this.search.code,
                "page": {    
                    "pageIndex": 0,
                    "pageSize": 100,
                },
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        this.pubMsgList = response.data.list;
                      
                        // this.paging.total = response.data.totalCount;
                        
                    } else {                     
                        this.$message("获取信息类型列表失败  ！"); 
                    }
                }
            );
        },
        
        poiClick(item){
            
            if(!item) return;
            // item.isCheck = !item.isCheck;
            let type = item.value;
            this.olMarker[type] = !this.olMarker[type];

            this.$refs.refInfoMap.showMarker(type,this.olMarker[type]);
        },
        // 显示poi
        poiHandler(){

            let type = this.search.poi ? (this.search.poi.value ? this.search.poi.value : '') : '';
            if(!type) return;

            let isCheck = this.search.poi.isCheck = !this.search.poi.isCheck;            

            switch(type){
                case 'RSU':
                    this.showRsu(isCheck);
                    break;
                case '路侧单元':
                    this.showRoadsideUnit(isCheck);
                    break;
                case '红绿灯':
                    this.showTrafficSignal(isCheck);
                    break;
            }
        },
       
        pubMsgClick(item){
            this.$refs.refInfoMap.addMapClickEvent();
        },
        //发布信息
        publishMsgHandler(){
           
            this.map.off('click', this.addMsgClick);    // 移除事件
            // this.map.off('dblclick', showInfoDbClick);
                // this.map.off('mousemove', showInfoMove);

            // let type = this.search.pubMsg;
            
            // if(type != '发布信息'){   // 添加事件 ，修改类型 ， 
              
                console.log("绑定事件!");  
                this.map.on('click', this.addMsgClick);        // 单击事件
                // this.map.on('dblclick', showInfoDbClick);   // 双击事件
                // this.map.on('mousemove', showInfoMove);     // 鼠标移动事件
            // }
        },
        addMsgClick(e){

            // ol
            

            // 高德地图
            var text = '您在 [ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ] 的位置单击了地图！';
            
            // 动态读取图标
            let icon = window.cfg.iconPath + this.search.pubMsg.icon;

            this.tempMarker.lon = e.lnglat.getLng();
            this.tempMarker.lat = e.lnglat.getLat();
            this.tempMarker.icon = icon;


            // // 判断一下图标类型
            // let icon = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';
            // let tlist = [];
            // let type = this.search.pubMsg;
            // if(type == '障碍物'){
            //     icon = 'static/images/ico1_min.png';
            // }else if(type == '道路施工'){
            //     icon = 'static/images/ico2_min.png';
            // }else if(type == '货物散落'){
            //     icon = 'static/images/ico3_min.png';
            // }

            let lon = e.lnglat.getLng();
            let lat = e.lnglat.getLat();

            let tMarker = {
                id: '',
                lon: lon,
                lat: lat,
                eventType: this.search.pubMsg.name,
                isEdit: false,
            };
            this.initInfoWindow(tMarker);
            
            // let marker =  new AMap.Marker({
            //     // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            //     icon: icon,
            //     position: [lon, lat],
            //     offset: new AMap.Pixel(0,-20)
            // });
           
            // this.map.add(marker);

            // // 给marker添加点击事件
            // marker.on('click',this.markerClick);
        },
        markerClick(e){

            let lon = e.lnglat.lng;
            let lat = e.lnglat.lat;
            // this.drawCircle(lon,lat);

            this.circleInstance = new AMap.Circle({
                center: [lon, lat],
                radius: 1000, //半径
                borderWeight: 1,
                strokeColor: "#FFA500", 
                strokeOpacity: 1,
                strokeWeight: 6,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                strokeStyle: 'solid',
                strokeDasharray: [10, 10], 
                // 线样式还支持 'dashed'
                fillColor: '#FFA500',
                zIndex: 50,
                offset: new AMap.Pixel(500, 500),
            })

            // circle.setMap(this.map)
            this.map.add(this.circleInstance);

            let id = e.target.getExtData();
            let eventType = e.target.getTitle();

            let tMarker = {
                id: id,
                lon: lon,
                lat: lat,
                eventType: eventType,
                isEdit: true,
            };
            this.initInfoWindow(tMarker);
        },
       
        // rsu
        showRsu(isCheck){
            // this.mapMarker.rsu = !this.mapMarker.rsu;
            this.clearRsu();
            if(isCheck){
                // var marker = new AMap.Marker({
                //     // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                //     icon: "static/images/poi_2.png",
                //     position: [116.405467, 39.907761]
                // });
                // this.map.add(marker);
                // this.map.setFitView();                
                // this.mapMarker.rsuList.push(marker);
                
                this.initRsu();
            }            
        },

        clearRsu(){
            for(let i=0;i<this.mapMarker.rsuList.length;i++){
                let marker = this.mapMarker.rsuList[i];
                this.map.remove(marker);                    
            }
            this.mapMarker.rsuList = [];
        },

        initRsu(){
            let url = 'common/queryRsu';
            let params = {                
                "distcode": "110108"
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        let rsuList = response.data ? response.data : [];      
                        for(let i=0;i<rsuList.length;i++){
                            let item = rsuList[i];
                            let marker = new AMap.Marker({
                                // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                                icon: "static/images/poi_2.png",
                                position: [item.longitude, item.latitude]
                            });
                            this.map.add(marker);             
                            this.mapMarker.rsuList.push(marker);
                        }

                        let lon = rsuList.length ? rsuList[0].longitude : '116.397';
                        let lat = rsuList.length ? rsuList[0].latitude : '39.918';
                        this.map.setCenter([lon,lat]);

                        // var marker = new AMap.Marker({
                        //     // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        //     icon: "static/images/poi_2.png",
                        //     position: [116.405467, 39.907761]
                        // });
                        // this.map.add(marker);
                        // this.map.setFitView();                
                        // this.mapMarker.rsuList.push(marker);
                        
                    } else {                     
                        this.$message("获取设备列表失败 ！"); 
                    }
                }
            );
        },
        // 路侧单元
        showRoadsideUnit(){
            this.mapMarker.roadsideUnit = !this.mapMarker.roadsideUnit;
            this.clearRoadsideUnit();
            if(this.mapMarker.roadsideUnit){
                // var marker = new AMap.Marker({
                //     // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                //     icon: "static/images/poi_1.png",
                //     position: [116.405467, 39.907761]
                // });
                // this.map.add(marker);
                // this.map.setFitView();                
                // this.mapMarker.roadsideUnitList.push(marker);

                this.initRoadsideUnit();
            }
        },
        clearRoadsideUnit(){
            for(let i=0;i<this.mapMarker.roadsideUnitList.length;i++){
                let marker = this.mapMarker.roadsideUnitList[i];
                this.map.remove(marker);
            }
            this.mapMarker.roadsideUnitList = [];
        },
        initRoadsideUnit(){
            let url = 'common/queryRoadSide';
            let params = {
                "distcode": "110108"
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        let roadsideUnitList = response.data ? response.data : [];    
                        for(let i=0;i<roadsideUnitList.length;i++){
                            let item = roadsideUnitList[i];
                            let marker = new AMap.Marker({
                                // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                                icon: "static/images/poi_1.png",
                                position: [item.longitude, item.latitude]
                            });
                            this.map.add(marker);           
                            this.mapMarker.roadsideUnitList.push(marker);
                        }

                        let lon = roadsideUnitList.length ? roadsideUnitList[0].longitude : '116.397';
                        let lat = roadsideUnitList.length ? roadsideUnitList[0].latitude : '39.918';
                        this.map.setCenter([lon,lat]);

                        // var marker = new AMap.Marker({
                        //     // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        //     icon: "static/images/poi_1.png",
                        //     position: [116.405467, 39.907761]
                        // });
                        // this.map.add(marker);
                        // // this.map.setFitView();                
                        // this.mapMarker.roadsideUnitList.push(marker);
                        
                    } else {                     
                        this.$message("获取路侧单元失败 ！"); 
                    }
                }
            );
        },
        // 红绿灯
        showTrafficSignal(){
            this.mapMarker.trafficSignal = !this.mapMarker.trafficSignal;
            this.clearTrafficSignal();

            if(this.mapMarker.trafficSignal){
                // var marker = new AMap.Marker({
                //     // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                //     icon: "static/images/poi_3.png",
                //     position: [116.405467, 39.907761]
                // });
                // this.map.add(marker);
                // this.map.setFitView();                
                // this.mapMarker.trafficSignalList.push(marker);

                this.initTrafficSignal();
            }
        },
        clearTrafficSignal(){
            for(let i=0;i<this.mapMarker.trafficSignalList.length;i++){
                let marker = this.mapMarker.trafficSignalList[i];
                this.map.remove(marker);                    
            } 
            this.mapMarker.trafficSignalList = [];
        },
        initTrafficSignal(){
            let url = 'common/queryLight';
            let params = {
                "distcode": "310104"
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        let trafficSignalList = response.data ? response.data : [];    
                        for(let i=0;i<trafficSignalList.length;i++){
                            let item = trafficSignalList[i];
                            let marker = new AMap.Marker({
                                // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                                icon: "static/images/poi_3.png",
                                position: [item.longitude, item.latitude]
                            });
                            this.map.add(marker);           
                            this.mapMarker.trafficSignalList.push(marker);
                        }

                        let lon = trafficSignalList.length ? trafficSignalList[0].longitude : '116.397';
                        let lat = trafficSignalList.length ? trafficSignalList[0].latitude : '39.918';
                        this.map.setCenter([lon,lat]);

                        // var marker = new AMap.Marker({
                        //     // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        //     icon: "static/images/poi_3.png",
                        //     position: [116.405467, 39.907761]
                        // });
                        // this.map.add(marker);
                        // // this.map.setFitView();                
                        // this.mapMarker.trafficSignalList.push(marker);
                        
                    } else {                     
                        this.$message("获取路侧单元失败 ！"); 
                    }
                }
            );
        },

        // 创建infowindow模板
        inforWindowHtml(){

            // <el-form-item label="信息类型" class="yk-bottom-6">
            //                     <el-select size="mini" v-model="select.eventType" placeholder="请选择">
            //                         <template v-for="(item,index) in typeList">
            //                             <el-option :key="index" :label="item.name" :value="item.key">{{item.name}}</el-option>
            //                         </template>
            //                     </el-select>
            //                 </el-form-item>
            return `
                <div>
                    <el-row class="yk-pad-10 yk-bottom-border">
                        <label class="yk-info-window-title">交通信息发布</label>                        
                    </el-row>
                    <el-row class="yk-pad-1040">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" label-width="120px" class="demo-ruleForm yk-left">

                            <el-form-item label="信息类型" class="yk-bottom-6">                               
                                <label>{{eventType}}</label>
                            </el-form-item>

                            <el-form-item label="中心位置" prop="name" class="yk-bottom-6">                                
                                <label>{{longitude + ',' + latitude}}</label>
                            </el-form-item>

                            <el-form-item label="广播范围" prop="name" class="yk-bottom-6" style="height: 55px;">
                                <el-slider v-model="affectRange" :marks="broadcastRangeMarks" :max="select.broadcastMax" :step="select.broadcastStep" @change="sliderChange"></el-slider>
                            </el-form-item>

                            <el-form-item label="信息内容" prop="name" class="yk-bottom-6">
                                <el-input type="textarea" size="mini" v-model="content"></el-input>
                            </el-form-item>

                            <el-form-item label="默认广播频率" prop="frequency" class="yk-bottom-6">
                                <el-input size="mini" v-model="frequency">
                                <template slot="append">
                                    <el-select class="yk-w-80" v-model="frequencyUnit" placeholder="请选择">
                                    <el-option
                                    v-for="item in frequencyUnitList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item">
                                    </el-option>
                                </el-select>
                                </template>
                                </el-input>            
                            </el-form-item>
                            
                            <el-form-item label="发送生效时间" prop="" class="yk-bottom-6">
                                <el-date-picker
                                    v-model="beginTime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="发送失效时间" prop="" class="yk-bottom-6">
                                <el-date-picker
                                    v-model="endTime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item v-show="isEdit" label="信息来源" class="yk-bottom-6">
                                <el-select size="mini" v-model="trafficSource" placeholder="请选择">
                                    <template v-for="(item,index) in trafficSourceList">
                                        <el-option :key="index" :label="item.name" :value="item.key">{{item.name}}</el-option>
                                    </template>
                                </el-select>
                            </el-form-item>

                            <el-form-item>
                                <el-button v-show="!isEdit" @click="publichInfo();">发布</el-button>
                                <el-button v-show="!isEdit" @click="closeInforWindow();">取消</el-button>

                                <el-button v-show="isEdit" @click="updateInfo();">更新</el-button>
                                <el-button v-show="isEdit" @click="destroyInfo();">手动失效</el-button>
                                
                            </el-form-item>

                        </el-form>
                    </el-row>
                </div>
            `
        },


        // 自定义高德地图信息窗体
        initInfoWindow(marker){

    
            let inforWindowHtml = this.inforWindowHtml();

            var lnglat = new AMap.LngLat(marker.lon,marker.lat);

            var _this = this    
            var MyComponent = Vue.extend({
                template: inforWindowHtml,//'<a style="color:#07bb49;" v-on:click="world()">add Shop</a>',
                data(){
                    return {
                        typeList: [],       // 消息类型
                        frequencyUnitList: [],     // 单位list

                        broadcastStep: 100,
                        broadcastMax: 3000,
                        msgSource: '',
                        isEdit: marker.isEdit,

                        eventType: marker.eventType,                            

                        longitude: marker.lon,
                        latitude: marker.lat,
                        affectRange: 1000,
                        content: '',
                        frequency: 500,
                        frequencyUnit: '',
                        beginTime: '',
                        endTime: '',
                        datasource: '',
                        trafficSource: '',

                        select: {                                                                
                            broadcastStep: 100,
                            broadcastMax: 3000,
                            msgSource: '',
                            isEdit: marker.isEdit,

                            eventType: marker.eventType,                            

                            longitude: marker.lon,
                            latitude: marker.lat,
                            affectRange: 1000,
                            content: '',
                            frequency: 500,
                            frequencyUnit: '',
                            beginTime: '',
                            endTime: '',
                            datasource: '',
                            trafficSource: '',
                        },
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
                        trafficSourceList: [],
                        ruleForm: {
                            name: '',
                            eventCategory: '',
                            frequency: '',
                            frequencyUnit: '',
                            delivery: false,
                            content: '',
                        },
                        rules: {
                        // name: [
                        //   { required: true, message: '请输入信息类型名称', trigger: 'blur' },
                        //   // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                        // ],
                        // region: [
                        //   { required: true, message: '请选择活动区域', trigger: 'change' }
                        // ],
                        // date1: [
                        //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                        // ],
                        // date2: [
                        //   { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                        // ],
                        // type: [
                        //   { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                        // ],
                        // resource: [
                        //   { required: true, message: '请选择活动资源', trigger: 'change' }
                        // ],
                        // desc: [
                        //   { required: true, message: '请填写活动形式', trigger: 'blur' }
                        // ]
                        }
                    }
                },
                
                methods:{
                    initSelect(data){
                        this.eventType =  marker.eventType;
                        this.longitude = marker.lon;
                        this.latitude = marker.lat;
                        this.affectRange = 1000;
                        this.content = '';
                        this.frequency = 500;
                        this.frequencyUnit = '';
                        this.beginTime = '';
                        this.endTime = '';
                        this.datasource = '';
                        this.trafficSource = '';
                    },
                    initDetail() {
                        let url = 'event/task/findDetail';
                        let params = {
                            id: marker.id,
                        };
                        this.$api.post( url,params,
                            response => {
                                if (response.status >= 200 && response.status < 300) {

                                    this.isEdit = marker.isEdit;
                                    this.eventType = response.data.eventType;
                                    this.longitude = response.data.longitude;
                                    this.latitude = response.data.latitude;
                                    this.affectRange = response.data.affectRange;
                                    this.content = response.data.content;
                                    this.frequency = response.data.frequency;
                                    this.frequencyUnit = response.data.frequencyUnit;
                                    this.beginTime = response.data.beginTime;
                                    this.endTime = response.data.endTime;
                                    this.datasource = response.data.datasource;
                                    this.trafficSource = response.data.trafficSource;

                                    // this.select.eventType = response.data.eventType;
                                    // this.select.longitude = response.data.longitude;
                                    // this.select.latitude = response.data.latitude;
                                    // this.select.affectRange = response.data.affectRange; 
                                    // this.select.content = response.data.content; 
                                    // this.select.frequency = response.data.frequency; 
                                    // this.select.frequencyUnit = response.data.frequencyUnit; 
                                    // this.select.beginTime = response.data.beginTime; 
                                    // this.select.endTime = response.data.endTime; 
                                    // this.select.datasource = response.data.datasource; 
                                    // this.select.trafficSource = response.data.trafficSource;                                   

                                    if(response.data.status == 200){
                                        
                                        this.$message('获取详情成功！');
                                    }
                                    
                                } else {                     
                                    this.$message("获取详情失败 ！"); 
                                }
                            }
                        );
                    },
                                         
                    publichInfo(){
                        this.doPublish();
                        this.closeInforWindow();
                    },
                    updateInfo(){
                        this.doUpdate();
                        this.closeInforWindow();
                    },
                    destroyInfo(){
                        this.doDestroy();
                        this.closeInforWindow();                        
                    },
                    closeInforWindow(){
                        _this.inforWindowInstance.close();
                        if(_this.circleInstance){
                            _this.map.remove(_this.circleInstance);
                        }
                        _this.circleInstance = null;
                        _this.inforWindowInstance = null;
                    },
                    sliderChange(value){
                        console.log('sliderChange --- ' + value)
                        _this.circleInstance.setRadius(value);
                    },
                    
                    doPublish(){

                        let url = 'event/task/save';
                        let params = {
                            eventType: this.select.eventType,      //信息类型
                            longitude: this.select.longitude,      // 经度
                            latitude: this.select.latitude,       // 纬度
                            affectRange: this.select.affectRange,    // 广播范围
                            content: this.select.content,        // 信息内容
                            frequency: this.select.frequency,      // 广播频率
                            frequencyUnit: this.select.frequencyUnit.key,      // 频率单位
                            beginTime: TDate.formatTime(this.select.beginTime),      // 生效时间
                            endTime: TDate.formatTime(this.select.endTime),     // 失效时间
                            datasource: this.select.datasource,     // 信息来源
                        };

                        this.$api.post( url,params,
                            response => {
                                if (response.status >= 200 && response.status < 300) {

                                    console.log('response.data ---- ' + JSON.stringify(response.data))
                                    
                                    if(response.data.status == 200){
                                        _this.initMsgList();
                                        this.$message('发布成功！');
                                    }
                                    
                                } else {                     
                                    this.$message("发布失败 ！"); 
                                }
                            }
                        );
                    },
                    doUpdate(){
                        
                        let url = 'event/task/update';
                        let params = {
                            id: marker.id,
                            eventType: this.select.eventType,      //信息类型
                            longitude: this.select.longitude,      // 经度
                            latitude: this.select.latitude,       // 纬度
                            affectRange: this.select.affectRange,    // 广播范围
                            content: this.select.content,        // 信息内容
                            frequency: this.select.frequency,      // 广播频率
                            frequencyUnit: this.select.frequencyUnit.key,      // 频率单位
                            beginTime: TDate.formatTime(this.select.beginTime),      // 生效时间
                            endTime: TDate.formatTime(this.select.endTime),     // 失效时间
                            datasource: this.select.datasource,     // 信息来源
                        };

                        this.$api.post( url,params,
                            response => {
                                if (response.status >= 200 && response.status < 300) {

                                    console.log('response.data ---- ' + JSON.stringify(response.data))
                                    
                                    if(response.data.status == 200){
                                        _this.initMsgList();
                                        this.$message('更新成功！');
                                    }
                                    
                                } else {                     
                                    this.$message("更新失败 ！"); 
                                }
                            }
                        );
                    },
                    doDestroy(){
                        let url = 'event/task/cancel';
                        let params = {
                            id: marker.id,
                            // eventType: this.select.eventType,      //信息类型
                            // longitude: this.select.longitude,      // 经度
                            // latitude: this.select.latitude,       // 纬度
                            // affectRange: this.select.affectRange,    // 广播范围
                            // content: this.select.content,        // 信息内容
                            // frequency: this.select.frequency,      // 广播频率
                            // frequencyUnit: this.select.frequencyUnit.key,      // 频率单位
                            // beginTime: TDate.formatTime(this.select.beginTime),      // 生效时间
                            // endTime: TDate.formatTime(this.select.endTime),     // 失效时间
                            // datasource: this.select.datasource,     // 信息来源
                        };

                        this.$api.post( url,params,
                            response => {
                                if (response.status >= 200 && response.status < 300) {

                                    console.log('response.data ---- ' + JSON.stringify(response.data))
                                    
                                    if(response.data.status == 200){
                                        _this.initMsgList();
                                        this.$message('手动失效成功！');
                                    }
                                    
                                } else {                     
                                    this.$message("手动失效失败 ！"); 
                                }
                            }
                        );
                    },
                    initTrafficSource(){
                        let url = 'common/queryDictionary';
                        let params = {
                            parentCode: 'trafficSource',
                        };
                        this.$api.post( url,params,
                            response => {
                                if (response.status >= 200 && response.status < 300) {

                                    this.trafficSourceList = response.data ? response.data : [];
                                    if(this.trafficSourceList.length){
                                                        
                                        // this.ruleForm.frequencyUnit = this.frequencyUnitList[0];
                                        this.select.trafficSource = this.trafficSourceList[0];
                                    }
                                
                                } else {                     
                                    this.$message("获取单位失败 ！"); 
                                }
                            }
                        );
                    },
                    initUnintList(){
                        let url = 'common/queryDictionary';
                        let params = {
                            parentCode: 'timeUnit',
                        };
                        this.$api.post( url,params,
                            response => {
                                if (response.status >= 200 && response.status < 300) {

                                    this.frequencyUnitList = response.data ? response.data : [];
                                    if(this.frequencyUnitList.length){
                                                        
                                        // this.ruleForm.frequencyUnit = this.frequencyUnitList[0];
                                        this.select.frequencyUnit = this.frequencyUnitList[0];
                                    }
                                
                                } else {                     
                                    this.$message("获取单位失败 ！"); 
                                }
                            }
                        );
                    },
                    formatTime(value){
                        let t = new Date(value);
                        let year = t.getFullYear;
                        let month = t.getMonth;
                    }
                },
                
                created(){                    
                    this.initUnintList();
                    this.initTrafficSource();
                    this.initSelect();
                    if(marker.id){
                        this.initDetail();
                    }
                },
                destroyed(){
                    console.log('mycomponet destory ');
                }
            });
            var component= new MyComponent().$mount();
            
            this.inforWindowInstance = null;
            // 创建一个自定义内容的 infowindow 实例
            if(!this.inforWindowInstance){
                this.inforWindowInstance = new AMap.InfoWindow({
                    position: lnglat,
                    offset: new AMap.Pixel(0, -35),
                    content: component.$el
                });  
                
            }else{
                this.inforWindowInstance.setPosition(lnglat);
            }                      

            this.inforWindowInstance.open(this.map);

            // 将当前经纬度展示在 infowindow 的 input 中
            function getLngLat(){
                var lnglatInput = document.getElementById('lnglat');

                lnglatInput.setAttribute('value', lnglat.toString());
            }
        },

        // drawCircle(lon,lat,radius=1000){

        //     // lon = 116.715688;
        //     // lat = 40.04848;
            
        //     var circle = new AMap.Circle({
        //         center: [lon, lat],
        //         radius: radius, //半径
        //         borderWeight: 1,
        //         strokeColor: "#FFA500", 
        //         strokeOpacity: 1,
        //         strokeWeight: 6,
        //         strokeOpacity: 0.2,
        //         fillOpacity: 0.4,
        //         strokeStyle: 'solid',
        //         strokeDasharray: [10, 10], 
        //         // 线样式还支持 'dashed'
        //         fillColor: '#FFA500',
        //         zIndex: 50,
        //         offset: new AMap.Pixel(500, 500),
        //     })

        //     circle.setMap(this.map)
        // },

        
        
        handleClose(){

        },

    },
    created(){
        // this.initStatisics();
    },
    mounted(){
        this.initMap();
        this.initMsgList();
        this.initStatisics();
        this.initPubMsgList();        
    },

}
</script>
<style scoped>

   

    #container {
        width: 100%;
        height: 100%;
    }

    .el-card{
        width: 80px;
        height: 80px;
        padding: 6px;
        margin-bottom: 20px;
    }
    .image-bg{
        /* top: 3px;
        left: 0;
        right: 0; */
        width: 44px;
        /* position: absolute; */
        margin: 0 auto;
    }
    .image-box{
        width: 44px;
        height: 44px;
        margin: 0 auto;
        background-image: url('./ico-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .image{
        /* margin-top: 3px;
        width: 32px; */
        /* left: 0;
        right: 0;
        top: 8px; */
        /* position: absolute; */
        margin: 0 auto;
        position: relative;
        top: 50%; /*偏移*/
        transform: translateY(-50%);
    }
    #ykMap {
        width: 100%;
        height: 100%;
    }
    .yk-map{
        width:100%;
        height: 100%;
        position: relative;
    }

    .yk-left{
        left: 30px;
        top: 30px;
        position: absolute;
    }

    .yk-right{
        right: 30px;
        top: 30px;
        position: absolute;
    }

    .yk-f-right{
        float: right;
        margin-right: 10px;
    }

    .yk-card-title{
        color: #F59307;
        padding-top: 3px;
        font-weight: bold;
        font-size: 16px;
        user-select: none;
    }

    .yk-form{
        top: 200px;
        left: 200px;
        position: absolute;
        background: #ffffff;
    }

    

</style>

