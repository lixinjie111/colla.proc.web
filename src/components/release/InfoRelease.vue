<template>
 
    <div id="ykMap" class="yk-map">

        <!-- 高德地图组件 -->
        <!-- <el-amap vid="amapDemo" :mapStyle="mapStyle">
            <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position"></el-amap-marker>
        </el-amap> -->
        <div id="container">

        </div>

        <!-- 左侧信息 -->
        <div class="yk-left">
            <el-card :body-style="{ padding: '0px' }"> 
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
            </el-card>

        </div>

        <!-- 右侧信息 -->
        <div class="yk-right">
            <el-form size="mini">

                <el-form-item class="yk-f-right">
                    <el-select placeholder="发布信息" v-model="search.pubMsg" @change="publishMsgHandler">                        
                        <el-option-group v-for="(item,index) in pubMsgGroup" label="发布信息" :key="index">
                            <template v-for="(item,index) in pubMsgList">
                                <el-option :key="index" :value="item.value" :disabled="item.disabled">                                        
                                    {{item.value}}
                                </el-option>
                            </template>
                        </el-option-group>
                    </el-select>
                </el-form-item>

                <el-form-item class="yk-f-right">
                    <el-select placeholder="POI" v-model="search.poi" @change="poiHandler">                                    
                        <el-option-group v-for="(item,index) in poiGruop" label="POI" :key="index">            
                            <template v-for="(item,index) in poiList">
                                <el-option :key="index" :value="item" :disabled="item.disabled">

                                    <el-checkbox v-model="item.isCheck" @click.prevent="poiCheckHandler"></el-checkbox>
                                    
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

export default {
    data(){
        return {
            map: null,
            mapStyle: 'amap://styles/macaron',
            mapMarker: {

                rsu: false,     // rsu
                rsuList: [],
                
                roadsideUnit: false,    // 路侧单元
                roadsideUnitList: [],
                
                trafficSignal: false,
                trafficSignalList: [],      // 交通信号灯

                obstacleList: [],   // 障碍物
                goodsDropList: [],  // 货物散落
                roadWorksList: [],  // 道路施工
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
                
                { id: 1, name: 'RSU', value: 'RSU', isCheck: false},
                { id: 2, name: '路侧单元', value: '路侧单元', isCheck: false},
                { id: 3, name: '红绿灯', value: '红绿灯', isCheck: false},
            ],
            pubMsgList: [
                
                { id: 1, name: '障碍物', value: '障碍物', isCheck: false},
                { id: 2, name: '道路施工', value: '道路施工', isCheck: false},
                { id: 3, name: '货物散落', value: '货物散落', isCheck: false},
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

            // this.initInfoWindow(116.397,39.918);
        },
        
        // 显示poi
        poiHandler(){
            let type = this.search.poi.value;
            let isCheck = this.search.poi.isCheck = !this.search.poi.isCheck;
            console.log('isCheck --- ' + isCheck + ' --- type ' + type);

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
        poiCheckHandler(){
            console.log('poiCheckHandler---');
        },
        //发布信息
        publishMsgHandler(){
            console.log(this.search.pubMsg);
            this.map.off('click', this.addMsgClick);    // 移除事件
            // this.map.off('dblclick', showInfoDbClick);
                // this.map.off('mousemove', showInfoMove);

            let type = this.search.pubMsg;
            
            if(type != '发布信息'){   // 添加事件 ，修改类型 ， 
              
                console.log("绑定事件!");  
                this.map.on('click', this.addMsgClick);        // 单击事件
                // this.map.on('dblclick', showInfoDbClick);   // 双击事件
                // this.map.on('mousemove', showInfoMove);     // 鼠标移动事件
            }
        },
        addMsgClick(e){
            var text = '您在 [ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ] 的位置单击了地图！';
            console.log('add msg click --- ' + text);
            console.log('msg type --- ' + this.search.pubMsg);

            // 判断一下图标类型
            let icon = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';
            let tlist = [];
            let type = this.search.pubMsg;
            if(type == '障碍物'){
                icon = 'static/images/ico1_min.png';
            }else if(type == '道路施工'){
                icon = 'static/images/ico2_min.png';
            }else if(type == '货物散落'){
                icon = 'static/images/ico3_min.png';
            }

            let lon = e.lnglat.getLng();
            let lat = e.lnglat.getLat();
            
            let marker =  new AMap.Marker({
                // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                icon: icon,
                position: [lon, lat],
                offset: new AMap.Pixel(0,-20)
            });
           
            this.map.add(marker);

            // 给marker添加点击事件
            marker.on('click',this.markerClick);
        },
        markerClick(e){
            console.log(e);
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
            
            this.initInfoWindow(lon,lat);
        },
       
        // rsu
        showRsu(isCheck){
            // this.mapMarker.rsu = !this.mapMarker.rsu;
            if(isCheck){
                var marker = new AMap.Marker({
                    // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    icon: "static/images/poi_2.png",
                    position: [116.405467, 39.907761]
                });
                this.map.add(marker);
                this.map.setFitView();                
                this.mapMarker.rsuList.push(marker);
            }else{
                for(let i=0;i<this.mapMarker.rsuList.length;i++){
                    let marker = this.mapMarker.rsuList[i];
                    this.map.remove(marker);                    
                }                
            }

            
        },
        initRsuList(){
            let url = 'event/task/queryPage';
            let params = {
                // eventType: 0,
                "page": {    
                    "pageIndex": this.paging.index,
                    "pageSize": this.paging.size,
                },
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        this.dataList = response.data.list;
                        this.paging.total = response.data.totalCount;
                        
                    } else {                     
                        this.$store.dispatch("showPrompt", "获取设备列表失败  ！"); 
                    }
                }
            );
        },
        // 路侧单元
        showRoadsideUnit(){
            this.mapMarker.roadsideUnit = !this.mapMarker.roadsideUnit;
            if(this.mapMarker.roadsideUnit){
                var marker = new AMap.Marker({
                    // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    icon: "static/images/poi_1.png",
                    position: [116.405467, 39.907761]
                });
                this.map.add(marker);
                this.map.setFitView();                
                this.mapMarker.roadsideUnitList.push(marker);
            }else{
                for(let i=0;i<this.mapMarker.roadsideUnitList.length;i++){
                    let marker = this.mapMarker.roadsideUnitList[i];
                    this.map.remove(marker);
                }
            }
        },
        // 红绿灯
        showTrafficSignal(){
            this.mapMarker.trafficSignal = !this.mapMarker.trafficSignal;
            if(this.mapMarker.trafficSignal){
                var marker = new AMap.Marker({
                    // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    icon: "static/images/poi_3.png",
                    position: [116.405467, 39.907761]
                });
                this.map.add(marker);
                this.map.setFitView();                
                this.mapMarker.trafficSignalList.push(marker);
            }else{
                for(let i=0;i<this.mapMarker.trafficSignalList.length;i++){
                    let marker = this.mapMarker.trafficSignalList[i];
                    this.map.remove(marker);                    
                }                
            }
        },

        // 创建infowindow模板
        inforWindowHtml(){
            return `
                <div>
                    <el-row class="yk-pad-10 yk-bottom-border">
                        <label class="yk-info-window-title">交通信息发布</label>                        
                    </el-row>
                    <el-row class="yk-pad-1040">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" label-width="120px" class="demo-ruleForm yk-left">
            
                            <el-form-item label="信息类型" class="yk-bottom-6">
                                <el-select size="mini" v-model="select.type" placeholder="请选择">
                                    <template v-for="(item,index) in typeList">
                                        <el-option :key="index" :label="item.name" :value="item.key">{{item.name}}</el-option>
                                    </template>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="中心位置" prop="name" class="yk-bottom-6">
                                <el-input size="mini" v-model="select.name"></el-input>
                            </el-form-item>

                            <el-form-item label="广播范围" prop="name" class="yk-bottom-6" style="height: 55px;">
                                <el-slider v-model="select.broadcastRange" :marks="broadcastRangeMarks" :max="select.broadcastMax" :step="select.broadcastStep" @change="sliderChange"></el-slider>
                            </el-form-item>

                            <el-form-item label="信息内容" prop="name" class="yk-bottom-6">
                                <el-input type="textarea" size="mini" v-model="select.name"></el-input>
                            </el-form-item>

                            <el-form-item label="默认广播频率" prop="frequency" class="yk-bottom-6">
                                <el-input size="mini" v-model="select.frequency">
                                <template slot="append">
                                    <el-select class="yk-w-80" v-model="select.frequencyUnit" placeholder="请选择">
                                    <el-option
                                    v-for="item in selectUnitList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.key">
                                    </el-option>
                                </el-select>
                                </template>
                                </el-input>            
                            </el-form-item>
                            
                            <el-form-item label="发送生效时间" prop="" class="yk-bottom-6">
                                <el-date-picker
                                    v-model="select.effectiveTime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="发送失效时间" prop="" class="yk-bottom-6">
                                <el-date-picker
                                    v-model="select.failureTime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="信息来源" class="yk-bottom-6">
                                <el-select size="mini" v-model="select.msgSource" placeholder="请选择">
                                    <template v-for="(item,index) in msgSourceList">
                                        <el-option :key="index" :label="item.name" :value="item.key">{{item.name}}</el-option>
                                    </template>
                                </el-select>
                            </el-form-item>

                            <el-form-item>
                                <el-button v-show="!select.isEdit" @click="publichInfo();">发布</el-button>
                                <el-button @click="closeInforWindow();">取消</el-button>

                                <el-button v-show="select.isEdit" @click="updateInfo();">更新</el-button>
                                <el-button v-show="select.isEdit" @click="destroyInfo();">手动失效</el-button>
                                
                            </el-form-item>

                        </el-form>
                    </el-row>
                </div>
            `
        },


        // 自定义高德地图信息窗体
        initInfoWindow(lon=116.397,lat=39.918){

            let inforWindowHtml = this.inforWindowHtml();

            var lnglat = new AMap.LngLat(lon,lat);

            var _this = this    
            var MyComponent = Vue.extend({
                    template: inforWindowHtml,//'<a style="color:#07bb49;" v-on:click="world()">add Shop</a>',
                    data(){
                        return {
                            typeList: [],       // 消息类型
                            selectUnitList: [],     // 单位list
                            select: {
                                name: '',
                                type: '',
                                frequency: '',
                                frequencyUnit: '',
                                effectiveTime: '',
                                failureTime: '',
                                broadcastRange: [],
                                broadcastStep: 100,
                                broadcastMax: 3000,
                                msgSource: '',
                                isEdit: false,
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
                            msgSourceList: [
                                { id: 1, name: '平台运营人员', key: 1, value:1 },
                                { id: 2, name: '管理员', key: 2, value: 2 },
                            ],
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
                        world:function() {
                                console.log(_this)
                                //点击事件 使用 组件对象
                        },
                        selectChangeFn(){
                            console.log('selectChangeFn---')
                        },
                        updateInfo(){
                            _this.inforWindowInstance.close();
                            _this.map.remove(_this.circleInstance);
                        },
                        publichInfo(){
                            _this.inforWindowInstance.close();
                            _this.map.remove(_this.circleInstance);
                        },
                        destroyInfo(){
                            _this.inforWindowInstance.close();
                            _this.map.remove(_this.circleInstance);
                        },
                        closeInforWindow(){
                            _this.inforWindowInstance.close();
                            _this.map.remove(_this.circleInstance);
                        },
                        sliderChange(value){
                            console.log('sliderChange --- ' + value)
                            _this.circleInstance.setRadius(value);
                        },
                        initTypeList(){
                            let url = 'event/info/queryPage';
                            let params = {
                                "page": {    
                                    "pageIndex": this.paging.index,
                                    "pageSize": this.paging.size,
                                },
                            };
                            this.$api.post( url,params,
                                response => {
                                    if (response.status >= 200 && response.status < 300) {

                                        this.typeList = response.data.list;
                                        // this.paging.total = response.data.totalCount;
                                        
                                    } else {                     
                                        this.$store.dispatch("showPrompt", "获取设备列表失败  ！"); 
                                    }
                                }
                            );
                        },
                    },
                    created(){
                        this.initTypeList();
                    }
                });
            var component= new MyComponent().$mount();

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
        

        // this.markers = [
        //     {
        //         position: [121.5273285, 31.21515044]
        //     }, 
        //     {
        //         position: [121.5273286, 31.21515045]
        //     }
        // ];
    },
    mounted(){
        this.initMap();
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
   
    .image{
        margin-top: 3px;
        width: 32px;
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
        padding-top: 5px;
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

