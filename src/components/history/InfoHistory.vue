<template>
    <div class="yk-container">
        <el-row class="yk-search">
            
            <!-- <el-col :span="6"> -->
                <div class="yk-block">
                    <label>信息类型：</label>
                    <el-input size="mini" v-model="search.eventType" class="yk-w180"></el-input>
                </div>                
            <!-- </el-col> -->
            
            <!-- <el-col :span="6"> -->
                <div class="yk-block">
                    <label>信息状态：</label>
                    <!-- <el-input size="mini" v-model="search.status" class="yk-w180"></el-input> -->
                    <el-select v-model="search.status" size="mini" placeholder="请选择">
                        <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </div>
                
            <!-- </el-col> -->
            
            <!-- <el-col :span="6"> -->
                <div class="yk-block">
                    <label>发布时间：</label>
                    <el-date-picker 
                        size="mini"
                        v-model="search.publishTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                
            <!-- </el-col> -->
            
            <!-- <el-col :span="6"> -->
                <div class="yk-block">
                   <label>信息来源：</label>
                    <!-- <el-input size="mini" v-model="search.datasource" class="yk-w180"></el-input>  -->

                    <el-select v-model="search.datasource" size="mini" placeholder="请选择">
                        <el-option
                            v-for="item in datasourceList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </div>                
            <!-- </el-col> -->
            <!-- <el-select size="mini" v-model="search.type">
                <template v-for="(item,index) in typeList">
                    <el-option :key="index" :label="item.name" :value="item.key">{{item.name}}</el-option>
                </template>
            </el-select> -->
            <div class="yk-block">
                <el-button size="mini" @click="handleSearch();">查询</el-button>
                <el-button size="mini" @click="handleFlush();">刷新</el-button>    
            </div>
            
            
        </el-row>
        <el-table
                :data="dataList"
                border
                style="width: 100%;"
                stripe
                :header-cell-style="{background:'#E6E6E6',color:'#606266',border: '0px'}"
                v-loading="isLoading">
            <el-table-column
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
                prop="taskCode"
                label="信息编号"
                >
            </el-table-column>

            <el-table-column
                prop="eventName"
                label="信息类型"
                width="120">
            </el-table-column>

            <el-table-column
                prop="status"
                label="信息状态" width="80">
                <template slot-scope="scope">
                    <!-- {{scope.row.status}} -->
                    <span v-show="scope.row.status == 1">有效</span>
                    <span v-show="scope.row.status == 2">失效</span>
                    <span v-show="scope.row.status == 3">完成</span>
                </template>
            </el-table-column>

            <el-table-column
                prop="longitude,latitude "
                label="中心位置">
                <template slot-scope="scope">
                    {{scope.row.longitude}} , {{scope.row.latitude}}
                </template>
            </el-table-column>

            <el-table-column
                prop="beginTime"
                label="发布时间">
            </el-table-column>

            <el-table-column
                prop="endTime"
                label="失效时间">
            </el-table-column>

            <el-table-column
                prop="content"
                label="信息内容">
            </el-table-column>

            <el-table-column
                prop="sendNumber"
                label="下发次数" 
                width="80">
            </el-table-column>

            <el-table-column
                prop="datasource"
                label="信息来源">
                <template slot-scope="scope">
                    <span v-if="scope.row.datasource == 1">平台运营人员</span>
                    <span v-else>{{scope.row.datasource}}</span>
                </template>
            </el-table-column>
        </el-table>

        <el-row class="yk-paging">
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="this.paging.size"
                :total="this.paging.total"
                @current-change="pagingChange">
            </el-pagination>
        </el-row>
    </div>
</template>
<script>


import TDate from '@/common/date.js'

export default {
    data(){
        return {
            dataList: [],
            search: {
                eventType: '',
                status: '',                
                publishTime: '',
                startTime: '',
                endTime: '',
                datasource: '',
            },
            paging: {
                index: 0,
                size: 10,
                total: 0,
            },
            statusList: [
                { id: 1, name: '有效', key: 1},
                { id: 2, name: '失效', key: 2},
                { id: 3, name: '完成', key: 3},
            ],
            datasourceList: [

            ],
            oldTime: null,
            timeInterval: 400,
            isLoading: false,
        }
    },
   
    methods: {
        
        init(){
            this.initSearch();
            this.initPaging();
            this.initData();
        },
        initPaging(){
            this.paging.index = 0;
            this.paging.total = 0;
            this.paging.size = 10;
        },
        initSearch(){
            this.search = {
                eventType: '',
                status: '',                
                publishTime: '',
                startTime: '',
                endTime: '',
                datasource: '',
            };
        },
        initData(type){
            this.isLoading = true;
           
            let url = 'event/task/queryPage';
            let params = {
                // code: this.search.code,
                eventType: this.search.eventType,
                status: this.search.status,
                beginTime: this.search.startTime,
                endTime: this.search.endTime,
                datasource: this.search.datasource,
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
                        this.$message("showPrompt", "获取设备列表失败  ！"); 
                    }

                    this.isLoading = false;
                   
                }
            );
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
                        
                    
                    } else {                     
                        this.$message("获取单位失败 ！"); 
                    }
                }
            );
        },
        handleSearch(){
            
            if(Array.isArray(this.search.publishTime)){                
                let start = this.search.publishTime[0];
                let end = this.search.publishTime[1];
                this.search.startTime = TDate.formatTime(start);
                this.search.endTime = TDate.formatTime(end);
            }
            
            this.initData();
        },
        handleFlush(){
            this.initSearch();
            this.initData();
        },
        pagingChange(value){
            this.paging.index = value - 1;
            this.initData();

            // this.saveWater();
        },

         // saving
        saveWater(){
            let newTime = (new Date()).getTime();
            
            if(!this.oldTime){
                this.oldTime = newTime;
            }

            let intval = this.newTime - this.oldTime;
            if( intval > this.timeInterval){
                console.log('do it !');
                this.oldTime = newTime;

                this.initData();

            }
        },
        saveWater2(){
            let timer = null;
            
        }
    },
    created(){
        this.initDatasourceList();
        this.init();
    },

}
</script>
<style scoped>
.yk-container{
    padding: 20px;
    overflow-y: auto;
}

.el-table td, .el-table th{
    padding: 5px 0px!important;
}

.yk-paging{
    padding: 5px 10px;
    text-align: right;
}

.yk-search{
    padding: 5px;
    text-align: left;
}

.yk-w180{
    width: 180px;
}

.yk-block{
    display: inline-block;
    vertical-align: top;
    margin-bottom: 5px;
}

</style>

