<template>
    <div class="yk-container">
        <el-row class="yk-search">
            <label>信息类型名称：</label>
            <el-input size="mini" v-model="search.name" class="yk-w180"></el-input>
            <!-- <el-select size="mini" v-model="search.type">
                <template v-for="(item,index) in typeList">
                    <el-option :key="index" :label="item.name" :value="item.key">{{item.name}}</el-option>
                </template>
            </el-select> -->
            <el-button size="mini" @click="handleSearch();">查询</el-button>
            <el-button size="mini" @click="handleFlush();">刷新</el-button>
            <el-button class="yk-right" size="mini" @click="handleAdd();">新增</el-button>
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
                prop="name"
                label="信息类型名称"
                >
            </el-table-column>
            <el-table-column
                prop="eventCategory"
                label="信息分类">
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
                label="图标">
            </el-table-column>
            <el-table-column
                prop="content"
                label="默认信息内容">
            </el-table-column>
            <el-table-column
                prop="frequency"
                label="默认广播范围">
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

        <el-row class="yk-paging">
            <el-pagination                
                background
                layout="prev, pager, next"               
                :page-size="this.paging.size"
                :total="this.paging.total"
                @current-change="pagingChange">
            </el-pagination>
        </el-row>

        <el-dialog
            :title="popData.title"
            :visible.sync="popData.visible"
            width="30%"
            :before-close="handleClose"
            class="yk-left"
            >

            <span v-if="popData.type == 'info-type-delete'"> {{ popData.msg }} </span>
            <info-type-pop v-if="popData.type == 'info-type-add' || popData.type == 'info-type-update'" :data="popData.data"></info-type-pop>
            <info-type-detail v-if="popData.type == 'info-type-check'" :data="popData.data"></info-type-detail>

            <span slot="footer" class="dialog-footer">
                <el-button  size="mini" @click="handleCancel();">取 消</el-button>
                <el-button  size="mini" type="primary" @click="handleOk();">确 定</el-button>
            </span>
        </el-dialog>
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
            paging: {
                index: 0,
                size: 10,
                total: 0,
                mini: true,
            },
            popData: {
                title: '提示',
                type: 'info-type-normal',
                msg: '这是一段信息',
                data: {},
                visible: false,
            },
            dataList: [],
            typeList: [],
            search: {
                name: '',
            },
            
        }
    },
    methods: {
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
            }
        },
        initData(){
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
        handleOk(){
            this.popData.visible = false;
            
            console.log('this.popData.data --- ' + JSON.stringify(this.popData.data))
            debugger
           

            this.successBack(this.popData.data);
        },
        handleCancel(){
            this.popData.visible = false
        },
        handleClose(done) {
            // this.$confirm('确认关闭？')
            // .then(_ => {
            //     done();
            // })
            // .catch(_ => {});
            done();
        },
        handleAdd(index,item){
            this.popData.title = '新增';
            this.popData.type = 'info-type-add';
            this.popData.data = this.initVo();
            this.popData.visible = true;
        },
        handleUpdate(index,item){
            this.popData.title = '修改';
            this.popData.type = 'info-type-update';
            this.popData.data = JSON.parse(JSON.stringify(item));
            this.popData.visible = true;
        },
        handleDelete(index,item){
            // this.popData.title = '删除';
            // this.popData.type = 'info-type-delete';
            // this.popData.data = {};
            // this.popData.visible = true;
            let that = this;
            let msg = '确认删除 ' + item.name + ' 吗？';
            this.$confirm(msg)
            .then(_ => {
                // console.log('handle delete --- ' + _)
                
                //  done();

                let url = 'event/info/delete/ids';
                let params = {
                    ids: [item.id]
                };
                this.$api.post( url,params,
                    response => {
                        if (response.status >= 200 && response.status < 300) {

                            this.initData();
                            this.$message("删除信息类型成功  ！"); 
                        } else {                     
                            this.$message("删除信息类型失败  ！"); 
                        }
                    }
                ); 
            })
            .catch(_ => {});
        },
        handleCheck(index,item){
            this.popData.title = '查看';
            this.popData.type = 'info-type-check';
            this.popData.data = item;
            this.popData.visible = true; 
        },
        successBack(data){
            if(this.popData.type == 'info-type-add'){
                this.addFn(data);
            }else if(this.popData.type == 'info-type-update'){
                this.updateFn(data);
            }else if(this.popData.type == 'info-type-delete'){
                this.deleteFn(data);
            }
        },
        addFn(data){
            let url = 'event/info/save';
            // let params = {
            //     eventCategory: data.eventCategory,
            //     name: data.name,

            // };
            let params = data;

            console.log(params);
            debugger

            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        this.initData();
                        this.$message("新增信息类型成功 ！"); 
                    } else {                     
                        this.$message("新增信息类型失败 ！"); 
                    }
                }
            );
        },
        updateFn(data){

            console.log(data);
            debugger

            let url = 'event/info/update';
            let params = {
                id: data.id,
                code: data.code,
                eventCategory: data.eventCategory,
                name: data.name,
                frequency: data.frequency,
                frequencyUnit: data.frequencyUnit,
                icon: data.icon,
                content: data.content,
                sendChannel: data.sendChannel,
                infoType: data.infoType,
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        this.initData();
                        this.$message("修改信息类型成功 ！"); 
                    } else {                     
                        this.$message("修改信息类型失败 ！"); 
                    }
                }
            );
        },
        deleteFn(data){
           let url = 'event/info/delete/ids';
            let params = {
                ids: [data.id]
            };
            this.$api.post( url,params,
                response => {
                    if (response.status >= 200 && response.status < 300) {

                        this.initData();
                        this.$message("删除信息类型成功 ！"); 
                    } else {                     
                        this.$message("删除信息类型失败 ！"); 
                    }
                }
            ); 
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
.yk-container{
    padding: 0px 20px 20px 20px;
}

.el-table td, .el-table th{
    padding: 5px 0px!important;
}

/* .el-button{
    padding: 5px 15px!important;
} */

.el-dialog__header{
    border-bottom: 1px solid #eeeaea;
} 
.el-dialog__footer{
      border-top: 1px solid #eeeaea;
}


.yk-search{
    padding: 5px;
    text-align: left;
}

.yk-left{
    text-align: left!important;
}
.yk-right{
    float: right;
}

.yk-paging{
    padding: 5px 10px;
    text-align: right;
}
.yk-w180{
    width: 180px;
}
</style>

