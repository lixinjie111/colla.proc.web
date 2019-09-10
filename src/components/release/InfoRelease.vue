<template>
 
    <div id="ykMap" class="yk-map" @click="mapBoxClick();">
       
        <!-- openlayer地图 -->
        <div>
            <InfoMapOL ref="refInfoMap" :mapHeight="pageHeight" :msgTypeInfo="search.pubMsg" @PubMsgChange="pubMsgChange"></InfoMapOL>
        </div>

        <!-- 左侧信息 -->
        <div class="yk-left">
            <div class="c-scroll-wrap">
                <div class="c-scroll-inner">
                    <el-card v-for="(item,index) in statisicsData" :key="index" :body-style="{ padding: '0px' }">
                        <div class="react-bg">                    
                            <div class="image-box">
                                <img :src="iconPath + item.icon" class="image">
                            </div>
                            <div class="yk-card-title">
                                <span>{{item.num}}</span>
                            </div>
                        </div>                
                    </el-card>
                </div>
            </div>  
        </div>

        <!-- 右侧信息 -->
        <div class="yk-right">
                <div class="yk-form-item  yk-border-r yrButton">
                    <div class="add">
                        <i class="icon el-icon-plus"></i>
                        <div class="addContent">
                            <el-form> 
                                <el-form-item  class="ic-form-item">
                                    <el-select ref="refPubMsg" placeholder="发布信息" v-model="search.pubMsg"  value-key="name" >                        
                                        <el-option-group v-for="(group,groupIndex) in pubMsgGroup" label="发布信息" :key="groupIndex">
                                            <template v-for="(item,index) in pubMsgList">
                                                <el-option :key="index" :value="item" @click.native="pubMsgClick(item);">                                        
                                                    {{item.name}}
                                                </el-option>
                                            </template>
                                        </el-option-group>
                                    </el-select>                    
                                </el-form-item> 
                            </el-form> 
                        </div>
                    </div>
                </div>              
            
                <div class="yk-form-item  yk-border-r yrButton1">
                    <div v-for="item in poiList"  class="yrSwitch" :class="{isActive:item.isCheck}"  :key="item.value" :value="item.name" @click="poiClick(item);"><i :class="item.icon" class="icon"></i> {{item.name}}</div> 
                </div>                
         
        </div>
    </div>
</template>
<script>

import Vue from 'vue';
import InfoMapOL from '@/components/release/InfoMap_ol.vue'

export default {
    components: {
        InfoMapOL,
    },
    data(){
        return {
            iconPath: window.config.iconPath,            
            search: {
                poi: '',
                pubMsg: '',
            },            
            poiList: [                
                { id: 1, name: 'RSU', value: 'rsu', isCheck: false,icon:"icon-rsu"},
                { id: 2, name: '路侧点', value: 'roadsideUnit', isCheck: false,icon:'icon-roadside'},
                { id: 3, name: '红绿灯', value: 'trafficSignal', isCheck: false,icon:'icon-light'},
                { id: 4, name: '路网', value: 'roadNet', isCheck: true,icon:'icon-roadnet'},
            ],
            pubMsgList: [
                
                // { id: 1, name: '障碍物', value: '障碍物', isCheck: false},
                // { id: 2, name: '道路施工', value: '道路施工', isCheck: false},
                // { id: 3, name: '货物散落', value: '货物散落', isCheck: false},
            ],            
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
                roadNet:true
            },
            clearPoiSelect: true,
            collapseTags: true,
            screenWidth: 1280,
            screenHeight: 450,
            isOk: false,
            pageHeight: 250,
            oldTime: null,
            timeInterval: 400,
            webSocket: null,
            webSocketData: {
                action: "event_detail_data",
                token: "tusvn",
                id: ""
            }
        }
    },
    created(){
        this.initStatisics();
        //this.initWebSocket();
        this.initPubMsgList();
    },
    methods: {
        initWebSocket() {
            if("WebSocket" in window) {
                this.webSocket = new WebSocket(window.config.websocketUrl); //获得WebSocket对象
            }
            this.webSocket.onmessage = this.onmessage;
            this.webSocket.onclose = this.onclose;
            this.webSocket.onopen = this.onopen;
            this.webSocket.onerror = this.onerror;
        },
        onmessage(mesasge) {
            //console.log(JSON.parse(mesasge.data))
            this.itemData = JSON.parse(mesasge.data).result.data;
            this.position = this.coordinateTransfer("EPSG:4326", "+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs", this.itemData.longitude, this.itemData.latitude);
            let list = JSON.parse(mesasge.data).result.deviceList;
            if(list) {
                this.deviceList = JSON.parse(mesasge.data).result.deviceList;
            } else {
                this.deviceList = [];
            }
            if(this.itemData.status == 2) { //事件消失取消模型
                if(this.$refs.tusvnMap3.getStaticModel(this.selectedItem.cameraId)) {
                    this.$refs.tusvnMap3.removeStaticModel(this.selectedItem.cameraId);
                }
            }

        },
        onclose(data) {
            console.log("结束连接");
        },
        onopen(data) {
            var _traffic = JSON.stringify(this.webSocketData);
            this.sendMsg(_traffic);
        },
        sendMsg(msg) {
            if(window.WebSocket) {
                if(this.webSocket.readyState == WebSocket.OPEN) {
                    //如果WebSocket是打开状态
                    this.webSocket.send(msg); //send()发送消息
                }
            } else {
                return;
            }
        },             
        destroyed(){
            this.webSocket && this.webSocket.close();
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

        pubMsgChange(){
            this.initStatisics();
        },

        initPubMsgList(){
            let url = 'event/info/queryAll';
            let params = {};
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {
                        this.pubMsgList = response.data ? response.data : []; 
                        
                    } else {                     
                        this.$message("获取信息类型列表失败  ！"); 
                    }
                }
            );
        },
        
        poiClick(item){
            if(!item) return;
            item.isCheck = !item.isCheck;
            let type = item.value;
            this.olMarker[type] = !this.olMarker[type];
            this.$refs.refInfoMap.showMarker(type,this.olMarker[type]);
            // this.$refs.ruleFormMap.resetFields();
        },

        removeTagClick(e){
            
            // { id: 1, name: 'RSU', value: 'rsu', isCheck: false},
            //     { id: 2, name: '路侧单元', value: 'roadsideUnit', isCheck: false},
            //     { id: 3, name: '红绿灯', value: 'trafficSignal', isCheck: false},
            let temp = this.getItemByName(this.poiList,e);
            this.poiClick(temp);
        },

        getItemByName(list,name){
            for(let i=0;i<list.length;i++){
                let temp = list[i];
                if(temp.name == name){
                    return temp;
                }
            }
            return null;
        },
       
        pubMsgClick(item){
            this.search.pubMsg=item;
            this.$refs.refInfoMap.addMapClickEvent(item);
        },
        clearPubMsgClick(e){            
            this.$refs.refInfoMap.setPointer({bool: false});
        },

        mapBoxClick(){
            //this.$refs.refPubMsg.handleClose()
            //this.$refs.refPoi.handleClose()
        },

        // winResize(){
        //     let offsetHeight = window.outerHeight;
        //     let offsetWidth = window.outerWidth;
        //     console.log('offsetHeight --- ' + offsetHeight + ' ------ offsetWidth --- ' + window.outerWidth)
        // },
        
        // shaking
        // avoidShake(height){
            
        //     let inval = 400;
        //     let timer = null;
        //     if(!this.isOk){
        //         this.isOk = true;
        //         timer = setTimeout(()=>{
        //             this.isOk = false;
        //             this.pageHeight = height - 62;

        //             console.log('--avoidShake------ pageHeight = ' + this.pageHeight);

        //             clearTimeout(timer);
        //             timer = null;
        //         },inval);
        //     }
        // },
        // // saving
        // saveWater(){
        //     let newTime = (new Date()).gettime();
            
        //     if(!this.oldTime){
        //         this.oldTime = newTime;
        //     }

        //     let intval = this.newTime - this.oldTime;
        //     if( intval > this.timeInterval){
        //         console.log('do it !');
        //         this.oldTime = newTime;
        //     }
        // },
    },
  
    mounted(){
        // setTimeout(()=>{
        //     this.$refs.refInfoMap.showMarker('roadNet',true);
        // },500)
        
        // const that = this
        // window.onload = () => {
        //     return (() => {
        //         window.screenWidth = document.body.clientWidth;
        //         that.screenWidth = window.screenWidth;
        //         window.screenHeight = document.body.clientHeight;
        //         that.screenHeight = window.screenHeight;

        //         const borwserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        //         console.log('-------- screenHeight = ' + screenHeight + ' --- borwserHeight : ' + borwserHeight);
        //         this.avoidShake(borwserHeight);
                
        //     })()
        // };

        // window.onresize = () => {
        //     return (() => {
        //         window.screenWidth = document.body.clientWidth;
        //         that.screenWidth = window.screenWidth;
        //         window.screenHeight = document.body.clientHeight;
        //         that.screenHeight = window.screenHeight;

        //         const borwserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        //         console.log('-------- screenHeight = ' + screenHeight + ' --- borwserHeight : ' + borwserHeight);
        //         this.avoidShake(borwserHeight);
                
        //     })()
        // }
    },

}
</script>
<style scoped lang="scss">
@import '@/assets/scss/theme.scss';
    
    .el-select-group__wrap{
        background: #666!important;        
    }
    .el-select-dropdown__item{
        color: #fff!important;
    }
    .hover{
        color: #F59307!important;
        background: #666!important;
    }
    .selected{
        color: #F59307!important;
        background: #666!important;
    }
   

    .el-card{
        margin-bottom: 20px;
        width: 94px;
        background: transparent;
        border: 0px;
    }
    .el-card:last-child{
        margin-bottom: 0;
    }
    .react-bg{
        width: 94px;
        height: 94px;
        /* background-image: url('rect.png');
        background-repeat: no-repeat;
        background-size: 100% 100%; */
        background-color: rgba(255,255,255,0.7);
        box-shadow: #F59307;
    }
    .image-bg{
        width: 44px;
        margin: 0 auto;
    }
    .image-box{
        top: 17px;
        left: 0px;
        right: 0px;
        position: relative;
        width: 44px;
        height: 44px;
        margin: 0 auto;
        background-image: url('./ico-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .image{
        width: 28px;
        border-radius: 50%;
        margin: 0 auto;
        position: relative;
        top: 50%; 
        transform: translateY(-50%);
    }
    .yk-map{
        position: absolute;
        left: 0;
        right: 0;
        top: 0px;
        bottom: 0;
        overflow: hidden;
    }

    .yk-left{
        position: absolute;
        left: 30px;
        top: 30px;
        bottom: 30px;
        text-align: center;
    }

    .yk-right{
        right: 30px;
        top: 30px;
        position: absolute;
        z-index: 2;
        height: 45px;
        color:#fff;
        cursor: pointer;
        .yrButton{
            position: absolute;
            right:0;
            top:0;
            z-index:2;
            display: flex;
            height: 100%;
            .add{
                width:45px;
                height: 45px;
                position: absolute;
                right:0;
                top:0;
                z-index:3;
                background: #666!important;
                @include layoutMode();
                .icon{
                    color:#fff;
                    font-size: 27px;
                }
                .addContent{
                    width:130px;
                    height: 100%;
                    position: absolute;
                    right:0;
                    top:0;
                    z-index: 10;
                    .ic-form-item{
                        width:100%;
                        height: 100%;
                        opacity: 0;
                    }
                }
            }
            
        }
        .yrButton1{
            position: absolute;
            right:65px;
            top:0;
            z-index:5;
            display: flex;
            height: 100%;
            .yrSwitch{
                flex:1;
                width:120px;
                padding-right: 10px;
                box-sizing: border-box;
                height: 100%;
                font-size: 16px;
                border-right: 1px solid #4d4d4d;
                @include layoutMode();
                .icon{
                    display: inline-block;
                    width: 45px;
                    height: 45px;
                    background-repeat: no-repeat;
                    background-position: center center;
                    margin-right: 5px;
                    &.icon-rsu {
                        background-image: url("../../assets/images/icon/rsu.png");
                    }
                    &.icon-roadside {
                        background-image: url("../../assets/images/icon/roadside.png");
                    }
                    &.icon-light {
                        background-image: url("../../assets/images/icon/light.png");
                    }
                    &.icon-roadnet {
                        background-image: url("../../assets/images/icon/roadnet.png");
                    }
                }
                &.isActive {
                    .icon{
                        &.icon-rsu {
                            background-image: url("../../assets/images/icon/rsu-active.png");
                        }
                        &.icon-roadside {
                            background-image: url("../../assets/images/icon/roadside-active.png");
                        }
                        &.icon-light {
                            background-image: url("../../assets/images/icon/light-active.png");
                        }
                        &.icon-roadnet {
                            background-image: url("../../assets/images/icon/roadnet-active.png");
                        }
                    }
                }
            }
        }
        .el-tag.el-tag--info{
            background-color: #666!important;
            color: #F59307!important;
        }
        
    }
    .yk-border-r{
        border-right: 1px solid rgb(145, 143, 143)!important;
    }

    .yk-r-10{
        margin-right: 10px;
    }

    .yk-card-title{
        color: #F59307;
        padding-top: 18px;
        font-size: 16px;
        user-select: none;
    }

    .yk-form{
        top: 200px;
        left: 200px;
        position: absolute;
        background: #ffffff;
    }

    .yk-135{
        width: 135px;
        font-size: 14px;
    }
        
    .isActive{
        color:#f59307;
    }
    .el-select-dropdown{
        right:0;
    }
   

</style>


<style lang="scss">
    .yk-form-item{
        background: #666!important;
        .el-input__inner {
            width: 100% !important;
            background-color: #4D4D4D!important;
            border: 0px!important;
            border-radius: 0px!important;
        }
    }
    .el-select-group__title{
        display: none;
    }
    .el-popper[x-placement^=bottom] .popper__arrow {
        left:100px !important;
        border-bottom-color: #7d7c7c!important;
    }
    .el-popper[x-placement^=bottom] .popper__arrow::after{
        border-bottom-color: #7d7c7c!important;
    }



</style>

