<template>
    <div :class="isPointerIco ? 'yk-pointer-ico' : 'yk-pointer-normal'">

        <!--  style="height: 998px;" 
            :style="'height:' + mapHeight + 'px;'" -->
        <tusvn-map 
            ref="refTusvnMap"           
            
            style="height: 998px;"
            class="ref-map" 
            targetId="ddd"
            overlayContainerId="ccc"
            :isMasker='false'
            :isCircle='false'
            
            @MapClick="mapClick"
            @ExtentChange="extentChange"
            @ViewLevelChange="viewLevelChange"
            @MapInitComplete='mapInitComplete'
            @setPointer='setPointer'

            @PublishInfo = 'publishInfo' 
            @UpdateInfo = 'updateInfo'
            @DestroyInfo = 'destroyInfo'
            @TemporaryClearPubMsg='temporaryClearPubMsg($event)'>

        </tusvn-map>
        <!--   -->
    </div>
</template>
<script>
import TusvnMap from '@/common/TusvnMap/TusvnMap.vue';
import TDate from '@/common/date.js'

export default {
    name: 'InfoMapOL',
    components: { TusvnMap  },
    props: ['msgTypeInfo','mapHeight'],
    data(){
        return {
            mapInitOk: false,
            mapLayer: {
                rsu: 'RsuLayer',                        // rsu 图层
                roadsideUnit: 'roadsideUnitLayer',      // 路侧单元 图层
                trafficSignal: 'trafficSignalLayer',    // 红绿灯 图层
                message: 'MessageLayer',                // 发布信息 图层
                messageBg: 'MessageBgLayer',            // 信息的背景图片 图层
            },
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
                msgList: [],        // 障碍物 + 货物散落 + 道路施工
            },
            mapLevel: {
                value: 10,
            },
            iconPath: window.cfg.iconPath,
            trafficInfo: {
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
                infoType: '',
                sendChannel: '',
                alertRadius: 1024,
                alertPath: '',              //格式 "[[12.333,23.333],[12.444,23,444]]"，转换显示为 12.333,23.333;12.444,23,444
                alertCategory: ''       //告警类型
            },
            isPointerIco: false,    // 是否修改鼠标的图标
            pubMsgList: [],
            dyHeight: 'yk-dy-height',
            isOk: false,
        }
    },
    methods: {

        // ----------------------------信息发布-------------------------------
        setPointer(e){
            this.isPointerIco = e.bool;
            if(!e.flag) {
                this.removeMapClickEvent();
            }
        },
        initPubMsgList(){

            this.clearPubMsg();
            
            let url = 'event/task/findEffectiveList';
            let params = {                
                status: 1,
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        this.pubMsgList = response.data ? response.data : [];                        
                        let t = this.pubMsgList;

                        this.addPubMsg();
                        
                        // if(t.length){
                        //     this.$refs.refTusvnMap.centerAt( t.length, t[0], t[1])
                        // }

                    } else {                     
                        this.$message.error("获取信息列表失败 ！"); 
                    }
                }
            );
        },
        addPubMsg(){
            for(let i=0;i<this.pubMsgList.length;i++){
                let item = this.pubMsgList[i];
                let icon = 'static/images/position.png';
                // let icon = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';
                if(item.icon){
                    icon = this.iconPath + item.icon;
                }              
                
                let lon = item.longitude;
                let lat = item.latitude;                            
                let id = item.taskCode;
                let size = [30,30];                           

                let bgImgId = 'bg_' + id;
                let bgImgSrc = 'static/images/ico-bg2.png';                            
                let bgImgSize = [44,58];
                let bgImgOffset = [0,0];                            
                this.$refs.refTusvnMap.addImg(lon, lat, bgImgId,this.mapLayer.messageBg,bgImgSrc,bgImgSize,0,true,1,bgImgOffset,1,[0.5,1]);                            

                let imgOffset = [0,-34];
                this.$refs.refTusvnMap.addImgOverlay( id, icon, null, lon, lat, id, imgOffset, (e) => {
                    
                    e.preventDefault();
                    e.stopPropagation();

                    let marker = {
                        id: item.id,
                        lon: lon,
                        lat: lat,
                        isEdit: true,
                        icon: this.iconPath + this.msgTypeInfo.icon,
                        trafficInfo: this.trafficInfo,

                    };

                    this.cricleID = 'icon_' + item.id;
                    this.$refs.refTusvnMap.addMyInfoWindow(marker);

                }); 
                
            }
        },
        temporaryClearPubMsg(e){
            
            if(e.bool){
                this.clearPubMsgIco();
            }else{
                this.addPubMsg();
            }
            
        },
        clearPubMsgIco(){
            this.$refs.refTusvnMap.removeAllFeature(this.mapLayer.messageBg);

            for(let item of this.pubMsgList){
                this.$refs.refTusvnMap.removeOverlayById(item.taskCode);
            }
        },
        clearPubMsg(){

            this.clearPubMsgIco();
            this.pubMsgList = [];
        },

        publishInfo(e){
                    
            let url = 'event/task/save';
            let params = {
                status: 1,
                eventType: e.eventType,      //信息类型
                longitude: e.longitude,      // 经度
                latitude: e.latitude,       // 纬度
                affectRange: e.affectRange,    // 广播范围
                content: e.content,        // 信息内容
                frequency: e.frequency,      // 广播频率
                frequencyUnit: e.frequencyUnit,      // 频率单位
                beginTime: TDate.formatTime(e.beginTime),      // 生效时间
                endTime: TDate.formatTime(e.endTime),     // 失效时间
                datasource: e.datasource,     // 信息来源
                sendChannel: e.sendChannel,         //  4G下发通道
                infoType: e.infoType,       // 子类型代码
                alertRadius: e.alertRadius,                      
                alertPath: e.alertPath,
                alertCategory: e.alertCategory,
            };

            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {
                        
                        if(response.data.status == 200){
                            this.initPubMsgList();
                            this.$emit('PubMsgChange');
                            this.$message.success('发布成功！');
                        }else if(response.data.status == 500){
                            let msg = response.data.message ? response.data.message : '发布失败 !';
                            this.$message.error(msg)
                        }
                        
                    } else {                     
                        this.$message.error("发布失败 ！"); 
                    }
                }
            );
        },
        updateInfo(e){
            
            let url = 'event/task/update';
            let params = {
                id: e.id,
                "taskCode": e.taskCode,
                eventType: e.eventType,      //信息类型
                longitude: e.longitude,      // 经度
                latitude: e.latitude,       // 纬度
                affectRange: e.affectRange,    // 广播范围
                content: e.content,        // 信息内容
                frequency: e.frequency,      // 广播频率
                frequencyUnit: e.frequencyUnit,      // 频率单位
                beginTime: TDate.formatTime(e.beginTime),      // 生效时间
                endTime: TDate.formatTime(e.endTime),     // 失效时间
                datasource: e.datasource,     // 信息来源
                sendChannel: e.sendChannel,         //  4G下发通道
                infoType: e.infoType,       // 子类型代码
                alertRadius: e.alertRadius,                      
                alertPath: e.alertPath,
                alertCategory: e.alertCategory,
            };

            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {                    
                        
                        if(response.data.status == 200){
                            this.initPubMsgList();
                            this.$message.success('更新成功！');
                        }else if(response.data.status == 500){
                            let msg = response.data.message ? response.data.message : '更新失败 !';
                            this.$message.error(msg)
                        }
                        
                    } else {                     
                        this.$message.error("更新失败 ！"); 
                    }
                }
            );
        },
        destroyInfo(e){
           
            let url = 'event/task/cancel';
            let params = {
                id: e.id,
                "taskCode":e.taskCode,
                "expirationTime": TDate.formatTime(), 
                "status": 2                
            };

            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {
                        
                        if(response.data.status == 200){
                            this.initPubMsgList();
                            this.$emit('PubMsgChange');
                            this.$message.success('手动失效成功！');
                        }else if(response.data.status == 500){
                            let msg = response.data.message ? response.data.message : '手动失效失败 !';
                            this.$message.error(msg)
                        }                         
                        
                    } else {                     
                        this.$message.error("手动失效失败 ！"); 
                    }
                }
            );
        },

        // -----------------------------poi----------------------------
        showMarker(type,bool){
            switch(type){
                case 'rsu':
                    bool ? this.showRsu() : this.clearRsu();
                    break;
                case 'roadsideUnit':
                    bool ? this.showRoadsideUnit() : this.clearRoadsideUnit();
                    break;
                case 'trafficSignal':
                    bool ? this.showTrafficSignal() : this.clearTrafficSignal();
                    break;
            }
        },
        // 显示rsu
        showRsu(){
            let url = 'common/queryRsu';
            let params = {                
                // "distcode": this.$store.state.region.code //"110108"
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        let rsuList = response.data ? response.data : []; 
                        for(let i=0;i<rsuList.length;i++){
                            
                            let item = rsuList[i];
                            let lon = item.longitude;
                            let lat = item.latitude;
                            let id = this.generataIcoName('rsu',i);
                            let icon = "static/images/poi_2.png";
                            let size = [30,30];
                            this.$refs.refTusvnMap.addImg(lon,lat,id,this.mapLayer.rsu,icon,size);

                        }

                        // if(rsuList.length){
                        //     let lon = rsuList.length ? rsuList[0].longitude : this.$store.state.region.postion.lon;//'116.397';
                        //     let lat = rsuList.length ? rsuList[0].latitude : this.$store.state.region.postion.lat;//'39.918';
                        //     this.$refs.refTusvnMap.centerAt(lon,lat);   
                        // }                                             
                        
                    } else {                     
                        this.$message.error("获取设备列表失败 ！"); 
                    }
                }
            );
        },
        // 清除rsu
        clearRsu(){
            this.$refs.refTusvnMap.removeAllFeature(this.mapLayer.rsu);
        },
        // 显示路侧单元
        showRoadsideUnit(){            
            let url = 'common/queryRoadSide';
            let params = {
                // "distcode": this.$store.state.region.code //"110108"
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        let roadsideUnitList = response.data ? response.data : []; 
                        for(let i=0;i<roadsideUnitList.length;i++){
                            let item = roadsideUnitList[i];
                            let lon = item.longitude;
                            let lat = item.latitude;
                            let id = this.generataIcoName('roadsideUnit',i);
                            let icon = "static/images/poi_1.png";
                            let size = [30,30];
                            this.$refs.refTusvnMap.addImg(lon,lat,id,this.mapLayer.roadsideUnit,icon,size);
                        }

                        // if(roadsideUnitList.length){
                        //     let lon = roadsideUnitList.length ? roadsideUnitList[0].longitude : this.$store.state.region.postion.lon;//'116.397';
                        //     let lat = roadsideUnitList.length ? roadsideUnitList[0].latitude : this.$store.state.region.postion.lat;//'39.918';
                        //     this.$refs.refTusvnMap.centerAt(lon,lat);  
                        // }                        
                        
                    } else {                     
                        this.$message.error("获取路侧单元失败 ！"); 
                    }
                }
            );
        },
        // 清除路侧单元
        clearRoadsideUnit(){
            this.$refs.refTusvnMap.removeAllFeature(this.mapLayer.roadsideUnit);
        },
        // 显示红绿灯
        showTrafficSignal(){
            let url = 'common/queryLight';
            let params = {
                // "distcode": this.$store.state.region.code//"310104"
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        let trafficSignalList = response.data ? response.data : []; 
                        for(let i=0;i<trafficSignalList.length;i++){
                            let item = trafficSignalList[i];
                            let lon = item.longitude;
                            let lat = item.latitude;
                            let id = this.generataIcoName('trafficSignal',i);
                            let icon = "static/images/poi_3.png";
                            let size = [30,30];
                            this.$refs.refTusvnMap.addImg(lon,lat,id,this.mapLayer.trafficSignal,icon,size);
                        }

                        // if(trafficSignalList.length){
                        //     let lon = trafficSignalList.length ? trafficSignalList[0].longitude : this.$store.state.region.postion.lon;//'116.397';
                        //     let lat = trafficSignalList.length ? trafficSignalList[0].latitude : this.$store.state.region.postion.lat;//'39.918';
                        //     this.$refs.refTusvnMap.centerAt(lon,lat);   
                        // }
                        
                    } else {                     
                        this.$message.error("获取红绿灯失败 ！"); 
                    }
                }
            );
        },
        // 清除红绿灯
        clearTrafficSignal(){
            this.$refs.refTusvnMap.removeAllFeature(this.mapLayer.trafficSignal);
        },

        // 生成 类型+随机数 格式的图标名称
        generataIcoName(value,index){
            return value + (new Date()).getTime()+index;
        },
        
        // shaking
        avoidShake(height){            
            let inval = 400;
            let timer = null;
            if(!this.isOk){
                this.isOk = true;
                timer = setTimeout(()=>{
                    this.isOk = false;
                    this.pageHeight = height;
                    clearTimeout(timer);
                    timer = null;
                },inval);
            }
        },

        //------------------------------- 地图回调函数------------------------------
        // 添加 地图点击事件
        addMapClickEvent(item){
            this.$refs.refTusvnMap.initSelect();
            this.$refs.refTusvnMap.initTrafficInof();
            
            this.$refs.refTusvnMap.addClickEvent(item);
            this.isPointerIco = true;

            this.$refs.refTusvnMap.closeMyInfoWindow();
            this.$refs.refTusvnMap.clearTempLayer();
            this.temporaryClearPubMsg({bool: false});
        },
        // // 移除 地图点击事件
        removeMapClickEvent(){
            this.$refs.refTusvnMap.removeClickEvent(); 
        },
        mapClick: function(map,evt){
            
            // this.isPointerIco = false;

            if(!this.msgTypeInfo){
                this.$message.warning('请选择信息类型 ！');
                return;
            }
           
            let lon = evt.coordinate[0];
            let lat = evt.coordinate[1];

            // 生效时间 当前时间
            let beginTime = TDate.formatTime();
            // 失效时间 当前时间 +24 小时
            let tomorrow = (new Date()).getTime() + 24 * 60 * 60 * 1000;
            let endTime = TDate.formatTime(tomorrow);

            this.trafficInfo = {
                title: '信息发布',
                isEdit: false,
                eventName: this.msgTypeInfo.name,
                eventType: this.msgTypeInfo.code,    
                taskCode: this.msgTypeInfo.taskCode,                      
                longitude: lon,
                latitude: lat,
                affectRange: 1000,
                content: this.msgTypeInfo.content,
                frequency: this.msgTypeInfo.frequency,
                frequencyUnit: this.msgTypeInfo.frequencyUnit,
                beginTime: beginTime,
                endTime: endTime,
                datasource: '',
                infoType: this.msgTypeInfo.infoType,
                sendChannel: this.msgTypeInfo.sendChannel,
                alertRadius: 1024,
                alertPath: '',              //格式 "[[12.333,23.333],[12.444,23,444]]"，转换显示为 12.333,23.333;12.444,23,444
                alertCategory: ''       //告警类型
            };
            let marker = {
                id: 'marker' + (new Date()).getTime(),
                lon: lon,
                lat: lat,
                trafficInfo: this.trafficInfo,
                isEdit: false,
                icon: this.iconPath + this.msgTypeInfo.icon,     
            };
            
            this.$refs.refTusvnMap.addMyInfoWindow(marker);
            // this.$refs.refTusvnMap.addInfoWindow(marker);
            
            
            
        },
       
        mapInitComplete:function(tusvnmap){
            // console.log("============================mapInitComplete=============================");

            //创建图层
            this.$refs.refTusvnMap.addVectorLayer(this.mapLayer.rsu);
            this.$refs.refTusvnMap.addVectorLayer(this.mapLayer.roadsideUnit);
            this.$refs.refTusvnMap.addVectorLayer(this.mapLayer.trafficSignal);
            this.$refs.refTusvnMap.addVectorLayer(this.mapLayer.message);
            this.$refs.refTusvnMap.addVectorLayer(this.mapLayer.messageBg);

            this.mapInitOk = true;   

            // 设置地图中心点及级别
            this.$refs.refTusvnMap.centerAt(121.17265957261286,31.284096076877844);
            this.$refs.refTusvnMap.zoomTo(11);
            
            // this.showRsu();
            // this.showRoadsideUnit();
            // this.showTrafficSignal();

            this.initPubMsgList();

        },
        viewLevelChange:function(tusvnmap,mevent)
        {
            // console.log("============================viewLevelChange=============================");
            // console.log(tusvnmap);
            // console.log(mevent);

            this.mapLevel.value = mevent;            

        },
        extentChange:function(tusvnmap,newextent){
            // console.log("============================extentChange=============================");
            // console.log(tusvnmap);
            // console.log(newextent);
        },
    },
    mounted(){
        const that = this
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth;
                that.screenWidth = window.screenWidth;
                window.screenHeight = document.body.clientHeight;
                that.screenHeight = window.screenHeight;

                const borwserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

                // console.log('-------- screenHeight = ' + screenHeight + ' --- borwserHeight : ' + borwserHeight);

                
            })()
        }
    },
}
</script>

<style scoped>
.yk-pointer-ico{
    cursor: url('position3.png') 8 24 , url('position3.png') , auto;
}
.yk-pointer-normal{
    cursor: default;
}

.yk-dy-height{
    height: calc(100vh - 100px); 
}
</style>

