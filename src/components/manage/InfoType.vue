<template>
    <div class="yk-container">
        <el-row class="yk-search">
            
            <el-button size="mini" @click="handleAdd();">新增</el-button>
        </el-row>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                prop="date"
                label="序号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="信息类型"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="信息分类">
            </el-table-column>
            <el-table-column
                prop="date"
                label="ICON">
            </el-table-column>
            <el-table-column
                prop="name"
                label="默认信息内容">
            </el-table-column>
            <el-table-column
                prop="address"
                label="默认广播范围">
            </el-table-column>
            <el-table-column
                prop="address"
                label="管理"
                width="260">

                <template slot-scope="scope">
                    <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->

                    <el-button size="mini" @click="handleCheck(scope.$index, scope.row);">查看</el-button>
                    <el-button size="mini" @click="handleUpdate(scope.$index, scope.row);">编辑</el-button>
                    <el-button size="mini" @click="handleDelete(scope.$index, scope.row);">删除</el-button>
                </template>
                
                
            </el-table-column>
        </el-table>

        <el-dialog
            :title="popData.title"
            :visible.sync="popData.visible"
            width="30%"
            :before-close="handleClose"
            class="yk-left"
            >

            <span v-if="popData.type == 'info-type-delete'"> {{ popData.msg }} </span>
            <info-type-pop v-if="popData.type == 'info-type-add' || popData.type == 'info-type-update'"></info-type-pop>

            <span slot="footer" class="dialog-footer">
                <el-button  size="mini" @click="popData.visible = false">取 消</el-button>
                <el-button  size="mini" type="primary" @click="popData.visible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import InfoTypePop from "@/components/manage/InfoTypePop.vue"
export default {
    components: {
        InfoTypePop,
    },
    data(){
        return {
            popData: {
                title: '提示',
                type: 'info-type-normal',
                msg: '这是一段信息',
                data: {},
                visible: false,
            },
            tableData: [
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区'
                }, 
                {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区'
                }, 
                {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区'
                }, 
                {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区'
                }
            ]
        }
    },
    methods: {
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
            this.popData.data = {};
            this.popData.visible = true;
        },
        handleUpdate(index,item){
            this.popData.title = '修改';
            this.popData.type = 'info-type-update';
            this.popData.data = {};
            this.popData.visible = true;
        },
        handleDelete(index,item){
            // this.popData.title = '删除';
            // this.popData.type = 'info-type-delete';
            // this.popData.data = {};
            // this.popData.visible = true;
            let msg = '确认删除 ' + item.name + ' 吗？';
            this.$confirm(msg)
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        handleCheck(index,item){
            this.popData.title = '查看';
            this.popData.type = 'info-type-check';
            this.popData.data = {};
            this.popData.visible = true; 
        }
    },
    created(){

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

.yk-search{
    padding: 5px;
}

.yk-left{
    text-align: left!important;
}
</style>

