<template>
    <div class="c-wrapper-20">
        <el-form :inline="true" size="mini" ref="searchForm" :model="searchKey" :rules="rules">
            <el-form-item label="信息类型名称：" prop="name">
                <el-input v-model.trim="searchKey.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" icon="el-icon-search" @click="searchClick" :loading="searchloading">查询</el-button>
                <el-button type="warning" plain icon="el-icon-setting" @click="resetClick">重置</el-button>
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
            <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
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
                    <span v-if="scope.row.eventCategory == 'TI01'">车辆异常信息</span>
                    <span v-if="scope.row.eventCategory == 'TI02'">道路异常信息</span>
                    <span v-if="scope.row.eventCategory == 'TI03'">交通管制信息</span>
                    <span v-if="scope.row.eventCategory == 'TI04'">天气服务信息</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="icon"
                label="图标"
                min-width="15%">
               <template slot-scope="scope">
                    <div class="m-pic-box image-box">
                        <img :src="iconPath+'rsi_'+scope.row.alertCategory+'.png'" class="image" @error="errorImg($event)">
                    </div>
                    <div class="m-pic-box image-pic">
                        <img :src="iconPath+'rsi_map_'+scope.row.alertCategory+'.png'" class="image" @error="errorImg($event)">
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

         <!-- 分页 -->
    <pagination :total="pageOption.total"  :page.sync="pageOption.page" :size.sync="pageOption.size" @pagination="initData"></pagination>

        <info-type-pop :popData="popData" v-if="infoTypePopFlag" @closeDialog="closeDialog" @successBack="successBack"></info-type-pop>
        <info-type-detail :popData="popData" v-if="infoTypeDetailFlag" @closeDialog="closeDialog" @successBack="successBack"></info-type-detail>
        
    </div>
</template>
<script>

import Pagination from '@/common/pagination';
import InfoTypePop from "./components/InfoTypePop.vue"
import InfoTypeDetail from "./components/InfoTypeDetail.vue"
import { infoQueryPage,queryDictionary,deleteIds} from '@/api/infoType'; 
export default {
    components: {
        InfoTypePop, InfoTypeDetail,Pagination,
    },
    data(){
        return {
            iconPath: window.config.iconPath,
            pageOption: {
                size: 10,
                total: 0,
                page: 1     
            },
            infoTypePopFlag: false,
            infoTypeDetailFlag: false,
            popData: {
                title: '提示',
                data: {},
                visible: true
            },
            historySearchKey: {},
            dataList: [],
            typeList: [],
            searchKey: {
                name: '',
            },
            tableLoading: false,
            searchloading:false
        }
    },
    created(){
        this.initData();
        this.initTypeList();
    },
    methods: {
        initPageOption() {
            this.dataList = [];
            this.pageOption.total = 0;
            this.pageOption.page = 1;
        },
        indexMethod(index) {
            return (this.pageOption.page-1) * this.pageOption.size + index + 1;
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
            let params = Object.assign({}, this.historySearchKey, {
                page:{
                    pageSize: this.pageOption.size,
                    pageIndex: this.pageOption.page == 0 ? 0 : this.pageOption.page -1,
                }
            });
            infoQueryPage(params).then(res=>{
                if (res.status == 200) {
                    this.dataList = res.data.list;
                    this.$refs.table.bodyWrapper.scrollTop = 0;
                    this.pageOption.total = res.data.totalCount;
                }
                this.tableLoading = false;
                this.searchloading = false;
            }).catch(err => {
                this.tableLoading = false;
                this.searchloading = false;
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
        getTypeCnName(type){
            if(!this.typeList){
                this.initTypeList(type)
            }else{
                
            }
        },
        searchClick(){
            this.$refs.searchForm.validate((valid) => {
                if (valid) {
                    this.searchloading = true;
                    this.historySearchKey = this.searchKey;
                    this.initPageOption();
                    this.initData();
                } else {
                    return false;
                }
            });
        },
        resetClick(){
            this.$refs.searchForm.resetFields();
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
    },
   

}
</script>
</script>
<style lang="scss" scoped>
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

