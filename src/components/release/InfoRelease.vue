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
            <el-form size="mini">
                <el-form-item class="yk-form-item c-pull-right">
                    <el-select id="pubMsgSelect" ref="refPubMsg" placeholder="发布信息" v-model="search.pubMsg" :clearable='clearPoiSelect' value-key="name" @clear="clearPubMsgClick($event);">                        
                        <el-option-group v-for="(group,groupIndex) in pubMsgGroup" label="发布信息" :key="groupIndex">
                            <template v-for="(item,index) in pubMsgList">
                                <el-option :key="index" :value="item" @click.native="pubMsgClick(item);">                                        
                                    {{item.name}}
                                </el-option>
                            </template>
                        </el-option-group>
                    </el-select>                    
                </el-form-item>
                <el-form-item class="yk-form-item c-pull-right yk-border-r">                    
                    <el-select id="poiSelect" ref="refPoi" placeholder="POI" multiple v-model="search.poi" value-key="value" collapse-tags @remove-tag="removeTagClick($event);">                                    
                        <el-option-group v-for="(group,groupIndex) in poiGruop" label="POI" :key="groupIndex">            
                            <template v-for="(item,index) in poiList">
                                <el-option :key="index" :value="item.name" @click.native="poiClick(item);">                                                           
                                    {{item.name}}                                
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
import InfoMapOL from '@/components/release/InfoMap_ol.vue'

export default {
    components: {
        InfoMapOL,
    },
    data(){
        return {
            iconPath: window.cfg.iconPath,            
            search: {
                poi: '',
                pubMsg: '',
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
            collapseTags: true,
            screenWidth: 1280,
            screenHeight: 450,
            isOk: false,
            pageHeight: 250,
            oldTime: null,
            timeInterval: 400,
        }
    },
    methods: {             

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
            // item.isCheck = !item.isCheck;
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
            this.$refs.refInfoMap.addMapClickEvent(item);
        },
        clearPubMsgClick(e){            
            this.$refs.refInfoMap.setPointer({bool: false});
        },

        mapBoxClick(){
            
            this.$refs.refPubMsg.handleClose()
            this.$refs.refPoi.handleClose()
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
    created(){
        this.initStatisics();
        this.initPubMsgList();
       
        // this.winResize();
        // window.onresize = document.body.onresize = this.winResize();

        // this.pageResize();
       
        
    },
    mounted(){
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
        .el-input__inner{
            background-color: #4D4D4D!important;
            border: 0px!important;
            border-radius: 0px!important;
            width: 100% !important;
        } 
        .el-tag.el-tag--info{
            background-color: #666!important;
            color: #F59307!important;
        }

        .el-popper[x-placement^=bottom] .popper__arrow {
            border-bottom-color: #7d7c7c!important;
        }
        .el-popper[x-placement^=bottom] .popper__arrow::after{
            border-bottom-color: #7d7c7c!important;
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
 
</style>
<style lang="scss">
.yk-form-item{
    width: 150px;
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
</style>

