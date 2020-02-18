<template>
    <div class="c-wrapper-20">
        <el-form :inline="true" size="mini">
            <el-form-item label="信息类型名称：">
                <el-input v-model.trim="search.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="handleSearch" :loading="searchloading">查询</el-button>
                <el-button type="warning" plain @click="handleFlush">刷新</el-button>
            </el-form-item>
            <el-form-item class="c-pull-right">
                <el-button type="warning" @click="handleAdd">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table
                ref="table"
                class="c-mb-70"
                max-height="724"
                :data="dataList"
                border
                stripe
                :header-cell-style="{background:'#E6E6E6',color:'#606266',border: '0px'}"
                v-loading="tableLoading">
            <el-table-column
                label="序号"
                type="index">
                <template slot-scope="scope">
                    <span>
                        {{scope.$index + paging.index * paging.size + 1}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="信息类型名称"
                min-width="15%">
            </el-table-column>
            <el-table-column
                prop="eventCategory"
                label="信息分类"
                min-width="15%">
                <template slot-scope="scope">
                    <span v-for="item in typeList" :key="item.key"  v-if="scope.row.eventCategory == item.key">{{item.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="icon"
                label="图标"
                min-width="15%">
                <template slot-scope="scope">
                    <div class="m-pic-box image-box">
                        <img :src="iconPath+'rsi_'+scope.row.alertCategory+'.png'+'?t='+new Date().getTime()" class="image" @error="errorImg($event)">
                    </div>
                    <div class="m-pic-box image-pic">
                        <img :src="iconPath+'rsi_map_'+scope.row.alertCategory+'.png'+'?t='+new Date().getTime()" class="image" @error="errorImg($event)">
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="告警类别(国标)" prop="alertCategory" min-width="15%"></el-table-column>
            <el-table-column label="信息编码" prop="code" min-width="15%"></el-table-column>
            
            <el-table-column
                prop="content"
                label="默认信息内容"
                min-width="20%">
            </el-table-column>
            <el-table-column
                prop="frequency"
                label="默认广播频率(ms)"
                min-width="15%">
            </el-table-column>
            <el-table-column
                label="管理"
                min-width="20%">

                <template slot-scope="scope">
                    <el-button type="warning" plain size="mini" @click="handleCheck(scope.$index, scope.row);">查看</el-button>
                    <el-button type="warning" plain size="mini" @click="handleUpdate(scope.$index, scope.row);">编辑</el-button>
                    <el-button type="warning" plain size="mini" @click="handleDelete(scope.$index, scope.row);">删除</el-button>
                </template>                
                
            </el-table-column>
        </el-table>

        <el-row class="c-page">
            <el-pagination                
                background
                layout="prev, pager, next"               
                :page-size="this.paging.size"
                :total="this.paging.total"
                @current-change="pagingChange">
            </el-pagination>
        </el-row>

        <info-type-pop :popData="popData" :typeList="typeList" v-if="infoTypePopFlag" @closeDialog="closeDialog" @successBack="successBack"></info-type-pop>
        <info-type-detail :popData="popData" :typeList="typeList" v-if="infoTypeDetailFlag" @closeDialog="closeDialog" @successBack="successBack"></info-type-detail>
        
    </div>
</template>
<script>


import InfoTypePop from "@/components/manage/InfoTypePop.vue"
import InfoTypeDetail from "@/components/manage/InfoTypeDetail.vue"
import { infoQueryPage,queryDictionary,deleteIds} from '@/api/infoType'; 
export default {
    components: {
        InfoTypePop, InfoTypeDetail,
    },
    data(){
        return {
            iconPath: window.config.iconPath,
            paging: {
                index: 0,
                size: 10,
                total: 0,
                mini: true,
            },
            infoTypePopFlag: false,
            infoTypeDetailFlag: false,
            popData: {
                title: '提示',
                data: {},
                visible: true
            },
            dataList: [],
            typeList: [],
            search: {
                name: '',
            },
            tableLoading: false,
            searchloading:false
        }
    },
    created(){
        this.init();
    },
    methods: {
        initPaging() {
            this.paging.index = 0;
            this.paging.total = 0;
            this.paging.size = 10;
        },
        closeDialog() {
            this.infoTypePopFlag = false;
            this.infoTypeDetailFlag = false;
        },
        errorImg(event){
            if(event.target.src.indexOf('rsi_map')==-1){
                event.target.src=this.iconPath+"rsi_0.png";
            }else{
                event.target.src=this.iconPath+"rsi_map_0.png";
            }
        },
        init(){
            this.search.type = '';
            this.initData();
            this.initTypeList();
        },
        initVo(){
            return {
                code:'',
                content: '',    // 默认信息内容
                frequency: '500',  // 广播频率
                frequencyUnit: '1',  // 广播频率 单位
                icon: '',     // 信息类型icon
                name: '',   // 信息
                eventCategory: '',  // 信息所属分类
                sendChannel: '',      // 下发通道
                infoType: '',       // 子类型代码
                alertRadius: 1024,    // 默认影响范围
                alertPath: '',      // 影响路径
                alertCategory: ''
            }
        },
        initData(){
            this.tableLoading = true;
            let params = {
                name: this.search.name,
                "page": {    
                    "pageIndex": this.paging.index,
                    "pageSize": this.paging.size,
                },
            };
            infoQueryPage(params).then(res=>{
                if (res.status == 200) {
                    this.dataList = res.data.list;
                    this.$refs.table.bodyWrapper.scrollTop = 0;
                    this.paging.total = res.data.totalCount;
                }
                this.tableLoading = false;
                this.searchloading=false;
            }).catch(err => {
                this.searchloading=false;
                this.tableLoading = false;
            });
        },
        initTypeList(){
            let params = {
                parentCode: 'trafficType',
            };
            queryDictionary(params).then(res=>{
                if (res.status == 200) {
                    this.typeList = res.data ? res.data : [];
                }
            });
        },
        handleSearch(){
            this.searchloading=true;
            this.initPaging();
            this.initData();
        },
        handleFlush(){
            this.search.name = '';
            this.initData();
        },
        handleAdd(index,item){
            this.popData.title = '新增';
            this.popData.type = 'info-type-add';
            this.popData.data = this.initVo();
            this.infoTypePopFlag = true;
        },
        handleUpdate(index,item){
            this.popData.title = '修改';
            this.popData.type = 'info-type-update';
            this.popData.data = JSON.parse(JSON.stringify(item));
            this.infoTypePopFlag = true;
        },
        handleDelete(index,item){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    ids: [item.id]
                };
               deleteIds(params).then(res=>{
                    if (res.status == 200) {
                        this.initData();
                        this.$message({
                            type: 'success',
                            duration: '1500',
                            message: "删除信息类型成功！",
                            showClose: true
                        });      
                    } 
                }); 
                
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     duration: '1500',
                //     message: "已取消删除！",
                //     showClose: true
                // });  
            });
        },
        handleCheck(index,item){
            this.popData.title = '查看';
            this.popData.type = 'info-type-check';
            this.popData.data = item;
            this.infoTypeDetailFlag = true;
        },
        successBack(){
            this.initData();
            if(this.popData.type == 'info-type-add' || this.popData.type == 'info-type-update'){
                this.infoTypePopFlag = false;
            }
            if(this.popData.type == 'info-type-check'){
                this.infoTypeDetailFlag = false;
            }
        },
        pagingChange(index){
            this.dataList = [];
            this.paging.index = index - 1;
            this.initData();
        }
    },
   

}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.m-pic-box {
    overflow: hidden;
    display: inline-block;
    margin: 0 3px; 
    width: 34px;
    vertical-align: middle;
    overflow: hidden;
    line-height: 0;
    &.image-box{
        height: 34px;
        background: #f59307;  
        border-radius:50%;
        position: relative;
        .image{
            position: absolute;
            width: 76% !important;
            top:0;
            bottom:0;
            left:0;
            right: 0;
            margin:auto
        }
    } 
    .image{
        display: inline-block;
        width: 100%;
    }
}
</style>

