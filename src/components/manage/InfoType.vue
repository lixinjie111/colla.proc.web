<template>
    <div class="c-wrapper-20">
        <el-form :inline="true" size="mini">
            <el-form-item label="信息类型名称：">
                <el-input v-model.trim="search.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button type="primary" @click="handleFlush">刷新</el-button>
            </el-form-item>
            <el-form-item class="yk-right">
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table
                class="c-mb-70"
                max-height="620"
                :data="dataList"
                border
                stripe
                :header-cell-style="{background:'#E6E6E6',color:'#606266',border: '0px'}"
                v-loading="isLoading">
            <el-table-column
                fixed
                label="序号"
                type="index"
                width="60">
                <template slot-scope="scope">
                    <span>
                        {{scope.$index + paging.index * paging.size + 1}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="信息类型名称"
                width="160"
                >
            </el-table-column>
            <el-table-column
                prop="eventCategory"
                label="信息分类" width="160">
                <template slot-scope="scope">
                    <span v-if="scope.row.eventCategory == 'TI01'">车辆异常信息</span>
                    <span v-if="scope.row.eventCategory == 'TI02'">道路异常信息</span>
                    <span v-if="scope.row.eventCategory == 'TI03'">交通管制信息</span>
                    <span v-if="scope.row.eventCategory == 'TI04'">天气服务信息</span>
                    <!-- <span v-else>{{scope.row.eventCategory}}</span> -->
                </template>
            </el-table-column>
            <el-table-column
                prop="icon"
                label="图标" 
                width="80">
                <template slot-scope="scope">
                    <!-- <img :src="iconPath + scope.row.icon" class="image"> -->
                    <div class="image-box">
                        <img :src="iconPath + scope.row.icon" class="image">
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="content"
                label="默认信息内容">
            </el-table-column>
            <el-table-column
                prop="frequency"
                label="默认广播频率(ms)"
                width="120">
            </el-table-column>
            <el-table-column
                label="管理"
                width="260">

                <template slot-scope="scope">
                    <el-button size="mini" @click="handleCheck(scope.$index, scope.row);">查看</el-button>
                    <el-button size="mini" @click="handleUpdate(scope.$index, scope.row);">编辑</el-button>
                    <el-button size="mini" @click="handleDelete(scope.$index, scope.row);">删除</el-button>
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

        <info-type-pop :popData="popData" v-if="infoTypePopFlag" @closeDialog="closeDialog" @successBack="successBack"></info-type-pop>
        <info-type-detail :popData="popData" v-if="infoTypeDetailFlag" @closeDialog="closeDialog" @successBack="successBack"></info-type-detail>
        
    </div>
</template>
<script>


import InfoTypePop from "@/components/manage/InfoTypePop.vue"
import InfoTypeDetail from "@/components/manage/InfoTypeDetail.vue"

export default {
    components: {
        InfoTypePop, InfoTypeDetail,
    },
    data(){
        return {
            iconPath: window.cfg.iconPath,
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
            isLoading: false,
        }
    },
    methods: {
        closeDialog() {
            this.infoTypePopFlag = false;
            this.infoTypeDetailFlag = false;
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

            this.isLoading = true;

            let url = 'event/info/queryPage';
            let params = {
                name: this.search.name,
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
                        this.$message("获取信息类型列表失败  ！"); 
                    }

                    this.isLoading = false;
                }
                
            );
        },
        initTypeList(){
            let url = 'common/queryDictionary';
            let params = {
                parentCode: 'trafficType',
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        this.typeList = response.data ? response.data : [];
                        
                    } else {                     
                        this.$message("获取类型失败  ！"); 
                    }
                }
            );

        },
        getTypeCnName(type){
            if(!this.typeList){
                this.initTypeList(type)
            }else{
                
            }
        },
        handleSearch(){
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
                let url = 'event/info/delete/ids';
                let params = {
                    ids: [item.id]
                };
                this.$api.post( url,params,
                    response => {
                        if (response.status >= 200 && response.status < 300) {
                            this.initData();
                            this.$message.success("删除信息类型成功  ！"); 
                        } else {                     
                            this.$message.error("删除信息类型失败  ！"); 
                        }
                    }
                ); 
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
            this.paging.index = index - 1;
            this.initData();
        }
    },
    created(){
        this.init();
    },

}
</script>
<style scoped>
.yk-right {
    float: right;
}
.image-box{
    margin: 0 auto;
    width: 34px;
    height: 34px;       
    background-image: url('./ico-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    text-align: center;
}
.image{
    width: 20px;
    margin: 0 auto;
    position: relative;
    top: 50%; 
    transform: translateY(-50%);
}
</style>

