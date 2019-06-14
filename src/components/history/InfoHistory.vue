<template>
    <div class="yk-container">
        <el-row class="yk-search">
            
            <!-- <el-col :span="6"> -->
                <div class="yk-block">
                    <label>信息类型：</label>
                    <el-input size="mini" v-model="search.code" class="yk-w180"></el-input>
                </div>                
            <!-- </el-col> -->
            
            <!-- <el-col :span="6"> -->
                <div class="yk-block">
                    <label>信息状态：</label>
                    <el-input size="mini" v-model="search.code" class="yk-w180"></el-input>
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
                    <el-input size="mini" v-model="search.code" class="yk-w180"></el-input> 
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
                style="width: 100%">
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
                prop="eventType"
                label="信息类型">
            </el-table-column>
            <el-table-column
                prop="status"
                label="信息状态">
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
                label="下发次数">
            </el-table-column>
            <el-table-column
                prop="datasource"
                label="信息来源">
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
export default {
    data(){
        return {
            dataList: [],
            search: {
                code: '',
                publishTime: '',
            },
            paging: {
                index: 0,
                size: 10,
                total: 0,
            }
        }
    },
    methods: {
        init(){
            this.initData();
        },
        initData(){
            let url = 'event/task/queryPage';
            let params = {
                // code: this.search.code,
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
        handleSearch(){
            this.initData();
        },
        handleFlush(){
            this.search.code = '';
            this.initData();
        },
        pagingChange(value){
            this.paging.index = value - 1;
            this.initData();
        }
    },
    created(){
        this.init();
    },

}
</script>
<style scoped>
.yk-container{
    padding: 20px;
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

