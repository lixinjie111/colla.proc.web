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
                        v-model="value1"
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
                prop="id"
                label="序号"
               >
            </el-table-column>
            <el-table-column
                prop="name"
                label="信息编号"
                >
            </el-table-column>
            <el-table-column
                prop="name"
                label="信息类型">
            </el-table-column>
            <el-table-column
                prop="name"
                label="信息状态">
            </el-table-column>
            <el-table-column
                prop="name"
                label="中心位置">
            </el-table-column>
            <el-table-column
                prop="name"
                label="发布时间">
            </el-table-column>
            <el-table-column
                prop="name"
                label="失效时间">
            </el-table-column>
            <el-table-column
                prop="name"
                label="信息内容">
            </el-table-column>
            <el-table-column
                prop="name"
                label="下发次数">
            </el-table-column>
            <el-table-column
                prop="name"
                label="信息来源">
            </el-table-column>
        </el-table>

        <el-row class="yk-paging">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="1000">
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
            let url = 'event/info/queryPage';
            let params = {
                code: this.search.code,
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

